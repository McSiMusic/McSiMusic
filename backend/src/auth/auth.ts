import { google } from "googleapis";
import { Express } from "express";
import { config } from "dotenv";
import url from "url";
import { User } from "../mongo/init";
import jwt from "jsonwebtoken";

export const COOKIE_NAME = "auth_token";
const conf = config().parsed;
const googlePath = "/auth/google";
const redirectUrl = `http://${conf?.HOST}:${conf?.PORT}${googlePath}`;
const oauth2Client = new google.auth.OAuth2(
  conf?.GOOGLE_CLIENT_ID,
  conf?.GOOGLE_CLIENT_SECRET,
  redirectUrl
);

const ouath2 = google.oauth2({ auth: oauth2Client, version: "v2" });
const scopes = ["https://www.googleapis.com/auth/userinfo.profile"];

export const initAuthEndpoint = (express: Express) => {
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    redirect_uri: redirectUrl,
  });

  express.get("/auth/me", (req, res) => {
    try {
      const decoded = jwt.verify(
        req.cookies[COOKIE_NAME],
        conf?.JWT_SECRET || "SECRET"
      );
      return res.send(decoded);
    } catch (err) {
      console.log(err);
      res.send(401);
    }
  });

  express.get("/auth", (req, res) => {
    res.writeHead(301, { Location: authorizationUrl });
    res.end();
  });

  express.get(googlePath, async (req, res) => {
    let q = url.parse(req.url, true).query;
    if (q.error) {
      console.error("Error:" + q.error);
      return;
    }

    // Get access and refresh tokens (if access_type is offline)
    let { tokens } = await oauth2Client.getToken(q.code as string);
    oauth2Client.setCredentials(tokens);
    const userinfo = (await ouath2.userinfo.get()).data;
    const token = jwt.sign(userinfo, conf?.JWT_SECRET || "SECRET");

    const { id, picture, name } = userinfo;
    const user = await User.findOne({ id }).exec();

    tokens.access_token;
    if (user === null) {
      new User({ id, picture, name }).save();
    }

    res.cookie(COOKIE_NAME, token, {
      maxAge: 900000,
      httpOnly: true,
      secure: false,
    });

    res.redirect(conf?.FRONTEND!);
  });
};

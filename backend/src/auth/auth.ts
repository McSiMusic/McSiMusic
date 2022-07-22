import { google } from "googleapis";
import { Express } from "express";
import { config } from "dotenv";
import url from "url";
import { User } from "../mongo/init";

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

  express.get("/auth", (req, res) => {
    res.redirect(authorizationUrl);
    res.end();
  });

  express.get(googlePath, async (req, res) => {
    let q = url.parse(req.url, true).query;
    if (q.error) {
      console.error("Error:" + q.error);
    } else {
      // Get access and refresh tokens (if access_type is offline)
      let { tokens } = await oauth2Client.getToken(q.code as string);
      oauth2Client.setCredentials(tokens);
      const userinfo = (await ouath2.userinfo.get()).data;
      const { id, picture, name } = userinfo;
      const user = await User.findOne({ id }).exec();

      tokens.access_token;
      if (user === null) {
        new User({ id, picture, name }).save();
      }
    }
  });
};

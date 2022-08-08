import { getChannelDataFromBuffer } from "../services/audioService";
const MusicTempo = require("music-tempo");

export const getBpm = async (data: Buffer) => {
  const channelData = await getChannelDataFromBuffer(data);
  var mt = new MusicTempo(channelData);
  return mt.tempo;
};

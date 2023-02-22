import { getChannelDataFromBuffer } from "../services/audioService";
import { mean } from "../utils/math";
const MusicTempo = require("music-tempo");

export const getBpm = async (data: Buffer) => {
  const channelData = await getChannelDataFromBuffer(data);
  const meanChannelData = Array(channelData[0].length)
    .fill(0)
    .map((_, i) => mean(Array(channelData.length).fill(0).map((_, j) => channelData[j][i])))
    
  var mt = new MusicTempo(meanChannelData);
  return mt.tempo;
};

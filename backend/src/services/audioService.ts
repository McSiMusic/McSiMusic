import { Asset } from "av";
require("mp3");

export const getChannelDataFromBuffer = async (data: Buffer): Promise<number[][]> => {
  const bufferResult = await new Promise<{ audioBuffer: Float32Array, channels?: number}>((resolve, reject) => {
    const asset = Asset.fromBuffer(data)
    asset.on('error', err => {
      console.error(err);
			reject(err)
		})

    asset.decodeToBuffer((buffer) => {
      if (asset.format == null) {
        return reject("Unknown format")
      }
      resolve({ audioBuffer: buffer, channels: asset.format?.channelsPerFrame })
    });
  })
 
  const channelCount = bufferResult.channels || 1;
  const result: number[][] = Array(channelCount).fill([]);
  bufferResult.audioBuffer.forEach((value, i) => result[i % channelCount].push(value));

  return result
};
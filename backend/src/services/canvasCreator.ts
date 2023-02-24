import { Track } from "../mongo/init";
import { getChannelDataFromBuffer } from "./audioService";
import { createCanvas } from "canvas";
import { absMean, mean, squareMean } from "../utils/math";

// https://stackoverflow.com/questions/26663494/algorithm-to-draw-waveform-from-audio
export const createAudioWaveForm = async (trackId: string) => {
  const track = await Track.findById(trackId);
  if (track === null) throw new Error("track not found");

  let channelData = await getChannelDataFromBuffer(track.track!);

  const width = 1200;
  const height = 256;
  const canvas = createCanvas(width, height);
  const waveHeight = height / 2;
  const length = channelData[0].length;
  
  const bufferSize = Math.ceil(length / width);
  const filteredData = [];  

  for (let i = 0; i < length / bufferSize; i++) {
    const buffers = channelData.map(data => {
       const buffer = data.slice(i * bufferSize, (i + 1) * bufferSize);
       return absMean(buffer) * 2
    });


    filteredData.push(absMean(buffers));
  }

  const context = canvas.getContext("2d");
  context.strokeStyle = "#f5b316";
  context.beginPath();

  filteredData.forEach((v, i) => {
    const value = Math.max(v / 2 * waveHeight, 2);
    context?.moveTo(i, waveHeight + value);
    context?.lineTo(i, waveHeight - value);
  });
  context.stroke();
  const result = canvas.createPNGStream();
  return result;
};

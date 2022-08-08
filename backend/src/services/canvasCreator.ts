import { Track } from "../mongo/init";
import { getChannelDataFromBuffer } from "./audioService";
import { createCanvas } from "canvas";
import { mean } from "../utils/math";

export const createAudioWaveForm = async (trackId: string) => {
  const track = await Track.findById(trackId);
  if (track === null) throw new Error("track not found");

  const channelData = await getChannelDataFromBuffer(track.track!);

  const canvas = createCanvas(1200, 200);
  const width = canvas.width;
  const height = canvas.height;
  const waveHeight = height / 2;

  const context = canvas.getContext("2d");
  const bufferSize = 150;
  const filteredData = [];
  for (let i = 0; i < channelData.length / bufferSize; i++) {
    const buffer = channelData.slice(i * bufferSize, (i + 1) * bufferSize);
    filteredData.push(mean(buffer));
  }
  context.strokeStyle = "#f5b316";
  context.beginPath();
  context.moveTo(0, height / 2);

  const step = width / filteredData.length;
  filteredData.forEach((v, i) => {
    context?.lineTo(step * i, waveHeight - (v * waveHeight) / 255);
  });
  context.stroke();
  const result = canvas.createPNGStream();
  return result;
};

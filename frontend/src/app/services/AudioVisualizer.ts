import { Injectable } from '@angular/core';
import { mean, sum } from 'lodash';

@Injectable({ providedIn: 'root' })
export class AudioVisualizer {
  fillCanvas = (audioBuffer: AudioBuffer, canvas: HTMLCanvasElement) => {
    const mono = this._getMonoChanel(audioBuffer);

    const width = canvas.width;
    const height = canvas.height;
    const waveHeight = height / 2;

    const context = canvas.getContext('2d');
    if (context === null) return;

    const bufferSize = 10;
    const filteredData = [];

    for (let i = 0; i < mono.length / bufferSize; i++) {
      const buffer = mono.slice(i * bufferSize, (i + 1) * bufferSize);
      filteredData.push(mean(buffer));
    }

    context.strokeStyle = '#f5b316';
    context.beginPath();
    context.moveTo(0, height / 2);

    const step = width / filteredData.length;
    filteredData.forEach((v, i) => {
      context?.lineTo(step * i, waveHeight - v * waveHeight);
    });
    context.stroke();
  };

  private _getMonoChanel = (audioBuffer: AudioBuffer) => {
    const channelsNum = audioBuffer.numberOfChannels;
    if (channelsNum === 1) return [...audioBuffer.getChannelData(0)];

    const result = [];
    const chanelIndexes = [...Array(channelsNum).keys()];
    const channelsData = chanelIndexes.map((i) =>
      audioBuffer.getChannelData(i)
    );

    for (let i = 0; i < audioBuffer.length; i++) {
      const averageValue =
        sum(chanelIndexes.map((chanelIndex) => channelsData[chanelIndex][i])) /
        channelsNum;

      result.push(averageValue);
    }

    return result;
  };
}

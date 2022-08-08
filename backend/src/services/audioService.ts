const decode = require("audio-decode");

export const getChannelDataFromBuffer = async (data: Buffer) => {
  const audioData = await decode(data);
  var channelData = [];
  // Take the average of the two channels
  if (audioData.numberOfChannels == 2) {
    var channel1Data = audioData.getChannelData(0);
    var channel2Data = audioData.getChannelData(1);
    var length = channel1Data.length;
    for (var i = 0; i < length; i++) {
      channelData[i] = (channel1Data[i] + channel2Data[i]) / 2;
    }
  } else {
    channelData = audioData.getChannelData(0);
  }

  return channelData;
};

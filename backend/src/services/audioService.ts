export const getChannelDataFromBuffer = async (data: Buffer): Promise<number[][]> => {
  const { default: decode } = await import("@audio/decode");
  const audioBuffer = await decode(data);

  return audioBuffer.channelData.map((channel) => Array.from(channel));
};
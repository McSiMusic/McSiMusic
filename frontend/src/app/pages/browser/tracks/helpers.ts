export const sToTime = (duration: number) => {
  var seconds = Math.floor(duration % 60),
    minutes = Math.floor((duration / 60) % 60),
    hours = Math.floor((duration / (60 * 60)) % 24);

  const hoursString = hours < 10 ? '0' + hours : hours;
  const minutesString = minutes < 10 ? '0' + minutes : minutes;
  const secondsString = seconds < 10 ? '0' + seconds : seconds;

  return hours
    ? `${hoursString}:${minutesString}:${secondsString}`
    : `${minutesString}:${secondsString}`;
};

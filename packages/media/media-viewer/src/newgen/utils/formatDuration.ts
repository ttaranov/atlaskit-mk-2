const pad = (n: number) => {
  return n < 10 ? `0${n}` : n;
};

export const formatDuration = (seconds: number) => {
  const totalSeconds = parseInt(`${seconds}`, 10);
  const hours = Math.floor(totalSeconds / 3600);

  let remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  remainingSeconds %= 60;

  const prettyHoursWithSeparator = hours > 0 ? hours + ':' : '';
  const prettyMinutes = prettyHoursWithSeparator ? pad(minutes) : minutes;

  return `${prettyHoursWithSeparator}${prettyMinutes}:${pad(remainingSeconds)}`;
};

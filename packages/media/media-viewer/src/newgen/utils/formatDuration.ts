// TODO: Add tests
export const formatDuration = (duration: number) => {
  const seconds = parseInt(`${duration}`, 10);
  const hours = Math.floor(seconds / 3600);
  const prettyMinutes = Math.floor((seconds - hours * 3600) / 60);
  const prettySeconds = seconds - hours * 3600 - prettyMinutes * 60;
  const secondsPad = prettySeconds < 10 ? '0' : '';

  return `${prettyMinutes}:${secondsPad}${prettySeconds}`;
};

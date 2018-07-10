/**
 * Typescript only supports `padStart` with target ES2017
 */
const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * Append timestamp to a filename, this function assumes `name` will have
 * filename and extension. eg.- 123.xyz (valid), 123 (invalid)
 * @param name filename with extension
 * @param time unix timestamp
 */
export const appendTimestamp = (name: string, time: number) => {
  const pos = name.lastIndexOf('.');
  const fileName = name.substring(0, pos);
  const extension = name.substring(pos);

  const date = new Date(time);
  const formattedDate = `${date.getUTCFullYear()}${padZero(
    date.getUTCMonth() + 1,
  )}${padZero(date.getUTCDate())}`;
  const formattedTime = `${padZero(date.getUTCHours())}${padZero(
    date.getUTCMinutes(),
  )}${padZero(date.getUTCSeconds())}`;

  return `${fileName}-${formattedDate}-${formattedTime}${extension}`;
};

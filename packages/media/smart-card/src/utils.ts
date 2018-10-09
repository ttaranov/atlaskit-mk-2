export function relativeTime(time: string) {
  return new Date(Date.parse(time)).toDateString();
}

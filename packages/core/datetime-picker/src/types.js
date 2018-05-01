// @flow

export type Event = {
  key: string,
  // flowlint-next-line unclear-type:off
  preventDefault: Function,
  // flowlint-next-line unclear-type:off
  stopPropagation: Function,
  // flowlint-next-line unclear-type:off
  target: { blur: Function, className: string, focus: Function, value: string },
};

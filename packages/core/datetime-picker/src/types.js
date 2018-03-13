// @flow

export type Event = {
  key: string,
  preventDefault: Function,
  stopPropagation: Function,
  target: { blur: Function, className: string, focus: Function, value: string },
};

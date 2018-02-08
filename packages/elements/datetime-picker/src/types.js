// @flow

export type Event = {
  key: string,
  preventDefault: Function,
  stopPropagation: Function,
  target: { value: string },
};
export type Handler = (e: any) => void;

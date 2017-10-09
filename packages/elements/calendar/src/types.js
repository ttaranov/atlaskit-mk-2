// @flow

export type Date = {
  day: number,
  month: number,
  year: number,
};

export type EventChange = Date;

export type EventSelect = EventChange & {
  iso: number,
};

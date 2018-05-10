// @flow

export type ArrowKeys = 'left' | 'up' | 'right' | 'down';

export type DateObj = {|
  day: number,
  month: number,
  year: number,
|};

// Using object spreading rather than intersection so it displays better in the atlaskit docs
// Exact object types are required otherwise spreading makes all properties optional.
export type ChangeEvent = {|
  ...DateObj,
  iso: string,
  // There is not a way to union existing string literal union types so we have to repeat ourselves...
  type: 'left' | 'up' | 'right' | 'down' | 'prev' | 'next',
|};

export type SelectEvent = {|
  ...DateObj,
  iso: string,
|};

// @flow
import React from 'react';
import { type Context } from './Results/types';

const defaultState: Context = {
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  unregisterResult: () => {},
  getIndex: n => Number(n),
};

// $FlowFixMe - flow outdated. does not support createContext yet.
export const ResultContext = React.createContext(defaultState);
// $FlowFixMe - flow outdated. does not support createContext yet.
export const SelectedResultIdContext = React.createContext(null);

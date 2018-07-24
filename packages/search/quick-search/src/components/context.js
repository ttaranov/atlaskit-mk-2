// @flow
import React from 'react';
import { type Context } from './Results/types';

const defaultState: Context = {
  isDirty: false,
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  getIndex: n => Number(n),
};

// $FlowFixMe - flow outdated. does not support createContext yet.
export const ResultContext = React.createContext(defaultState);
// $FlowFixMe - flow outdated. does not support createContext yet.
export const SelectedResultIdContext = React.createContext(null);

// @flow
import React from 'react';
import { type Context } from './Results/types';

const defaultState: Context = {
  isDirty: false,
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  getIndex: n => {
    return null;
  },
};

// $FlowFixMe
export const ResultContext = React.createContext(defaultState);
// $FlowFixMe
export const SelectedResultIdContext = React.createContext(null);

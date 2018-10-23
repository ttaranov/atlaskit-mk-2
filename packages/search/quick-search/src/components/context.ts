import * as React from 'react';
import { Context } from './Results/types';

const defaultState: Context = {
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  unregisterResult: () => {},
  getIndex: n => Number(n),
};

export const ResultContext = React.createContext(defaultState);
export const SelectedResultIdContext = React.createContext<
  string | number | null
>(null);

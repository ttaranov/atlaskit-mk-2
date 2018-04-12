// @flow
import React from 'react';

const defaultState = {
  isDirty: false,
  sendAnalytics: () => {},
  onMouseEnter: () => {},
  onMouseLeave: () => {},
  registerResult: () => {},
  getIndex: () => {},
};

// $FlowFixMe: createContext not in type lib yet
export const ResultContext = React.createContext(defaultState);
// $FlowFixMe: createContext not in type lib yet
export const SelectedResultIdContext = React.createContext(null);

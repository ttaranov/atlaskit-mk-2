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

export const ResultContext = React.createContext(defaultState);
export const SelectedResultIdContext = React.createContext(null);

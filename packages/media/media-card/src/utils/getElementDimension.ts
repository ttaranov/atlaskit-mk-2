import * as React from 'react';
import * as ReactDOM from 'react-dom';
export type ElementDimension = 'height' | 'width';

export const getElementDimension = (
  component: React.Component,
  dimension: ElementDimension,
): number => {
  const element = ReactDOM.findDOMNode(component);
  const { [dimension]: dimensionValue } = element.getBoundingClientRect();

  return Math.round(dimensionValue);
};

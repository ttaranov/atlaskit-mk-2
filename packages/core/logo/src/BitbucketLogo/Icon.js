// @flow
/* eslint-disable max-len */
import React, { Component } from 'react';
import uuid from 'uuid/v1';

import { type Props, DefaultProps } from '../constants';
import Wrapper from '../styledWrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uuid();
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="100.866322%" y1="25.6261254%" x2="46.5685299%" y2="75.2076031%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M26.75125,13.1176316 L19.7125,13.1176316 L18.53125,20.0504386 L13.65625,20.0504386 L7.9,26.9266667 C8.08244769,27.0853527 8.31506036,27.173594 8.55625,27.175614 L23.83375,27.175614 C24.2052946,27.180424 24.5243287,26.9108682 24.58375,26.5419298 L26.75125,13.1176316 Z" fill="url(#${id})"></path>
      <path d="M5.125,6 C4.9034367,5.99712567 4.69194966,6.09294508 4.54727018,6.26175474 C4.40259069,6.4305644 4.3395285,6.65508453 4.375,6.87508772 L7.55875,26.315614 C7.59788069,26.5521357 7.71872409,26.7671859 7.9,26.9228947 L7.9,26.9228947 C8.08244769,27.0815808 8.31506036,27.169822 8.55625,27.1718421 L14.46625,20.0504386 L13.6375,20.0504386 L12.33625,13.1176316 L26.75125,13.1176316 L27.76375,6.88263158 C27.8013457,6.66342534 27.7408428,6.43870373 27.5984139,6.26853487 C27.455985,6.09836602 27.2461508,6.00009878 27.025,6 L5.125,6 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class BitbucketIcon extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    const { label, iconGradientStart, iconGradientStop } = this.props;
    return (
      <Wrapper
        aria-label={label}
        dangerouslySetInnerHTML={{
          __html: svg(String(iconGradientStart), String(iconGradientStop)),
        }}
        {...this.props}
      />
    );
  }
}

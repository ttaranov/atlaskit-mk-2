// @flow
/* eslint-disable max-len */
import React, { Component } from 'react';
import uuid from 'uuid';

import { type Props, DefaultProps } from '../constants';
import Wrapper from '../styledWrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uuid();
  return `<canvas height="32" width="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
    <defs>
      <linearGradient x1="108.695%" x2="12.439%" y1="-14.936%" y2="45.215%" id="${id}-1">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="81.591%" x2="-11.571%" y1="57.461%" y2="117.582%" id="${id}-2">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">     
      <path d="M15.9669691,11.9921053 C13.3718335,9.39666304 13.3591857,5.19286199 15.938657,2.58185118 L6.91061706,11.6063521 L11.6316697,16.3274047 L15.9669691,11.9921053 Z" fill="currentColor"/>
      <path d="M15.9669691,29.3616152 C17.2195568,28.1097726 17.9233158,26.4114623 17.9233158,24.6405626 C17.9233158,22.8696629 17.2195568,21.1713527 15.9669691,19.91951 L7.26805808,11.2489111 L3.31143376,15.2055354 C2.89743442,15.6200502 2.89743442,16.291565 3.31143376,16.7060799 L15.9669691,29.3616152 Z" fill="url(#${id}-1"/>
      <path d="M20.2951906,15.5912886 L15.9669691,19.91951 C17.2195568,21.1713527 17.9233158,22.8696629 17.9233158,24.6405626 C17.9233158,26.4114623 17.2195568,28.1097726 15.9669691,29.3616152 L25.0162432,20.3123412 L20.2951906,15.5912886 Z" fill="url(#${id}-2"/>
      <path d="M28.6225045,15.2055354 L15.9669691,2.55 L15.9280399,2.58892922 C13.3485687,5.19994003 13.3612164,9.40374108 15.9563521,11.9991833 L24.6623412,20.6662432 L28.6225045,16.7060799 C29.0365039,16.291565 29.0365039,15.6200502 28.6225045,15.2055354 Z" fill="currentColor"/>
    </g>
  </svg>`;
};

export default class JiraSoftwareIcon extends Component<Props> {
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

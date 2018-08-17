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
        <linearGradient x1="62.272%" x2="15.737%" y1="26.041%" y2="68.741%" id="${id}">
            <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="18%"></stop>
            <stop stop-color="${iconGradientStop}" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M10.6584152,5 L10.6584152,9.39679183 C10.6584152,15.48435 7.60464338,17.8346351 3.71947823,18.1903755 C3.30945638,18.231579 2.99793812,18.5777104 3.00000321,18.9897922 C3.00000321,20.6285964 3.00000321,24.5017703 3.00000321,26.1845425 C2.9996704,26.4044035 3.08990281,26.6146964 3.24947191,26.7659467 C3.40904102,26.9171971 3.62385939,26.9960518 3.84338782,26.9839592 C13.572289,26.4883208 19.4320134,19.3895005 19.4320134,10.5759315 L19.459993,10.5759315 L19.459993,5 L10.6584152,5 Z" fill="url(#${id})"></path>
      <path d="M30.1816696,25.829953 L19.8806163,5 L10.6588351,5 L21.5394976,26.3336133 C21.7449071,26.7337742 22.1569759,26.9853368 22.6067778,26.9851739 L29.4741467,26.9851739 C29.7493704,26.982283 30.0037535,26.8380195 30.1475068,26.6033038 C30.29126,26.3685881 30.304166,26.0764302 30.1816696,25.829953 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class StrideIcon extends Component<Props> {
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

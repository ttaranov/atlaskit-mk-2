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
        <linearGradient x1="76.008%" x2="3.205%" y1="30.816%" y2="70.705%" id="${id}">
            <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="18%"></stop>
            <stop stop-color="${iconGradientStop}" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M10.6588351,5 L10.6588351,9.39703478 C10.6588351,15.4849293 7.60489461,17.8353443 3.71951478,18.1911043 C3.30947027,18.2323101 2.99793479,18.5784607 3,18.9905652 C3,20.62946 3,24.5028479 3,26.185713 C2.99966718,26.4055862 3.08990457,26.6158907 3.24948249,26.7671494 C3.40906041,26.9184081 3.62389065,26.9972672 3.84343122,26.9851739 C13.57287,26.4895082 19.4329182,19.3902957 19.4329182,10.5762396 L19.4608993,10.5762396 L19.4608993,5 L10.6588351,5 Z" fill="url(#${id})"></path>
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

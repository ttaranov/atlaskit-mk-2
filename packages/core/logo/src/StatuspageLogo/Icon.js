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
        <linearGradient x1="50%" y1="-8.10423826%" x2="50%" y2="68.0985109%" id="${id}">
            <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
            <stop stop-color="${iconGradientStop}" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <ellipse fill="url(#${id})" cx="16.0000005" cy="19.5878182" rx="5.4000001" ry="5.39981818"></ellipse>
      <path d="M4.46421053,13.3410909 L7.42631579,16.7750909 C7.5358031,16.9011063 7.69232293,16.9789144 7.86086903,16.9911129 C8.02941512,17.0033115 8.19592493,16.9488828 8.32315789,16.84 C13.12,12.6363636 19.0757895,12.6363636 23.8694737,16.84 C23.9967066,16.9488828 24.1632165,17.0033115 24.3317626,16.9911129 C24.5003086,16.9789144 24.6568285,16.9011063 24.7663158,16.7750909 L27.7284211,13.3410909 C27.9522632,13.0812594 27.9198196,12.6932914 27.6557895,12.4725455 C20.6957895,6.51018182 11.4968421,6.51018182 4.53684211,12.4694545 C4.40907053,12.5755828 4.32962832,12.7270623 4.31600587,12.8905424 C4.30238342,13.0540226 4.35569762,13.2161 4.46421053,13.3410909 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class StatuspageIcon extends Component<Props> {
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

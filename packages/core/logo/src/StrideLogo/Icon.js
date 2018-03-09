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
        <linearGradient x1="76.0077856%" y1="30.8164837%" x2="3.20549956%" y2="70.7051948%" id="${id}">
            <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="18%"></stop>
            <stop stop-color="${iconGradientStop}" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M10.6643478,6 L10.6643478,10.0267857 C10.6643478,15.6020536 8.00695652,17.7545536 4.62608696,18.0803571 C4.26928606,18.1180932 3.99820296,18.4350964 4,18.8125 C4,20.3133929 4,23.860625 4,25.4017857 C3.99971039,25.6031446 4.0782306,25.7957406 4.21708759,25.9342627 C4.35594458,26.0727847 4.54287947,26.1450036 4.73391304,26.1339286 C13.2,25.68 18.2991304,19.1785714 18.2991304,11.1066964 L18.3234783,11.1066964 L18.3234783,6 L10.6643478,6 Z" fill="url(#${id})"></path>
      <path d="M27.6521739,25.0759821 L18.6886957,6 L10.6643478,6 L20.1321739,25.5372321 C20.3109114,25.9036978 20.6694737,26.1340777 21.0608696,26.1339286 L27.0365217,26.1339286 C27.2760081,26.1312811 27.49736,25.9991651 27.6224471,25.7842135 C27.7475342,25.5692619 27.7587644,25.301705 27.6521739,25.0759821 Z" fill="currentColor"></path>
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

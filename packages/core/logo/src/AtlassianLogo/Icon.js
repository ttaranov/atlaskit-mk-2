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
      <linearGradient x1="99.6882572%" y1="15.804243%" x2="44.6309528%" y2="90.9100676%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M15.0859556,5.36213573 C12.1930983,9.76589808 11.8592185,15.3517486 14.2073011,20.0621357 L18.0383488,27.6426063 C18.1538739,27.8712192 18.3900332,28.0156409 18.6483769,28.0156651 L26.5933685,28.0156651 C26.829749,28.015643 27.0492663,27.8945407 27.1735336,27.6956023 C27.2978009,27.496664 27.3091002,27.2482541 27.2033966,27.0390769 C27.2033966,27.0390769 16.5147056,5.88695926 16.2460792,5.35790043 C16.1377032,5.13815012 15.9118188,4.99910211 15.6646746,5.00000436 C15.4175304,5.00090662 15.1926893,5.1416001 15.0859556,5.36213573 L15.0859556,5.36213573 Z" fill="currentColor"></path>
      <path d="M10.905026,15.6373192 C10.7643638,15.4552138 10.5377304,15.3590845 10.3074259,15.3838399 C10.0771214,15.4085953 9.876643,15.5506349 9.7787929,15.758378 L4.07199796,27.0468486 C3.96629436,27.2560258 3.97759362,27.5044356 4.10186092,27.703374 C4.22612822,27.9023123 4.44564559,28.0234147 4.68202605,28.0234368 L12.6284446,28.0234368 C12.8884726,28.0294095 13.1276165,27.8831625 13.2384727,27.650378 C14.9526159,24.146025 13.9137845,18.8176721 10.905026,15.6373192 Z" fill="url(#${id})"></path>
    </g>
  </svg>`;
};

export default class AtlassianIcon extends Component<Props> {
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

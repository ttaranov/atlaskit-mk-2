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
      <linearGradient x1="38.041%" y1="6.637%" x2="59.856%" y2="63.778%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M18.485,13.0668421 L26.3493421,13.0973684 C26.8126011,13.0995287 27.2350032,13.3628641 27.4408884,13.777864 C27.6467735,14.1928638 27.6009092,14.6885104 27.3223684,15.0586842 L15.7147368,30.5584211 C13.9621814,29.2495758 12.801465,27.2980305 12.488019,25.1332492 C12.1745729,22.9684678 12.7340829,20.7678451 14.0434211,19.0156579 L18.485,13.0668421 Z" fill="url(#${id})"></path>
      <path d="M14.0396053,19.0156579 L6.22105263,18.9660526 C5.75779361,18.9638923 5.33539149,18.700557 5.12950634,18.2855571 C4.92362119,17.8705572 4.96948557,17.3749106 5.24802632,17.0047368 L16.7411842,1.65 C18.4937397,2.9588453 19.6544561,4.91039056 19.9679021,7.0751719 C20.2813481,9.23995324 19.7218382,11.4405759 18.4125,13.1927632 L14.0396053,19.0156579 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class JiraServiceDeskIcon extends Component<Props> {
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

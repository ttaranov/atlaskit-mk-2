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
    <linearGradient x1="89.222%" x2="60.897%" y1="9.299%" y2="38.681%" id="${id}-1">
      <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
      <stop stop-color="${iconGradientStop}" offset="100%"></stop>
    </linearGradient>
    <linearGradient x1="90.494%" x2="59.847%" y1="7.979%" y2="39.77%" id="${id}-2">
      <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
      <stop stop-color="${iconGradientStop}" offset="100%"></stop>
    </linearGradient>
  </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M26.0406546,5 L14.9983562,5 C14.9983562,6.32163748 15.5233746,7.58914413 16.4579134,8.52368295 C17.3924523,9.45822178 18.6599589,10 19.9815964,10 L22,10 L22,11.9465283 C22.0017623,14.6974491 24.2474348,16.9265768 26.9983562,16.9265762 L26.9983562,5.95770152 C26.9983562,5.42877757 26.5695786,5 26.0406546,5 Z" fill="currentColor"></path>
      <path d="M20.0371121,11 L8.99506849,11 C8.99682988,13.7504065 11.2260351,15.9982386 13.9764416,16 L16,16 L16,17.9451836 C16,19.2671728 16.5356604,20.5350167 17.4704479,21.4698042 C18.4052354,22.4045917 19.6730793,22.9297499 20.9950685,22.9297499 L20.9950685,11.9579564 C20.9950685,11.4288917 20.5661768,11 20.0371121,11 Z" fill="url(#${id})"></path>
      <path d="M14.0371121,17 L2.99506849,17 C2.99683124,19.7516528 5.22798136,22.0000006 7.97963475,22 L10,22 L10,23.9451836 C9.99999492,26.6943468 12.2459104,28.9244664 14.9950685,28.9297499 L14.9950685,17.9579564 C14.9950685,17.4288917 14.5661768,17 14.0371121,17 Z" fill="url(#${id})"></path>
    </g>
  </svg>`;
};

export default class JiraIcon extends Component<Props> {
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

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
      <linearGradient x1="98.0308675%" y1="0.160599572%" x2="58.8877062%" y2="40.7655246%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="18%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M26.9366667,4 L15.41,4 C15.41,5.3800098 15.9582068,6.703498 16.934021,7.67931228 C17.9098353,8.65512657 19.2333235,9.20333333 20.6133333,9.20333333 L22.7366667,9.20333333 L22.7366667,11.2533333 C22.7385054,14.1244521 25.0655479,16.4514946 27.9366667,16.4533333 L27.9366667,5 C27.9366667,4.44771525 27.4889514,4 26.9366667,4 Z" fill="currentColor"></path>
      <path d="M21.2333333,9.74333333 L9.70666667,9.74333333 C9.70850536,12.6144521 12.0355479,14.9414946 14.9066667,14.9433333 L17.03,14.9433333 L17.03,17 C17.0336786,19.8711178 19.3622132,22.196669 22.2333333,22.1966667 L22.2333333,10.7433333 C22.2333333,10.1910486 21.7856181,9.74333333 21.2333333,9.74333333 Z" fill="url(#${id})"></path>
      <path d="M15.5266667,15.4833333 L4,15.4833333 C4,18.357055 6.32961169,20.6866667 9.20333333,20.6866667 L11.3333333,20.6866667 L11.3333333,22.7366667 C11.3351657,25.6051863 13.6581518,27.9311544 16.5266667,27.9366667 L16.5266667,16.4833333 C16.5266667,15.9310486 16.0789514,15.4833333 15.5266667,15.4833333 Z" fill="url(#${id})"></path>
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

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
      <linearGradient x1="17.193%" y1="20.033%" x2="88.243%" y2="53.918%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="17%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M15.5193939,20.5224242 C15.5193939,25.20446 19.3149339,29 23.9969697,29 L23.9969697,12.1078788 L15.5193939,17.9145455 L15.5193939,20.5224242 Z" fill="url(#${id})"></path>
      <path d="M23.9969697,12.1078788 L23.9969697,4.26454545 C23.9961315,3.79791901 23.7375983,3.36992522 23.3249582,3.15205124 C22.912318,2.93417725 22.4130783,2.9620669 22.0272727,3.22454545 L2.35,16.6578788 C4.98320643,20.5274016 10.2540962,21.5307928 14.1248485,18.8993939 L23.9969697,12.1078788 Z" fill="currentColor"></path>
    </g>
  </svg>`;
};

export default class JiraCoreIcon extends Component<Props> {
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

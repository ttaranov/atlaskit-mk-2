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
      <linearGradient x1="89.3274705%" y1="41.8054431%" x2="36.7523479%" y2="75.9322249%" id="${id}-1">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="28.2635218%" y1="81.6596195%" x2="80.4180561%" y2="47.7674419%" id="${id}-2">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M15.8881081,27.9242105 C16.9881804,26.8071817 17.6062496,25.2917664 17.6062496,23.7115789 C17.6062496,22.1313915 16.9881804,20.6159762 15.8881081,19.4989474 L15.8881081,19.4989474 L8.24837838,11.7621053 L4.77351351,15.2926316 C4.40992283,15.6625064 4.40992283,16.2617042 4.77351351,16.6315789 L15.8881081,27.9242105 L15.8881081,27.9242105 Z" fill="currentColor"></path>
      <path d="M27.0027027,15.2926316 L15.8881081,4 L15.8881081,4 L15.8539189,4.03473684 L15.8539189,4.03473684 C13.5885247,6.36456187 13.5996324,10.1156459 15.8787838,12.4315789 L23.5247297,20.1652632 L27.0027027,16.6315789 C27.3662934,16.2617042 27.3662934,15.6625064 27.0027027,15.2926316 Z" fill="currentColor"></path>
      <path d="M15.8881081,12.4252632 C13.6089568,10.1093301 13.597849,6.35824608 15.8632432,4.02842105 L8.24527027,11.7652632 L12.3914865,15.9778947 L15.8881081,12.4252632 Z" fill="url(#${id}-1)"></path>
      <path d="M19.3785135,15.9526316 L15.8881081,19.4989474 C16.9881804,20.6159762 17.6062496,22.1313915 17.6062496,23.7115789 C17.6062496,25.2917664 16.9881804,26.8071817 15.8881081,27.9242105 L15.8881081,27.9242105 L23.5247297,20.1652632 L19.3785135,15.9526316 Z" fill="url(#${id}-2)"></path>
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

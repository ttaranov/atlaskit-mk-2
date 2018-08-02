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
      <linearGradient x1="99.14%" y1="112.745%" x2="33.859%" y2="37.768%" id="${id}-1">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="14.184%" y1="5.8%" x2="61.142%" y2="70.966%" id="${id}-2">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M5.21125,22.02625 C4.9675,22.42375 4.69375,22.885 4.46125,23.2525 C4.25314445,23.6041724 4.36486384,24.0577198 4.7125,24.2725 L9.5875,27.2725 C9.75862252,27.378154 9.9650079,27.4106562 10.1603199,27.3627096 C10.355632,27.3147629 10.5235053,27.1903849 10.62625,27.0175 C10.82125,26.69125 11.0725,26.2675 11.34625,25.81375 C13.2775,22.62625 15.22,23.01625 18.7225,24.68875 L23.55625,26.9875 C23.7393212,27.0746367 23.9498721,27.0839412 24.139916,27.0132929 C24.32996,26.9426446 24.4833042,26.7980631 24.565,26.6125 L26.88625,21.3625 C27.0502501,20.9875392 26.8833772,20.5503321 26.51125,20.38 C25.49125,19.9 23.4625,18.94375 21.63625,18.0625 C15.06625,14.875 9.4825,15.085 5.21125,22.02625 Z" fill="url(#${id}-1)"></path>
      <path d="M27.07,9.74125 C27.31375,9.34375 27.5875,8.8825 27.82,8.515 C28.0281056,8.16332756 27.9163862,7.70978018 27.56875,7.495 L22.69375,4.495 C22.5202912,4.3794192 22.3065568,4.34123752 22.1038089,4.38961247 C21.9010609,4.43798741 21.7275895,4.56855506 21.625,4.75 C21.43,5.07625 21.17875,5.5 20.905,5.95375 C18.97375,9.14125 17.03125,8.75125 13.52875,7.07875 L8.71,4.78375 C8.52692876,4.69661331 8.31637791,4.68730883 8.12633397,4.75795713 C7.93629003,4.82860543 7.78294584,4.97318689 7.70125,5.15875 L5.38,10.40875 C5.21599991,10.7837108 5.38287283,11.2209179 5.755,11.39125 C6.775,11.87125 8.80375,12.8275 10.63,13.70875 C17.215,16.8925 22.79875,16.6825 27.07,9.74125 Z" fill="url(#${id}-2)"></path>
    </g>
  </svg>`;
};

export default class ConfluenceIcon extends Component<Props> {
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

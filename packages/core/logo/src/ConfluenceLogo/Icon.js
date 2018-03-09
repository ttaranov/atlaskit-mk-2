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
      <linearGradient x1="99.140087%" y1="112.745465%" x2="33.8589812%" y2="37.7675389%" id="${id}-1">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
      <linearGradient x1="14.1838118%" y1="5.80047897%" x2="61.141783%" y2="70.9663868%" id="${id}-2">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M5.21125,21.7022581 C4.9675,22.0783871 4.69375,22.5148387 4.46125,22.8625806 C4.25314445,23.195346 4.36486384,23.6245091 4.7125,23.8277419 L9.5875,26.6664516 C9.75862252,26.7664253 9.9650079,26.7971801 10.1603199,26.7518112 C10.355632,26.7064423 10.5235053,26.5887513 10.62625,26.4251613 C10.82125,26.1164516 11.0725,25.7154839 11.34625,25.286129 C13.2775,22.27 15.22,22.6390323 18.7225,24.2216129 L23.55625,26.3967742 C23.7393212,26.4792261 23.9498721,26.4880304 24.139916,26.4211804 C24.32996,26.3543303 24.4833042,26.2175221 24.565,26.0419355 L26.88625,21.0741935 C27.0502501,20.7193919 26.8833772,20.3056906 26.51125,20.1445161 C25.49125,19.6903226 23.4625,18.7854839 21.63625,17.9516129 C15.06625,14.9354839 9.4825,15.1341935 5.21125,21.7022581 Z" fill="url(#${id}-1)"></path>
      <path d="M27.07,10.4325806 C27.31375,10.0564516 27.5875,9.62 27.82,9.27225806 C28.0281056,8.93949274 27.9163862,8.51032964 27.56875,8.30709677 L22.69375,5.4683871 C22.5202912,5.35902032 22.3065568,5.32289142 22.1038089,5.36866556 C21.9010609,5.4144397 21.7275895,5.53798759 21.625,5.70967742 C21.43,6.0183871 21.17875,6.41935484 20.905,6.84870968 C18.97375,9.86483871 17.03125,9.49580645 13.52875,7.91322581 L8.71,5.7416129 C8.52692876,5.65916098 8.31637791,5.65035674 8.12633397,5.71720675 C7.93629003,5.78405675 7.78294584,5.92086501 7.70125,6.09645161 L5.38,11.0641935 C5.21599991,11.4189952 5.38287283,11.8326965 5.755,11.993871 C6.775,12.4480645 8.80375,13.3529032 10.63,14.1867742 C17.215,17.1993548 22.79875,17.0006452 27.07,10.4325806 Z" fill="url(#${id}-2)"></path>
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

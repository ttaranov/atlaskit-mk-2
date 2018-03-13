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
      <linearGradient x1="49.9923722%" y1="107.31548%" x2="49.9923722%" y2="38.7491835%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M23.6,22.7029032 C23.6,22.7029032 23.7018182,22.6354839 23.8690909,22.5077419 C26.3054545,20.6696774 27.8363636,18.0012903 27.8363636,15.0312903 C27.8363636,9.49225806 22.4981818,5 15.9163636,5 C9.33454545,5 4,9.49225806 4,15.0312903 C4,20.5703226 9.33454545,25.0696774 15.9163636,25.0696774 C16.7567504,25.0697985 17.5953899,24.9949712 18.4218182,24.846129 L18.68,24.8 C20.3563636,25.8645161 22.7927273,26.7303226 24.9236364,26.7303226 C25.5890909,26.7303226 25.8981818,26.2016129 25.4763636,25.6658065 C24.8327273,24.8709677 23.9454545,23.653871 23.6,22.7029032 Z M22.1454545,18.3170968 C21.4363636,19.3532258 19.2363636,21.1167742 15.9345455,21.1167742 L15.8909091,21.1167742 C12.5854545,21.1167742 10.3854545,19.3425806 9.68,18.3170968 C9.53808129,18.1650868 9.44347999,17.9767692 9.40727273,17.7741935 C9.39624517,17.6454445 9.43979179,17.5179134 9.52775434,17.4213496 C9.61571689,17.3247859 9.74040319,17.267634 9.87272727,17.2632258 C9.98897276,17.2669565 10.1015246,17.3039774 10.1963636,17.3696774 C11.8118518,18.6526513 13.8298372,19.355387 15.9127273,19.3603226 L15.9127273,19.3603226 C18.0056863,19.3822708 20.0370226,18.669488 21.6363636,17.3519355 C21.7221026,17.2763864 21.8335689,17.2346492 21.9490909,17.2348387 C22.2107657,17.2348313 22.423457,17.4407925 22.4254545,17.696129 C22.3948883,17.9230374 22.3018978,18.1376272 22.1563636,18.3170968 L22.1454545,18.3170968 Z" fill="url(#${id})"></path>
    </g>
  </svg>`;
};

export default class HipchatIcon extends Component<Props> {
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

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
      <linearGradient x1="38.0412357%" y1="6.63683429%" x2="59.8560262%" y2="63.7778713%" id="${id}">
        <stop stop-color="${iconGradientStart}" ${
    iconGradientStart === 'inherit' ? 'stop-opacity="0.4"' : ''
  } offset="0%"></stop>
        <stop stop-color="${iconGradientStop}" offset="100%"></stop>
      </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
      <path d="M17.691,13.4484211 L24.2175,13.4736842 C24.6019517,13.475472 24.9524969,13.6934048 25.123358,14.0368529 C25.294219,14.3803011 25.2561568,14.7904914 25.025,15.0968421 L15.392,27.9242105 C13.9375804,26.8410282 12.9743192,25.2259563 12.714195,23.4344131 C12.4540709,21.6428699 12.9183998,19.821665 14.005,18.3715789 L17.691,13.4484211 Z" fill="url(#${id})"></path>
      <path d="M14.0018333,18.3715789 L7.51333333,18.3305263 C7.12888159,18.3287385 6.77833639,18.1108058 6.60747538,17.7673576 C6.43661437,17.4239094 6.47467653,17.0137191 6.70583333,16.7073684 L16.2438333,4 C17.6982529,5.08318232 18.6615141,6.69825426 18.9216383,8.48979744 C19.1817625,10.2813406 18.7174335,12.1025456 17.6308333,13.5526316 L14.0018333,18.3715789 Z" fill="currentColor"></path>
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

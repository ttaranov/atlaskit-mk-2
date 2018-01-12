import * as React from 'react';
import { Component } from 'react';

import { OptionsAreaNormal, OptionsAreaActive } from './styles';

// The icon is inlined because we need to change its color
// tslint:disable:no-var-requires
const svg = require('!raw-loader!./icons/options.svg');

export interface OptionsIconProps {
  readonly isActive: boolean;
}

// Small triangle in the right bottom corner of the buttons for color and line width
export class OptionsIcon extends Component<OptionsIconProps> {
  render() {
    const Icon = this.props.isActive ? OptionsAreaActive : OptionsAreaNormal;

    return <Icon src={svg} />;
  }
}

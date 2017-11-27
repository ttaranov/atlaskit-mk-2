import * as React from 'react';
import { Component, CSSProperties } from 'react';
import { CardDimensions } from '../../index';
import { Wrapper } from './styled';

export interface ElementPlaceholderProps {
  dimensions?: CardDimensions;
  style?: CSSProperties;
  className?: string;
}

const defaultDimensions: CardDimensions = { width: '100%', height: '100%' };

export default class ElementPlaceholder extends Component<
  ElementPlaceholderProps,
  {}
> {
  render() {
    const { dimensions, style, className } = this.props;
    // TODO: niccer way of doing it, TS complains :/
    // const {width, height} = {...defaultDimensions, ...dimensions};
    const { width } = dimensions || defaultDimensions;
    const { height } = dimensions || defaultDimensions;
    const mergedStyle = { width, height, ...style };

    return <Wrapper style={mergedStyle} className={className} />;
  }
}

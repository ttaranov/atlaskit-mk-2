/// <reference types="react" />
import * as React from 'react';
export interface Props {
  target?: string;
  relativePosition?: 'above' | 'below' | 'auto';
  offsetX?: number;
  offsetY?: number;
  zIndex?: number | string;
  children?: any;
}
export default class Popup extends React.PureComponent<Props, {}> {
  private popup;
  static defaultProps: {
    relativePosition: string;
    offsetX: number;
    offsetY: number;
    zIndex: number;
  };
  componentDidMount(): void;
  componentDidUpdate(): void;
  componentWillUnmount(): void;
  _applyBelowPosition(): void;
  _applyAbovePosition(): void;
  _applyAbsolutePosition(): void;
  _renderContent(): void;
  render(): JSX.Element;
}

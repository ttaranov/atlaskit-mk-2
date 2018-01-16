import * as React from 'react';
import { PureComponent } from 'react';
import { Popup } from '@atlaskit/editor-common';
import { Container } from './styles';
export type Coordniates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export interface Props {
  target?: HTMLElement;
  offset?: number[];
  fitWidth?: number;
  fitHeight?: number;
  onPositionCalculated?: (position: any) => any;
}

export default class FloatingToolbar extends PureComponent<Props, any> {
  render() {
    const {
      children,
      target,
      offset,
      fitWidth,
      fitHeight,
      onPositionCalculated,
    } = this.props;

    if (!target) {
      return null;
    }

    return (
      <Popup
        target={target}
        offset={offset}
        fitWidth={fitWidth}
        fitHeight={fitHeight}
        onPositionCalculated={onPositionCalculated}
      >
        <Container height={fitHeight}>{children}</Container>
      </Popup>
    );
  }
}

import * as React from 'react';
import { PureComponent } from 'react';
import { Popup } from '@atlaskit/editor-common';
import { Container } from './styles';

export type Coordinates = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export interface Props {
  target?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  offset?: number[];
  fitWidth?: number;
  fitHeight?: number;
  onPositionCalculated?: (position: Coordinates) => any;
}

export {
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
} from './utils';

export default class FloatingToolbar extends PureComponent<Props, any> {
  render() {
    const {
      children,
      target,
      offset,
      fitWidth,
      fitHeight = 40,
      onPositionCalculated,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;

    if (!target) {
      return null;
    }

    return (
      <Popup
        target={target}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
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

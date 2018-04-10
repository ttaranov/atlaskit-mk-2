import * as React from 'react';
import { PureComponent, CSSProperties } from 'react';
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
  stylesOverride?: CSSProperties;
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
      stylesOverride,
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
        <Container height={fitHeight} style={stylesOverride}>
          {children}
        </Container>
      </Popup>
    );
  }
}

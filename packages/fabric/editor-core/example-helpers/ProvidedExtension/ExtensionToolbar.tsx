import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import { ExtensionToolbarWrapper } from '../../src/index';

export type Props = {
  element?: HTMLElement | null;
  popupContainer?: HTMLElement | null;
  children: any;
  offset?: number[];
  alignX?: 'left' | 'right';
  alignY?: 'top' | 'bottom';
};

export default class ExtensionToolbar extends React.Component<Props, {}> {
  static defaultProps = {
    offset: [0, 8],
    alignX: 'right',
    alignY: 'bottom',
  };

  render() {
    const {
      element,
      popupContainer,
      children,
      offset,
      alignX,
      alignY,
    } = this.props;

    if (!element) {
      return null;
    }

    return (
      <Popup
        target={element}
        mountTo={popupContainer}
        offset={offset}
        alignX={alignX}
        alignY={alignY}
      >
        <ExtensionToolbarWrapper>{children}</ExtensionToolbarWrapper>
      </Popup>
    );
  }
}

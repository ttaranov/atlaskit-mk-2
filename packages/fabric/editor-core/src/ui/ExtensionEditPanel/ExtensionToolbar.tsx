import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import { Toolbar } from './styles';

export type Props = {
  element: HTMLElement;
  popupContainer: HTMLElement;
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

    return (
      <Popup
        target={element}
        offset={offset}
        alignX={alignX}
        alignY={alignY}
        mountTo={popupContainer}
      >
        <Toolbar>{children}</Toolbar>
      </Popup>
    );
  }
}

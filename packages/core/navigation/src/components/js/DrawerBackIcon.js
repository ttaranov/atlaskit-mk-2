// @flow
import React, { PureComponent, type Node } from 'react';
import DrawerBackIconInner from '../styled/DrawerBackIconInner';
import DrawerBackIconOuter from '../styled/DrawerBackIconOuter';

type Props = {
  children: Node,
  isVisible: boolean,
};

export default function DrawerBackIcon (props) {
  static defaultProps = {
    isVisible: false,
  };

  render() {
    const { children, isVisible } = this.props;
    return (
      <DrawerBackIconOuter>
        <DrawerBackIconInner isVisible={isVisible}>
          {children}
        </DrawerBackIconInner>
      </DrawerBackIconOuter>
    );
  }
}

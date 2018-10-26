// @flow
import React, { PureComponent } from 'react';
import Drawer from '../Drawer';
import { drawerIconOffset } from '../../../shared-variables';
import type { DrawerProps } from './types';

/*
NOTE: All drawers mirror each other in design, with the only difference
being the offset.
*/
export default function SearchDrawer (props) {
  render() {
    return (
      <Drawer
        iconOffset={drawerIconOffset}
        width={this.props.isFullWidth ? 'full' : 'wide'}
        {...this.props}
      />
    );
  }
}

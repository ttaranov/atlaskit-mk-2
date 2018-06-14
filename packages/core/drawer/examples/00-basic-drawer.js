// @flow

import React, { Fragment, Component } from 'react';
import Drawer from '../src';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

type State = {
  isDrawerOpen: boolean,
};
export default class DrawersExample extends Component<Object, State> {
  state = {
    isDrawerOpen: true,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  render() {
    return (
      <Fragment>
        {this.state.isDrawerOpen ? (
          <Drawer
            isOpen={this.state.isDrawerOpen}
            width="wide"
            onClose={this.closeDrawer}
            icon={ArrowLeft}
          >
            <code>Drawer contents</code>
          </Drawer>
        ) : null}
        <button onClick={this.openDrawer}>Open drawer</button>
      </Fragment>
    );
  }
}

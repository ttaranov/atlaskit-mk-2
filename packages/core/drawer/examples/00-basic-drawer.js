// @flow

import React, { Fragment, Component } from 'react';
import Drawer from '../src';

type State = {
  isDrawerOpen: boolean,
};
export default class DrawersExample extends Component<Object, State> {
  state = {
    isDrawerOpen: false,
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
    console.log(this.state.isDrawerOpen);
    return (
      <Fragment>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <code>Drawer contents</code>
        </Drawer>
        <button onClick={this.openDrawer}>Open drawer</button>
      </Fragment>
    );
  }
}

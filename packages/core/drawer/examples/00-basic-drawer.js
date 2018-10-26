// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

type State = {
  isDrawerOpen: boolean,
};
export default function DrawersExample (props) {
  const state = useState({
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
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <code>Drawer contents</code>
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}

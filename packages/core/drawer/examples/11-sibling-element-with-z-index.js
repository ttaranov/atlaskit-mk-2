// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Lorem from 'react-lorem-component';

import Drawer from '../src';
import { BlockWithChildren } from '../examples-util/helpers';

type State = {
  isDrawerOpen: boolean,
};
export default class DrawersExample extends Component<{}, State> {
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
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <Lorem count={100} />
        </Drawer>
        <BlockWithChildren>
          <Button type="button" onClick={this.openDrawer}>
            Open drawer
          </Button>
          <h1>Some content</h1>
        </BlockWithChildren>
      </div>
    );
  }
}

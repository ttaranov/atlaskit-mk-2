// @flow

import React, { Fragment, Component } from 'react';
import Button from '@atlaskit/button';
import Lorem from 'react-lorem-component';

import Drawer from '../src';

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
      <Fragment>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width="wide"
        >
          <Lorem count={100} />
        </Drawer>
        <div
          style={{
            bottom: '0',
            height: 'auto',
            border: '1px solid #333',
            left: '0',
            position: 'relative',
            right: '0',
            top: '0',
            width: '100%',
            zIndex: '1',
            padding: '20px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <Button type="button" onClick={this.openDrawer}>
              Open drawer
            </Button>
            <h1>Some content</h1>
          </div>
        </div>
      </Fragment>
    );
  }
}

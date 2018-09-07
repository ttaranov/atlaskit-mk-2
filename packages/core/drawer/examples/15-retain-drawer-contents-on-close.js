// @flow

import React, { Fragment, Component } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

type State = {
  isDrawerOpen: boolean,
  randomNumber: number,
};
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    randomNumber: 0,
  };

  ref = null;

  componentDidUpdate() {
    if (!this.ref.dataset.timestamp) {
      this.ref.dataset.timestamp = Math.random();
    }
  }

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
          <code
            ref={ref => {
              this.ref = ref;
            }}
          >
            Timestamp of mount:{' '}
            {(this.ref && this.ref.dataset.timestamp) || Math.random()}
          </code>
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </Fragment>
    );
  }
}

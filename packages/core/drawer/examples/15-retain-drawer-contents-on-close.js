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

  componentDidReceiveProps() {
    console.log('test');
    if (this.ref && !this.ref.getAttribute('data-randomNumber')) {
      this.ref.setAttribute('data-randomNumber', Math.random());
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
    console.log(this.ref);
    return (
      <Fragment>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          unmountOnExit={false}
          width="wide"
        >
          <code
            ref={ref => {
              this.ref = ref;
            }}
          >
            Random string generated on mount:
            {this.ref && this.ref.getAttribute('data-randomNumber')}
          </code>
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </Fragment>
    );
  }
}

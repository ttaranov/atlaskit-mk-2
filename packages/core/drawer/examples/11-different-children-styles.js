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
            color: 'rgb(23, 43, 77)',
            height: 'auto',
            left: '0',
            letterSpacing: '-0.16px',
            position: 'relative',
            right: '0',
            textDecoration: 'none solid rgb(23, 43, 77)',
            top: '0',
            width: '100%',
            zIndex: '1',
            columnRuleColor: 'rgb(23, 43, 77)',
            perspectiveOrigin: '495.5px 22px',
            transformOrigin: '495.5px 22px',
            caretColor: 'rgb(23, 43, 77)',
            background:
              'rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box',
            border: '0 solid rgba(0, 0, 0, 0)',
            font:
              'normal normal 500 normal 20px / 20px -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
            outline: 'rgb(23, 43, 77) none 0px',
            padding: '20px 24px 24px 16px',
          }}
        >
          <div
            style={{
              boxSizing: 'border-box',
              color: 'rgb(23, 43, 77)',
              display: 'table',
              height: '0',
              letterSpacing: '-0.16px',
              textDecoration: 'none solid rgb(23, 43, 77)',
              width: '951px',
              columnRuleColor: 'rgb(23, 43, 77)',
              perspectiveOrigin: '475.5px 0px',
              transformOrigin: '475.5px 0px',
              caretColor: 'rgb(23, 43, 77)',
              border: '0 none rgb(23, 43, 77)',
              font:
                'normal normal 500 normal 20px / 20px -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
              outline: 'rgb(23, 43, 77) none 0px',
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

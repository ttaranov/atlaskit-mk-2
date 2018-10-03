// @flow
import React, { Component } from 'react';
import Drawer from '@atlaskit/drawer';

import BasicQuickSearch from './utils/BasicQuickSearch';

type State = {
  isDrawerOpen: boolean,
  shouldUnmountOnExit: boolean,
};

// eslint-disable-next-line react/no-multi-comp
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    shouldUnmountOnExit: true,
  };

  quickSearchRef: any;

  openDrawer = () => {
    this.setState({
      isDrawerOpen: true,
    });
    if (
      this.quickSearchRef &&
      typeof this.quickSearchRef.focusSearchInput === 'function'
    ) {
      this.quickSearchRef.focusSearchInput();
    }
  };

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  toggleUnmountBehaviour = () => {
    this.setState(({ shouldUnmountOnExit: shouldUnmountOnExitValue }) => ({
      shouldUnmountOnExit: !shouldUnmountOnExitValue,
    }));
  };

  setQuickSearchRef = (ref: any) => {
    if (ref) {
      this.quickSearchRef = ref.quickSearchInnerRef;
    }
  };

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          isOpen={this.state.isDrawerOpen}
          onClose={this.closeDrawer}
          width="wide"
          shouldUnmountOnExit={this.state.shouldUnmountOnExit}
        >
          <BasicQuickSearch ref={this.setQuickSearchRef} />
        </Drawer>
        <button type="button" onClick={this.openDrawer}>
          Open drawer
        </button>
        <div css={{ marginTop: '2rem' }}>
          <label htmlFor="checkbox">
            <input
              id="checkbox"
              type="checkbox"
              value={this.state.shouldUnmountOnExit}
              onChange={this.toggleUnmountBehaviour}
            />
            Toggle remounting of drawer contents on exit
          </label>
          <div css={{ display: 'block', paddingTop: '1rem' }}>
            Contents of the drawer will be{' '}
            <strong>{`${
              this.state.shouldUnmountOnExit ? 'discarded' : 'retained'
            }`}</strong>{' '}
            on closing the drawer
          </div>
        </div>
      </div>
    );
  }
}

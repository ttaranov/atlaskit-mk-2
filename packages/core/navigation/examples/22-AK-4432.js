// @flow

import React from 'react';
import AddIcon from '@atlaskit/icon/glyph/add';
import AkNavigation from '../src';

/**
 * This example is here for testing, I will update it once tests are done
 */

export default class App extends React.Component<{}, { isOpen: boolean }> {
  state = {
    isOpen: false,
  };

  onChangeOpen = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    return (
      <AkNavigation
        globalPrimaryIcon={<AddIcon />}
        globalPrimaryItemHref="http://a.com"
        isOpen={this.state.isOpen}
        onResize={this.onChangeOpen}
      />
    );
  }
}

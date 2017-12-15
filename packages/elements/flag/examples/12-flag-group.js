// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Flag, { FlagGroup } from '../src';
import { getFlagData, type flagData } from './example-utils/utils';

type State = {
  flags: Array<?flagData>,
};

export default class FlagGroupExample extends Component<void, State> {
  state = { flags: [] };
  flagCount = 0;

  addFlag = () => {
    const flags = this.state.flags.slice();
    flags.unshift(getFlagData(this.flagCount++));
    this.setState({ flags });
  };

  dismissFlag = () => {
    this.setState(state => ({ flags: state.flags.slice(1) }));
    this.flagCount--;
  };

  render() {
    const actions = [
      {
        content: 'Nice one!',
        onClick: () => {},
      },
      { content: 'Not right now thanks', onClick: this.dismissFlag },
    ];

    return (
      <div>
        <FlagGroup onDismissed={this.dismissFlag}>
          {this.state.flags.map(flag => <Flag actions={actions} {...flag} />)}
        </FlagGroup>
        <Button onClick={this.addFlag}>Add Flag</Button>
      </div>
    );
  }
}

// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { DynamicTableStateless } from '../src';
import { head } from './content/sample-data';

type State = {
  isLoading: boolean,
};

export default class extends Component<{}, State> {
  state = {
    isLoading: true,
  };
  render() {
    return (
      <div>
        <Button
          onClick={() =>
            this.setState({
              isLoading: !this.state.isLoading,
            })
          }
        >
          Toggle loading
        </Button>
        <DynamicTableStateless head={head} isLoading={this.state.isLoading} />
      </div>
    );
  }
}

// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { DynamicTableStateless } from '../src';
import { head, rows } from './content/sample-data';

type State = {
  isLoading: boolean,
  isRankable: boolean,
};

export default class extends Component<{}, State> {
  state = {
    isLoading: true,
    isRankable: false,
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
        <Button
          onClick={() =>
            this.setState({
              isRankable: !this.state.isRankable,
            })
          }
        >
          Toggle rankable
        </Button>
        <DynamicTableStateless
          head={head}
          rows={rows}
          rowsPerPage={40}
          page={1}
          isLoading={this.state.isLoading}
          isRankable={this.state.isRankable}
        />
      </div>
    );
  }
}

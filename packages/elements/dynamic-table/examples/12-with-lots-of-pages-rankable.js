// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { ToggleStateless as Toggle } from '@atlaskit/toggle';
import DynamicTable from '../src';
import { caption, createHead, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

type State = {
  fixedSize: boolean,
};
export default class extends Component<{}, State> {
  state = {
    fixedSize: false,
  };

  onToggleFixedChange = () => {
    this.setState({
      fixedSize: !this.state.fixedSize,
    });
  };

  render() {
    return (
      <Wrapper>
        <Toggle
          onChange={this.onToggleFixedChange}
          isChecked={this.state.fixedSize}
        />Fixed size
        <DynamicTable
          caption={caption}
          head={createHead(this.state.fixedSize)}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          isRankable
          onRankStart={params => console.log('onRankStart', params)}
          onRankEnd={params => console.log('onRankEnd', params)}
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
        <p>This example works properly only in fullscreen mode.</p>
      </Wrapper>
    );
  }
}

// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import DynamicTable from '../src';
import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

export default class extends Component<{}, {}> {
  render() {
    return (
      <Wrapper>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          isRankable
          onRankStart={params => console.log('onRankStart', params)}
          onRankEnd={params => console.log('onRankEnd', params)}
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

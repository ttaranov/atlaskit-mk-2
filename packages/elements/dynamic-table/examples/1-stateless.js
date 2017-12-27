// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DynamicTableStateless } from '../src';
import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

export default class extends Component<{}, {}> {
  render() {
    return (
      <Wrapper>
        <DynamicTableStateless
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={10}
          page={3}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          sortKey="term"
          sortOrder="DESC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

// @flow

import React, { Component } from 'react';
import { PaginationStateless } from '../';

export default class PaginationExample extends Component<
  {},
  { currentPage: number },
> {
  state = {
    currentPage: 1,
  };

  setCurrentPage = (newPage: number) => this.setState({ currentPage: newPage });

  render() {
    return (
      <div>
        <PaginationStateless
          current={this.state.currentPage}
          total={3}
          onSetPage={e => this.setCurrentPage(e)}
        />
      </div>
    );
  }
}

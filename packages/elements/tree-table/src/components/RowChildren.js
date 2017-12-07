// @flow

import React, { PureComponent } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
  isLoading?: boolean,
};

export default class RowChildren extends PureComponent<Props> {
  renderChildRows() {
    const {
      childrenData = [],
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return childrenData.map((childRowData, index) => (
      <Subtree
        data={childRowData}
        getChildrenData={getChildrenData}
        depth={depth + 1}
        key={childRowData.id || index}
        render={render}
      />
    ));
  }

  render() {
    const { isLoading } = this.props;
    return (
      <div>{isLoading ? this.renderLoading() : this.renderChildRows()}</div>
    );
  }
}

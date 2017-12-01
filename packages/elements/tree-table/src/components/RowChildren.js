// @flow

import React, { PureComponent } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
};

export default class RowChildren extends PureComponent<Props> {
  render() {
    const {
      childrenData = [],
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return (
      <div>
        {childrenData.map((childRowData, index) => (
          <Subtree
            data={childRowData}
            getChildrenData={getChildrenData}
            depth={depth + 1}
            key={childRowData.id || index}
            render={render}
          />
        ))}
      </div>
    );
  }
}

// @flow

import React, { PureComponent, type Element } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  columnWidths?: Array<string>,
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
};

export default class RowChildren extends PureComponent<Props> {
  render() {
    const {
      childrenData = [],
      columnWidths,
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return (
      <div>
        {childrenData.map((childRowData, index) => (
          <Subtree
            data={childRowData}
            hasChildren={childRowData.hasChildren}
            columnWidths={columnWidths}
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

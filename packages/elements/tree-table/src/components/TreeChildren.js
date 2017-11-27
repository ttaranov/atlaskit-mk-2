// @flow

import React, { PureComponent, type Element } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  columnWidths?: Array<string>,
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
};

export default class TreeChildren extends PureComponent<Props> {
  render() {
    const {
      childrenData = [],
      columns,
      columnWidths,
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return (
      <div>
        {childrenData.map((childData, index) => (
          <Subtree
            data={childData}
            hasChildren={childData.hasChildren}
            isExpanded={false}
            columns={columns}
            columnWidths={columnWidths}
            getChildrenData={getChildrenData}
            depth={depth + 1}
            key={childData.id || index}
            render={render}
          />
        ))}
      </div>
    );
  }
}

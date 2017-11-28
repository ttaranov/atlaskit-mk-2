// @flow
import React, { PureComponent, type ElementType, type Node } from 'react';
import { TreeTableContainer, TreeCell } from '../styled';
import TreeRows from './TreeRows';
import RowData from './RowData';
import TreeHeads from './TreeHeads';
import TreeHead from './TreeHead';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns?: Array<ElementType>,
  columnWidths?: Array<string>,
  children?: Array<Node>,
  headers?: Array<string>,
  // headers?: Array<string>,
  /** This is the data prop description */
  data?: DataFunction | string,
};

export default class TreeTable extends PureComponent<Props> {
  render() {
    const {
      data: getRowChildrenData,
      headers,
      columns,
      columnWidths = [],
    } = this.props;
    const heads = headers && (
      <TreeHeads>
        {headers.map((header, index) => (
          <TreeHead key={index} width={columnWidths[index]}>
            {header}
          </TreeHead>
        ))}
      </TreeHeads>
    );
    let rows = null;
    if (columns && getRowChildrenData) {
      rows = (
        <TreeRows
          data={getRowChildrenData}
          render={data => (
            <RowData key={data.id} hasChildren={data.hasChildren}>
              {columns.map((Cell, index) => (
                <TreeCell key={index}>
                  <Cell {...data.content} />
                </TreeCell>
              ))}
            </RowData>
          )}
        />
      );
    }
    return (
      <TreeTableContainer>
        {heads}
        {rows}
        {this.props.children}
      </TreeTableContainer>
    );
  }
}

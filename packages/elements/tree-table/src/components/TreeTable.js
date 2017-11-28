// @flow
import React, { PureComponent, type ElementType, type Node } from 'react';
import { TreeTableContainer } from '../styled';
import TreeChildren from './TreeChildren';
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
  renderChildren() {
    return this.props.children;
  }

  render() {
    const { data, headers, columns, columnWidths = [] } = this.props;
    const heads = headers && (
      <TreeHeads>
        {headers.map((header, index) => (
          <TreeHead key={index} width={columnWidths[index]}>
            {header}
          </TreeHead>
        ))}
      </TreeHeads>
    );

    const children = columns &&
      data && (
        <TreeChildren
          columns={columns}
          childrenData={data()}
          getChildrenData={data}
          columnWidths={columnWidths}
        />
      );
    return (
      <TreeTableContainer>
        {heads}
        {children || this.renderChildren()}
      </TreeTableContainer>
    );
  }
}

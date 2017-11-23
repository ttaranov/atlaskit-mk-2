// @flow
import React, { PureComponent, Component, type ElementType } from 'react';
import TreeChildren from './TreeChildren';
import TreeHeads from './TreeHeads';
import TreeHead from './TreeHead';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns: Array<ElementType>,
  columnWidths?: Array<string>,
  // columns: Array<Element>,
  // headers?: Array<string>,
  /** This is the data prop description */
  data: DataFunction | string,
};

export default class TreeTable extends PureComponent<Props> {
  render() {
    const { data, headers, columns, columnWidths = [] } = this.props;
    const childrenData = data();
    return (
      <div>
        {headers && (
          <TreeHeads>
            {headers.map((header, index) => (
              <TreeHead key={index} width={columnWidths[index]}>
                {header}
              </TreeHead>
            ))}
          </TreeHeads>
        )}
        <TreeChildren
          columns={columns}
          childrenData={childrenData}
          getChildrenData={data}
          columnWidths={columnWidths}
        />
      </div>
    );
  }
}

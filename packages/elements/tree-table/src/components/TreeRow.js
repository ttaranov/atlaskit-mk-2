// @flow
import React, { PureComponent, type Element } from 'react';
import { TreeRowContainer, TreeCell } from '../styled';

import { type DataFunction } from './../types';
import Chevron from './Chevron';

type Props = {
  columns: Array<Element>,
  columnWidths?: Array<string>,
  data: DataFunction | string,
  isExpanded: boolean,
  hasChildren: boolean,
  onExpandToggle: Function,
  depth?: number,
};

export default class TreeRow extends PureComponent<Props> {
  render() {
    const {
      data,
      columns,
      isExpanded,
      onExpandToggle,
      hasChildren,
      depth,
      columnWidths,
    } = this.props;
    return (
      <TreeRowContainer>
        {columns.map((ColumnComponent, columnIndex) => {
          const firstCell = columnIndex === 0;
          const width = (columnWidths && columnWidths[columnIndex]) || '200px'; //`${(1 / columns.length) * 100}%`;
          const indentLevel = firstCell ? depth : 0;
          return (
            <TreeCell
              width={width}
              indentLevel={indentLevel}
              key={columnIndex}
              className={'tree-cell'}
            >
              {firstCell ? (
                <Chevron
                  isExpanded={isExpanded}
                  hasChildren={hasChildren}
                  onExpandToggle={onExpandToggle}
                />
              ) : null}
              <ColumnComponent {...data} />
            </TreeCell>
          );
        })}
      </TreeRowContainer>
    );
  }
}

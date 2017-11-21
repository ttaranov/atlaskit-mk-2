// @flow
import React, { Children, PureComponent, Component, type Element } from 'react';
import TreeCell from '../styled/TreeCell';
import BulletIcon from '../styled/BulletIcon';

import { type DataFunction } from './../types';

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
    const toggle = (
      <BulletIcon>
        <span
          onClick={onExpandToggle}
          role="button"
          tabIndex={-1}
          style={{ display: 'inline-block' }}
        >
          {hasChildren ? (isExpanded ? '[-]' : '[+]') : '*'}
        </span>
      </BulletIcon>
    );
    return (
      <div>
        {columns.map((ColumnComponent, columnIndex) => {
          const firstCell = columnIndex === 0;
          const width = (columnWidths && columnWidths[columnIndex]) || '200px'; //`${(1 / columns.length) * 100}%`;
          const paddingLeft = firstCell ? `${depth * 40}px` : 0;
          return (
            <TreeCell
              width={width}
              paddingLeft={paddingLeft}
              key={columnIndex}
              className={'tree-cell'}
            >
              {firstCell ? toggle : null}
              <ColumnComponent {...data} />
            </TreeCell>
          );
        })}
      </div>
    );
  }
}

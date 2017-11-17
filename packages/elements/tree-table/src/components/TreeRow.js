// @flow
import React, { Children, PureComponent, Component, type Element } from 'react';

import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  data: DataFunction | string,
};

export default class TreeRow extends PureComponent<Props> {
  render() {
    const { data, columns } = this.props;
    return (
      <div>
        {columns.map((ColumnComponent, columnIndex) => (
          <ColumnComponent key={columnIndex} {...data} />
        ))}
      </div>
    );
  }
}

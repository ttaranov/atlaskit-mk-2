// @flow
import React, { PureComponent, type ElementType, type Node } from 'react';
import RowChildren from './RowChildren';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns?: Array<ElementType>,
  columnWidths?: Array<string>,
  children?: Array<Node>,
  /** This is the data prop description */
  data?: DataFunction | string,
  render?: Function,
};

export default class TreeRows extends PureComponent<Props> {
  render() {
    const { data, columns, columnWidths = [], render } = this.props;
    const childRows = ((columns && data) || render) && (
      <RowChildren
        columns={columns}
        childrenData={data()}
        getChildrenData={data}
        columnWidths={columnWidths}
        render={render}
      />
    );
    return <div>{childRows || this.props.children}</div>;
  }
}

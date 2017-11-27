// @flow
import React, { PureComponent, type ElementType } from 'react';
import TreeChildren from './TreeChildren';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns?: Array<ElementType>,
  columnWidths?: Array<string>,
  children?: Array<Element>,
  /** This is the data prop description */
  data?: DataFunction | string,
  render?: Function,
};

export default class TreeTable extends PureComponent<Props> {
  renderChildren() {
    return this.props.children;
  }

  render() {
    const { data, columns, columnWidths = [], render } = this.props;
    const children = ((columns && data) || render) && (
      <TreeChildren
        columns={columns}
        childrenData={data()}
        getChildrenData={data}
        columnWidths={columnWidths}
        render={render}
      />
    );
    return <div>{children || this.renderChildren()}</div>;
  }
}

// @flow
import React, {
  Children,
  PureComponent,
  Component,
  type ElementType,
} from 'react';
import TreeChildren from './TreeChildren';

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

export default class TreeTable extends Component<Props> {
  render() {
    const { data, columns, columnWidths } = this.props;
    const childrenData = data();

    return (
      <div>
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

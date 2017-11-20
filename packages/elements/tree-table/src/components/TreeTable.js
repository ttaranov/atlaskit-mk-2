// @flow
import React, {
  Children,
  PureComponent,
  Component,
  type ElementType,
} from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  /** This is the columns prop description */
  columns: Array<ElementType>,
  // columns: Array<Element>,
  // headers?: Array<string>,
  // headerWidths?: Array<string|number>,
  /** This is the data prop description */
  data: DataFunction | string,
};

export default class TreeTable extends Component<Props> {
  // static defaultProps = {
  //   headers: null
  // }

  render() {
    const { data, columns } = this.props;

    return (
      <div>
        <Subtree data={undefined} columns={columns} getChildrenData={data} />
      </div>
    );
  }
}

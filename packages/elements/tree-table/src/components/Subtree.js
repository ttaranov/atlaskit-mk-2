// @flow
import React, { PureComponent, type Element } from 'react';

import TreeChildren from './TreeChildren';
import TreeRow from './TreeRow';
import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  data: Object,
  getChildrenData: DataFunction,
};

export default class Subtree extends PureComponent<Props> {
  render() {
    const { data, columns, getChildrenData } = this.props;
    const childrenData = getChildrenData(data);

    return (
      <div>
        <TreeRow data={data} columns={columns} />
        <TreeChildren
          childrenData={childrenData}
          columns={columns}
          getChildrenData={getChildrenData}
        />
      </div>
    );
  }
}

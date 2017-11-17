import React, { PureComponent, type Element } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  childrenData: Object,
  getChildrenData: DataFunction,
};

export default class TreeChildren extends PureComponent<Props> {
  render() {
    const { childrenData = [], columns, getChildrenData } = this.props;
    return (
      <div>
        {childrenData.map((childData, index) => (
          <Subtree
            data={childData}
            columns={columns}
            getChildrenData={getChildrenData}
            key={index}
          />
        ))}
      </div>
    );
  }
}

// @flow
import React, { Children, PureComponent, Component, type Element } from 'react';
import Subtree from './Subtree';

import { type DataFunction } from './../types';

type Props = {
  columns: Array<Element>,
  headers: ?Array<Element<*> | string>,
  data: DataFunction | string,
};

export default class TreeTable extends PureComponent<Props> {
  props: Props; // eslint-disable-line react/sort-comp
  // portalElement: HTMLElement;

  render() {
    const { data, columns } = this.props;

    return (
      <div>
        <Subtree data={undefined} columns={columns} getChildrenData={data} />
      </div>
    );
  }
}

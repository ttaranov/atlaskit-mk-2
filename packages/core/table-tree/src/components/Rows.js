// @flow
import React, { PureComponent } from 'react';
import Items from './Items';

import {
  type ItemsProvider,
  type ItemsDataType,
  type RenderFunction,
} from './../types';

type Props = {
  /** Called when a row is expanded and data is needed for its children. The data should be an array of data items, or
   * a promise resolved to such array. Current row's item data is passed as an argument. For root rows, null is passed. */
  items: ItemsDataType,

  getRowData: ItemsProvider,

  /** The render prop called each time a row needs to be rendered. Receives item data as its only argument. Should
   * return a Row. */
  render: RenderFunction,
};

type State = {
  rootRowsData: ?Array<Object>,
};

export default class Rows extends PureComponent<Props, State> {
  render() {
    const { items, getRowData, render } = this.props;
    return (
      <div>
        <Items items={items} getItemsData={getRowData} render={render} />
      </div>
    );
  }
}

// @flow
import React, { Component } from 'react';
import Items from './Items';

import { type RenderFunction, type LoadableItems } from './../types';

type Props = {
  /** Called when a row is expanded and data is needed for its children. The data should be an array of data items, or
   * a promise resolved to such array. Current row's item data is passed as an argument. For root rows, null is passed. */
  // items?: ItemsProvider,

  rootItems: ?LoadableItems,

  /** The render prop called each time a row needs to be rendered. Receives item data as its only argument. Should
   * return a Row. */
  render: RenderFunction,
};

export default class Rows extends Component<Props> {
  render() {
    const { rootItems, render } = this.props;
    return (
      <div>
        <Items items={rootItems} render={render} />
      </div>
    );
  }
}

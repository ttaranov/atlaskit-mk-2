// @flow
import React, { Component } from 'react';
import Items from './Items';

import { type RenderFunction, type LoadableItems } from './../types';

type Props = {
  /** An array of root items in the table */
  items: ?LoadableItems,

  /** The render prop called each time a row needs to be rendered. Receives item data as its only argument. Should
   * return a Row. */
  render: RenderFunction,
};

export default class Rows extends Component<Props> {
  render() {
    const { items, render } = this.props;
    return (
      <div>
        <Items items={items} render={render} />
      </div>
    );
  }
}

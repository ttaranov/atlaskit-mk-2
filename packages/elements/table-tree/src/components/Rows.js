// @flow
import React, { PureComponent } from 'react';
import Items from './Items';

import { type ItemsProvider, type RenderFunction } from './../types';

type Props = {
  items: ItemsProvider,
  render: RenderFunction,
};

type State = {
  rootRowsData: ?Array<Object>,
};

export default class Rows extends PureComponent<Props, State> {
  state: State = {
    rootRowsData: null,
  };

  componentDidMount() {
    Promise.resolve()
      .then(() => this.props.items())
      .then(rootRowsData => {
        this.setState({
          rootRowsData,
        });
      });
  }

  render() {
    const { rootRowsData } = this.state;
    const { items, render } = this.props;
    return (
      <div>
        <Items
          childrenData={rootRowsData}
          getChildrenData={items}
          render={render}
        />
      </div>
    );
  }
}

// @flow
import React, { PureComponent } from 'react';
import Items from './Items';

import { type DataFunction, type RenderFunction } from './../types';

type Props = {
  data: DataFunction,
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
      .then(() => this.props.data())
      .then(rootRowsData => {
        this.setState({
          rootRowsData,
        });
      });
  }

  render() {
    const { rootRowsData } = this.state;
    const { data, render } = this.props;
    return (
      <div>
        <Items
          childrenData={rootRowsData}
          getChildrenData={data}
          render={render}
        />
      </div>
    );
  }
}

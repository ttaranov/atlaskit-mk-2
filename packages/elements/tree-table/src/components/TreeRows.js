// @flow
import React, { PureComponent } from 'react';
import RowChildren from './RowChildren';

import { type DataFunction, type RenderFunction } from './../types';

type Props = {
  data: DataFunction,
  render: RenderFunction,
};

type State = {
  rootRowsData: Array<Object> | null,
};

export default class TreeRows extends PureComponent<Props, State> {
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
        <RowChildren
          childrenData={rootRowsData}
          getChildrenData={data}
          render={render}
        />
      </div>
    );
  }
}

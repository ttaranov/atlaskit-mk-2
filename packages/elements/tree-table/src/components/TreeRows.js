// @flow
import React, { PureComponent, type Node } from 'react';
import RowChildren from './RowChildren';

import { type DataFunction } from './../types';

type Props = {
  children?: Array<Node>,
  data: DataFunction | string,
  render: Function,
};

type State = {
  rootRowsData: Array<Object>,
};

export default class TreeRows extends PureComponent<Props, State> {
  state = {
    rootRowsData: [],
    isLoading: false,
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
    const rootRows = (
      <RowChildren
        childrenData={rootRowsData}
        getChildrenData={data}
        render={render}
      />
    );
    return <div>{rootRows || this.props.children}</div>;
  }
}

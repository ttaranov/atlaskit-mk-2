// @flow
import React, { PureComponent } from 'react';
import Items from './Items';
import {
  type ItemsProvider,
  type RenderFunction,
  type RowData,
} from './../types';

type Props = {
  data: RowData,
  getChildrenData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isExpanded: boolean,
};

export default class Item extends PureComponent<Props, State> {
  state: State = {
    isExpanded: false,
  };

  static defaultProps = {
    depth: 0,
  };

  handleExpandToggleClick = () => {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  };

  render() {
    const { depth, data, render, getChildrenData } = this.props;
    const { isExpanded } = this.state;

    let row = render(data);
    if (!row) {
      return null;
    }
    row = React.cloneElement(row, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      isExpanded,
      data,
    });
    return (
      <div>
        {row}
        {isExpanded && (
          <Items
            parentData={data}
            depth={depth}
            getItemsData={getChildrenData}
            render={render}
          />
        )}
      </div>
    );
  }
}

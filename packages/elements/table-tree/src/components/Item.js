// @flow
import React, { PureComponent } from 'react';
import Items from './Items';
import { type ItemsProvider, type RenderFunction } from './../types';

type Props = {
  data: Object,
  getChildrenData: ItemsProvider,
  depth?: number,
  render: RenderFunction,
};

type State = {
  isExpanded: boolean,
  childrenData?: ?Array<Object>,
};

export default class Item extends PureComponent<Props, State> {
  state: State = {
    isExpanded: false,
  };

  static defaultProps = {
    depth: 0,
  };

  handleExpandToggleClick = () => {
    const newIsExpanded = !this.state.isExpanded;
    if (newIsExpanded && !this.state.childrenData) {
      Promise.resolve()
        .then(() => this.props.getChildrenData(this.props.data))
        .then(childrenData => {
          this.setState({
            childrenData,
          });
        });
    }
    this.setState({
      isExpanded: newIsExpanded,
    });
  };

  render() {
    const { depth, data, render, getChildrenData } = this.props;
    const { isExpanded, childrenData } = this.state;

    let row = render(data);
    if (!row) {
      return null;
    }
    row = React.cloneElement(row, {
      onExpandToggle: this.handleExpandToggleClick,
      depth,
      isExpanded,
    });
    return (
      <div>
        {row}
        {isExpanded && (
          <Items
            childrenData={childrenData}
            depth={depth}
            getChildrenData={getChildrenData}
            render={render}
          />
        )}
      </div>
    );
  }
}

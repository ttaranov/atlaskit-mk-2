// @flow

import React, { Component } from 'react';

import { ViewController, ViewControllerSubscriber } from '../../../src';

import { SortableItemsConsumer } from '../providers/sortable-items-provider';
import type { ItemsByGroup } from '../providers/sortable-items-provider/types';

type SortableIssuesViewProps = {
  sortableItems: ItemsByGroup,
  viewController: ViewController,
  onDragEnd: (dropResult: *) => void,
  view: *,
};

class SortableIssuesViewBase extends Component<SortableIssuesViewProps> {
  componentDidMount() {
    this.registerView();
  }

  componentDidUpdate(prevProps: SortableIssuesViewProps) {
    if (prevProps.sortableItems !== this.props.sortableItems) {
      this.registerView();
    }
  }

  // What do we do if the view changes over time?
  // 1 - Change item properties is fine as they aren't managed by state
  // 2 - Change group properties: such as itemIds is fine as we control the group state
  // getDerivedStateFromProps(props, state) {}

  registerView = () => {
    const { viewController, sortableItems, view } = this.props;
    const { onDragEnd } = this;
    const { getItemsFactory, ...rest } = view;

    const getItems = getItemsFactory({
      sortableItems,
      onDragEnd,
    });

    viewController.addView({
      getItems,
      ...rest,
    });
  };

  onDragEnd = (dropResult: *) => {
    if (this.props.onDragEnd) {
      this.props.onDragEnd(dropResult);
    }
  };

  render() {
    return null;
  }
}

const SortableIssuesView = ({ view }: *) => (
  <ViewControllerSubscriber>
    {viewController => (
      <SortableItemsConsumer>
        {({ sortableItems, onDragEnd }) => (
          <SortableIssuesViewBase
            sortableItems={sortableItems}
            onDragEnd={onDragEnd}
            viewController={viewController}
            view={view}
          />
        )}
      </SortableItemsConsumer>
    )}
  </ViewControllerSubscriber>
);

export default SortableIssuesView;

// @flow

import React, { Component, type Node } from 'react';
import type { DropResult } from 'react-beautiful-dnd';

import updateSortableItems from './update-sortable-items';
import type { ItemsByGroup } from './types';

const initialSortableIssueItems: ItemsByGroup = {
  'starred-filters-group': [
    {
      type: 'SortableItem',
      id: 'older-than-90-days',
      text: 'Older than 90 days',
    },
    { type: 'SortableItem', id: 'critical-bugs', text: 'Critical bugs' },
  ],
  'other-filters-group': [
    {
      type: 'SortableItem',
      id: 'my-open-issues',
      text: 'My open issues',
    },
    {
      type: 'SortableItem',
      id: 'reported-by-me',
      text: 'Reported by me',
    },
    { type: 'SortableItem', id: 'all-issues', text: 'All issues' },
    { type: 'SortableItem', id: 'open-issues', text: 'Open issues' },
    { type: 'SortableItem', id: 'done-issues', text: 'Done issues' },
    {
      type: 'SortableItem',
      id: 'viewed-recently',
      text: 'Viewed recently',
    },
    {
      type: 'SortableItem',
      id: 'created-recently',
      text: 'Created recently',
    },
    {
      type: 'SortableItem',
      id: 'resolved-recently',
      text: 'Resolved recently',
    },
    {
      type: 'SortableItem',
      id: 'updated-recently',
      text: 'Updated recently',
    },
  ],
};

const {
  Provider: ContextProvider,
  Consumer: SortableItemsConsumer,
} = React.createContext({ sortableItems: {}, onDragEnd: () => {} });

type Props = {
  children: Node,
};

export { SortableItemsConsumer };

export class SortableItemsProvider extends Component<Props, *> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortableItems: initialSortableIssueItems,
      onDragEnd: this.onDragEnd,
    };
  }

  onDragEnd = (dropResult: DropResult) => {
    const updatedItems = updateSortableItems(
      this.state.sortableItems,
      dropResult,
    );
    if (updatedItems) {
      this.setState({
        sortableItems: updatedItems,
      });
    }
  };

  render() {
    return (
      <ContextProvider value={this.state}>
        {this.props.children}
      </ContextProvider>
    );
  }
}

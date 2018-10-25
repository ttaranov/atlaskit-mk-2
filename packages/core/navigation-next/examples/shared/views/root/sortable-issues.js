// @flow

import React, { Component } from 'react';
import { JiraWordmark as JiraWordmarkLogo } from '@atlaskit/logo';

import { ViewController, ViewControllerSubscriber } from '../../../../src';

import { LinkItem } from '../../components';
import { SortableItemsConsumer } from '../../providers/sortable-items-provider';
import type { ItemsByGroup } from '../../providers/sortable-items-provider/types';
import defaultGetAnalyticsAttributes from '../common/get-analytics-attributes';
import type { ViewComponentProps } from '../common/types';

type SortableIssuesViewProps = ViewComponentProps & {
  sortableItems: ItemsByGroup,
  viewController: ViewController,
  onDragEnd: (dropResult: *) => void,
};

const getRootSortableIssues = ({ sortableItems, onDragEnd }: *) => () => [
  {
    id: 'root/sortable-issues:header',
    type: 'HeaderSection',
    items: [
      { type: 'Wordmark', wordmark: JiraWordmarkLogo, id: 'jira-wordmark' },
      {
        type: 'BackItem',
        goTo: 'root/index',
        id: 'back',
        text: 'Back to Jira',
      },
    ],
  },
  {
    id: 'root/sortable-issues:menu',
    nestedGroupKey: 'menu',
    parentId: 'root/index:menu',
    type: 'MenuSection',
    alwaysShowScrollHint: true,
    items: [
      {
        type: 'SectionHeading',
        id: 'section-heading',
        text: 'Sortable Issues and filters',
      },
      {
        type: LinkItem,
        id: 'search-issues',
        text: 'Search issues',
        to: '/issues/search',
      },
      {
        type: 'SortableSection',
        id: 'section-filters',
        onDragEnd,
        items: [
          {
            type: 'SortableGroup',
            id: 'starred-filters-group',
            heading: 'Starred filters',
            items: sortableItems['starred-filters-group'],
          },
          {
            type: 'SortableGroup',
            id: 'other-filters-group',
            heading: 'Other filters',
            items: sortableItems['other-filters-group'],
          },
        ],
      },
    ],
  },
];

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
    const {
      viewController,
      sortableItems,
      getItemsFactory,
      viewId,
      type,
      getAnalyticsAttributes,
    } = this.props;
    const { onDragEnd } = this;

    const getItems = getItemsFactory({
      sortableItems,
      onDragEnd,
    });

    viewController.addView({
      getAnalyticsAttributes,
      getItems,
      id: viewId,
      type,
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

const SortableIssuesView = () => (
  <ViewControllerSubscriber>
    {viewController => (
      <SortableItemsConsumer>
        {({ sortableItems, onDragEnd }) => (
          <SortableIssuesViewBase
            sortableItems={sortableItems}
            onDragEnd={onDragEnd}
            viewController={viewController}
            getAnalyticsAttributes={defaultGetAnalyticsAttributes}
            getItemsFactory={getRootSortableIssues}
            type="product"
            viewId="root/sortable-issues"
          />
        )}
      </SortableItemsConsumer>
    )}
  </ViewControllerSubscriber>
);

export default SortableIssuesView;

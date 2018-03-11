// @flow
import React, { Children, Component, type Node, type Element } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import EllipsisItem from './EllipsisItem';
import Container from '../styled/BreadcrumbsContainer';

const defaultMaxItems = 8;

const { toArray } = Children;

type Props = {
  /** Override collapsing of the nav when there are more than maxItems */
  isExpanded?: boolean,
  /** Set the maximum number of breadcrumbs to display. When there are more
  than the maximum number, only the first and last will be shown, with an
  ellipsis in between. */
  maxItems?: number,
  /** A function to be called when you are in the collapsed view and click
   the ellpisis. */
  onExpand: Event => mixed,
  /** A single <BreadcrumbsItem> or an array of <BreadcrumbsItem>.  */
  children?: Node,
};

export class BreadcrumbsStateless extends Component<Props, {}> {
  props: Props; // eslint-disable-line react/sort-comp

  static defaultProps = {
    isExpanded: false,
    children: null,
    maxItems: defaultMaxItems,
  };

  renderAllItems(): Array<Element<*>> {
    const allNonEmptyItems = toArray(this.props.children);
    return allNonEmptyItems.map((child, index) =>
      React.cloneElement(child, {
        hasSeparator: index < allNonEmptyItems.length - 1,
      }),
    );
  }

  renderFirstAndLast() {
    const itemsToRender = this.renderAllItems();
    return [
      itemsToRender[0],
      <EllipsisItem
        hasSeparator
        key="ellipsis"
        onClick={this.props.onExpand}
      />,
      itemsToRender[itemsToRender.length - 1],
    ];
  }

  render() {
    const { children, isExpanded, maxItems } = this.props;
    if (!children) return <Container />;
    return (
      <Container>
        {isExpanded || (maxItems && toArray(children).length <= maxItems)
          ? this.renderAllItems()
          : this.renderFirstAndLast()}
      </Container>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  component: 'breadcrumbs',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onExpand: createAndFireEventOnAtlaskit({
      action: 'expand',
    }),
  })(BreadcrumbsStateless),
);

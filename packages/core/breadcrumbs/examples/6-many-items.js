// @flow
import React, { Component, Fragment } from 'react';
import { BeforeItemsSelect, AfterItemsSelect } from './utils/Selects';
import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default class Examples extends Component<*, *> {
  state = {
    itemsBeforeCollapse: 2,
    itemsAfterCollapse: 0,
  };

  render() {
    const { itemsBeforeCollapse, itemsAfterCollapse } = this.state;

    return (
      // with many items
      <Fragment>
        <Breadcrumbs>
          <BreadcrumbsItem href="/item" text="Item" />
          <BreadcrumbsItem href="/item" text="Another item" />
          <BreadcrumbsItem href="/item" text="A third item" />
          <BreadcrumbsItem
            href="/item"
            text="A fourth item with a very long name"
          />
          <BreadcrumbsItem href="/item" text="Yet another item" />
          <BreadcrumbsItem href="/item" text="An item" />
          <BreadcrumbsItem href="/item" text="The next item" />
          <BreadcrumbsItem href="/item" text="The item after the next item" />
          <BreadcrumbsItem href="/item" text="The ninth item" />
          <BreadcrumbsItem href="/item" text="Item ten" />
          <BreadcrumbsItem href="/item" text="The last item" />
        </Breadcrumbs>
        <p>
          You can also use the itemsBeforeCollapse and itemsAfterCollapse props
          to alter the number of items shown in the collapse state. Try changing
          the selects below to see the different configurations.
        </p>
        <BeforeItemsSelect
          onChange={({ value }) =>
            this.setState({ itemsBeforeCollapse: value })
          }
        />
        <AfterItemsSelect
          onChange={({ value }) => this.setState({ itemsAfterCollapse: value })}
        />
        <Breadcrumbs
          itemsBeforeCollapse={itemsBeforeCollapse}
          itemsAfterCollapse={itemsAfterCollapse}
        >
          <BreadcrumbsItem href="/item" text="Item" />
          <BreadcrumbsItem href="/item" text="Another item" />
          <BreadcrumbsItem href="/item" text="A third item" />
          <BreadcrumbsItem
            href="/item"
            text="A fourth item with a very long name"
          />
          <BreadcrumbsItem href="/item" text="Yet another item" />
          <BreadcrumbsItem href="/item" text="An item" />
          <BreadcrumbsItem href="/item" text="The next item" />
          <BreadcrumbsItem href="/item" text="The item after the next item" />
          <BreadcrumbsItem href="/item" text="The ninth item" />
          <BreadcrumbsItem href="/item" text="Item ten" />
          <BreadcrumbsItem href="/item" text="The last item" />
        </Breadcrumbs>
      </Fragment>
    );
  }
}

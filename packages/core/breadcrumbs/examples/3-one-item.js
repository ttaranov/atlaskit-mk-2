// @flow
import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // with one item
  <Breadcrumbs>
    <BreadcrumbsItem href="/page" text="Page" />
  </Breadcrumbs>
);

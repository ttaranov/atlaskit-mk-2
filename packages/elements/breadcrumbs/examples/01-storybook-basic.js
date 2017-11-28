// @flow
import React from 'react';

import Breadcrumbs, { BreadcrumbsItem } from '../src';

export default () => (
  // simple ak-breadcrumbs
  <Breadcrumbs>
    <BreadcrumbsItem href="/pages" text="Pages" />
    <BreadcrumbsItem href="/pages/home" text="Home" />
    <BreadcrumbsItem href="/pages/adg3" text="ADG 3 - New site" />
    <BreadcrumbsItem
      href="/pages/daccontent"
      text="design.atlassian.com content"
    />
    <BreadcrumbsItem
      href="/pages/product-design"
      text="Product design (draft)"
    />
    <BreadcrumbsItem
      href="/pages/patternsdesign"
      text="Patterns design (draft)"
    />
  </Breadcrumbs>
);

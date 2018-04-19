// @flow
import React from 'react';
import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);

export default () => (
  <PageHeader breadcrumbs={breadcrumbs}>
    Title describing the content but really really really really really really
    really really really really really really really really really long text in
    order to get it to truncate into an ellipsis
  </PageHeader>
);

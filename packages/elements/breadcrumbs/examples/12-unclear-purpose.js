// @flow
import React from 'react';
import Breadcrumbs, { BreadcrumbsItem } from '../src';
import nucleusImage from './nucleus.png';

const icon1 = <img alt="icon2" src={nucleusImage} height="16px" width="16px" />;
const icon2 = <img alt="icon1" src={nucleusImage} height="16px" width="16px" />;
export default () => (
  // with items having onClick handler and no href
  <div>
    <Breadcrumbs>
      <BreadcrumbsItem
        truncationWidth={200}
        text="some very very long text to be truncated"
        iconBefore={icon1}
      />
      <BreadcrumbsItem text="some other text" iconBefore={icon2} />
    </Breadcrumbs>
  </div>
);

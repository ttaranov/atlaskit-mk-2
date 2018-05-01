// @flow
import React from 'react';
import styled from 'styled-components';
import Breadcrumbs, { BreadcrumbsItem } from '../src';
import nucleusImage from './nucleus.png';

const Img = styled.img`
  padding-right: 4px;
`;

const icon1 = <Img alt="icon2" src={nucleusImage} height="16px" width="16px" />;
const icon2 = <Img alt="icon1" src={nucleusImage} height="16px" width="16px" />;
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

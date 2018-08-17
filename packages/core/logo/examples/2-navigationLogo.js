// @flow
import React, { Fragment } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  StrideIcon,
} from '../src';

const logoOptions = [
  BitbucketIcon,
  ConfluenceIcon,
  JiraCoreIcon,
  JiraIcon,
  JiraServiceDeskIcon,
  JiraSoftwareIcon,
  StrideIcon,
];

const WrapperDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  color: white;
  background: ${colors.B500};
`;
/* eslint-disable */
const Wrapper = props => (
  <Fragment>
    <WrapperDiv>{props.children}</WrapperDiv>
    <br />
  </Fragment>
);
/* eslint-enable */
logoOptions.map(Child => (
  <Wrapper>
    <Child />
  </Wrapper>
));

export default () => (
  <Fragment>
    {logoOptions.map(Child => (
      <Wrapper key={Child.name}>
        <Child />
      </Wrapper>
    ))}
  </Fragment>
);

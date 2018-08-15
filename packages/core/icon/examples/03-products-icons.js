// @flow
import React, { Fragment } from 'react';
import { colors } from '@atlaskit/theme';
import styled from 'styled-components';

import BitbucketIcon from '../glyph/bitbucket-large';
import ConfluenceIcon from '../glyph/confluence-large';
import JiraCoreIcon from '../glyph/jira-core-large';
import JiraIcon from '../glyph/jira-large';
import JiraServiceDeskIcon from '../glyph/jira-service-desk-large';
import JiraSoftwareIcon from '../glyph/jira-software-large';
import StrideIcon from '../glyph/stride-large';

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

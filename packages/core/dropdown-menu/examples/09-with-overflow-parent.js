// @flow

import React, { Fragment } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import DropdownMenu, { DropdownItemGroup, DropdownItem } from '../src';

const Description = styled.p`
  margin-bottom: 8px;
`;

const OverflowParentHidden = styled.div`
  position: relative;
  padding: 20px;
  overflow: hidden;
  background-color: ${colors.N20};
`;

const OverflowParentScroll = styled.div`
  padding: 20px;
  margin-top: 10px;
  height: 100px;
  overflow: auto;
  background-color: ${colors.N20};
`;

const OverflowChild = styled.div`
  height: 150px;
  padding-top: 50px;
`;

const dropdown = (
  <DropdownMenu triggerType="button" trigger="Choices">
    <DropdownItemGroup>
      <DropdownItem>Sydney</DropdownItem>
      <DropdownItem>Melbourne</DropdownItem>
    </DropdownItemGroup>
  </DropdownMenu>
);

export default () => (
  <Fragment>
    <Description>
      The grey boxes below are the containing blocks of the dropdown with an
      overflow.<br /> The list should still be visible outside of it when open.
    </Description>
    <OverflowParentHidden>{dropdown}</OverflowParentHidden>
    <OverflowParentScroll>
      <OverflowChild>{dropdown}</OverflowChild>
    </OverflowParentScroll>
  </Fragment>
);

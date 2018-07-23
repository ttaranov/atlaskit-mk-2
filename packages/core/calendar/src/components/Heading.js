// @flow

import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right-large';
import { colors } from '@atlaskit/theme';
import React from 'react';
import styled from 'styled-components';
import { getMonthName } from '../util';
import Btn from './Btn';

import { Heading, MonthAndYear } from '../styled/Heading';

type Props = {|
  month: number,
  year: number,
  handleClickNext?: () => void,
  handleClickPrev?: () => void,
|};

const ArrowLeft = styled.div`
  margin-left: 8px;
`;
const ArrowRight = styled.div`
  margin-right: 8px;
`;

export default (props: Props) => (
  <Heading aria-hidden="true">
    <ArrowLeft>
      <Btn onClick={props.handleClickPrev}>
        <ArrowleftIcon
          label="Last month"
          size="medium"
          primaryColor={colors.N70}
        />
      </Btn>
    </ArrowLeft>
    <MonthAndYear>{`${getMonthName(props.month)} ${props.year}`}</MonthAndYear>
    <ArrowRight>
      <Btn onClick={props.handleClickNext}>
        <ArrowrightIcon
          label="Next month"
          size="medium"
          primaryColor={colors.N70}
        />
      </Btn>
    </ArrowRight>
  </Heading>
);

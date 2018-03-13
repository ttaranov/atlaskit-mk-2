// @flow

import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowrightIcon from '@atlaskit/icon/glyph/arrow-right';
import { colors } from '@atlaskit/theme';
import React from 'react';
import { getMonthName } from '../util';
import Btn from './Btn';

import { Heading, MonthAndYear } from '../styled/Heading';

type Props = {|
  month: number,
  year: number,
  handleClickNext?: () => void,
  handleClickPrev?: () => void,
|};

export default (props: Props) => (
  <Heading aria-hidden="true">
    <div>
      <Btn onClick={props.handleClickPrev}>
        <ArrowleftIcon
          label="Last month"
          size="medium"
          primaryColor={colors.N80}
        />
      </Btn>
    </div>
    <MonthAndYear>{`${getMonthName(props.month)} ${props.year}`}</MonthAndYear>
    <div>
      <Btn onClick={props.handleClickNext}>
        <ArrowrightIcon
          label="Next month"
          size="medium"
          primaryColor={colors.N80}
        />
      </Btn>
    </div>
  </Heading>
);

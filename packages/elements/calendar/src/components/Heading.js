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
  handleClickNext: () => void,
  handleClickPrev: () => void,
|};

export default (props: Props) => (
  <Heading>
    <div aria-hidden="true" onClick={props.handleClickPrev}>
      <Btn>
        <ArrowleftIcon
          label="Last month"
          size="medium"
          primaryColor={colors.N80}
        />
      </Btn>
    </div>
    <MonthAndYear>{`${getMonthName(props.month)} ${props.year}`}</MonthAndYear>
    <div aria-hidden="true" onClick={props.handleClickNext}>
      <Btn>
        <ArrowrightIcon
          label="Next month"
          size="medium"
          primaryColor={colors.N80}
        />
      </Btn>
    </div>
  </Heading>
);

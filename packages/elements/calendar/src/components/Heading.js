import ArrowleftIcon from '@atlaskit/icon/glyph/chevron-left';
import ArrowrightIcon from '@atlaskit/icon/glyph/chevron-right';
import { colors } from '@atlaskit/theme';
import React, { PureComponent } from 'react';
import { getMonthName } from '../util';
import Btn from './Btn';

import {
  Heading,
  MonthAndYear,
} from '../styled/Heading';

type Props = {|
  month: number,
  year: number,
  handleClickNext: () => void,
  handleClickPrev: () => void,
|}

export default class CalendarHeading extends PureComponent {
  props: Props // eslint-disable-line react/sort-comp

  render() {
    const { month, year } = this.props;
    return (
      <Heading>
        <div aria-hidden="true" onClick={this.props.handleClickPrev}>
          <Btn>
            <ArrowleftIcon label="Last month" size="medium" primaryColor={colors.N80} />
          </Btn>
        </div>
        <MonthAndYear>
          {`${getMonthName(month)} ${year}`}
        </MonthAndYear>
        <div aria-hidden="true" onClick={this.props.handleClickNext}>
          <Btn>
            <ArrowrightIcon label="Next month" size="medium" primaryColor={colors.N80} />
          </Btn>
        </div>
      </Heading>
    );
  }
}

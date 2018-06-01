import * as React from 'react';
import Modal, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';
import Calendar from '@atlaskit/calendar';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import Button from '@atlaskit/button';
import * as format from 'date-fns/format';
import * as getMonth from 'date-fns/get_month';
import * as getYear from 'date-fns/get_year';
import { TimePicker } from '@atlaskit/datetime-picker';

import {
  Footer,
  TimePickerWrapper,
  DateLabel,
} from '../../styled/ReminderAdornment';

type HeaderProps = { onClose: () => void; showKeyline: boolean };

const Header = ({ onClose, showKeyline }: HeaderProps) => (
  <ModalHeader showKeyline={showKeyline}>
    <ModalTitle>Set Reminder</ModalTitle>
    <Button
      onClick={onClose}
      appearance="subtle"
      spacing="none"
      iconBefore={<CrossIcon label="Close Modal" />}
    />
  </ModalHeader>
);

export type Props = {
  isOpen: boolean;
  onRequetsClose?: () => void;
  onChange?: (value?: string) => void;
  value?: string;
};

export class SetReminderModal extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  handleOnClose = () => {
    if (this.props.onRequetsClose) {
      this.props.onRequetsClose();
    }
  };

  parseValue(): {
    date?: string;
    time?: string;
    month?: number;
    year?: number;
  } {
    if (this.props.value) {
      const date = new Date(this.props.value);
      return {
        date: format(date, 'YYYY-MM-DD'),
        time: format(date, 'HH:mm'),
        month: getMonth(date) + 1,
        year: getYear(date),
      };
    }
    return {};
  }

  getNewValue({ day, month, year, iso }): Date {
    if (this.props.value) {
      const date = new Date(this.props.value);
      date.setDate(day);
      date.setMonth(month - 1);
      date.setFullYear(year);
      return date;
    }
    return new Date(`${iso} 9:00`);
  }

  handleDateChange = this.triggerOnChange<{
    day: number;
    month: number;
    year: number;
    iso: string;
  }>(date => {
    return this.getNewValue(date);
  });

  handleTimechange = this.triggerOnChange<string>(time => {
    if (this.props.value) {
      const [, hours = '09', minutes = '00'] =
        time.match(/(\d\d):(\d\d)/) || [];
      const date = new Date(this.props.value);
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      return date;
    }
    return undefined;
  });

  handleRemoveClick = () => {
    if (this.props.onChange) {
      this.props.onChange(undefined);
    }
    this.handleOnClose();
  };

  triggerOnChange<T>(
    dateCreator: (arg: T) => Date | undefined,
  ): ((arg: T) => void) {
    return arg => {
      if (this.props.onChange) {
        const date: Date | undefined = dateCreator(arg);

        this.props.onChange(date ? date.toISOString() : undefined);
      }
    };
  }

  render() {
    const { date, month, year, time } = this.parseValue();

    if (this.props.isOpen) {
      return (
        <Modal onClose={this.handleOnClose} header={Header} width={321}>
          <Calendar
            previouslySelected={[]}
            selected={[date]}
            defaultMonth={month}
            defaultYear={year}
            onSelect={this.handleDateChange}
          />
          {time
            ? [
                <DateLabel key="date-label">
                  {format(this.props.value!, 'dddd, D MMM')}
                </DateLabel>,
                <Footer key="footer">
                  <TimePickerWrapper>
                    <TimePicker value={time} onChange={this.handleTimechange} />
                  </TimePickerWrapper>
                  <Button appearance="subtle" onClick={this.handleRemoveClick}>
                    Remove
                  </Button>
                </Footer>,
              ]
            : null}
        </Modal>
      );
    }
    return null;
  }
}

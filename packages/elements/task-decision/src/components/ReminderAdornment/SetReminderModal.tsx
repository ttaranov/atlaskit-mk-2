import * as React from 'react';
import Modal from '@atlaskit/modal-dialog';
import Calendar from '@atlaskit/calendar';
import { TimePicker } from '@atlaskit/datetime-picker';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Button from '@atlaskit/button';
import * as format from 'date-fns/format';

export type Props = {
  isOpen: boolean;
  onRequetsClose?: () => void;
  onChange?: (value?: string) => void;
  value?: string;
  onConfirm?: (value: string) => void;
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

  parseValue(): { date: string; time: string } | undefined {
    if (this.props.value) {
      const date = new Date(this.props.value);
      return {
        date: format(date, 'YYYY-MM-DD'),
        time: format(date, 'HH:mm'),
      };
    }
    return undefined;
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

  handleSetReminder = () => {
    const { value, onConfirm } = this.props;
    if (onConfirm && value) {
      onConfirm(value);
    }
  };

  render() {
    const parsedValue = this.parseValue();

    if (this.props.isOpen) {
      return (
        <Modal
          onClose={this.handleOnClose}
          heading="Set reminder"
          width="small"
          actions={[
            {
              onClick: this.handleSetReminder,
              text: 'Set reminder',
            },
            {
              onClick: this.handleOnClose,
              text: 'Cancel',
            },
          ]}
        >
          <Calendar
            previouslySelected={[]}
            value={parsedValue ? parsedValue : undefined}
            onSelect={this.handleDateChange}
          />
          {parsedValue && (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flexGrow: 1 }}>
                <TimePicker
                  value={parsedValue.time}
                  onChange={this.handleTimechange}
                />
              </div>
              <Button
                appearance="subtle"
                spacing="none"
                iconBefore={
                  <EditorRemoveIcon label="Remove reminder">
                    Remove reminder
                  </EditorRemoveIcon>
                }
              />
            </div>
          )}
        </Modal>
      );
    }
    return null;
  }
}

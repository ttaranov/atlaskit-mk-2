import * as React from 'react';
import Button from '@atlaskit/button';
import NotificationDirectIcon from '@atlaskit/icon/glyph/notification-direct';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import { SetReminderModal } from './SetReminderModal';
import Tooltip from '@atlaskit/tooltip';
import * as format from 'date-fns/format';

export type Props = {
  onReminderSet?: (value?: string) => void;
  value?: string;
};

export type State = {
  isOpen: boolean;
  value?: string;
};

export class ReminderAdornment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  toggleOpen = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
      value: this.props.value,
    }));
  };

  handleConfirm = value => {
    if (this.props.onReminderSet) {
      this.props.onReminderSet(value);
    }
    this.toggleOpen();
  };

  getIconAndLabel() {
    if (this.props.value) {
      return {
        Icon: NotificationAllIcon,
        label: format(this.props.value, 'ddd, MMM Do @ HH:mm'),
      };
    }
    return {
      Icon: NotificationDirectIcon,
      label: 'Set reminder',
    };
  }

  renderButton() {
    const { Icon, label } = this.getIconAndLabel();
    return (
      <Tooltip key="button" position="top" content={label}>
        <Button
          appearance="subtle"
          spacing="none"
          onClick={this.toggleOpen}
          iconBefore={<Icon label={label}>label</Icon>}
        />
      </Tooltip>
    );
  }

  render() {
    return [
      this.renderButton(),
      <SetReminderModal
        key="modal"
        isOpen={this.state.isOpen}
        onRequetsClose={this.toggleOpen}
        onChange={value => this.setState({ value })}
        value={this.state.value}
        onConfirm={this.handleConfirm}
      />,
    ];
  }
}

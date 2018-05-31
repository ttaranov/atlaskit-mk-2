import * as React from 'react';
import Button from '@atlaskit/button';
import NotificationDirectIcon from '@atlaskit/icon/glyph/notification-direct';
import NotificationAllIcon from '@atlaskit/icon/glyph/notification-all';
import { SetReminderModal } from './SetReminderModal';
import { RecomendationsDropdown } from './RecomendationsDropdown';
import Tooltip from '@atlaskit/tooltip';
import * as format from 'date-fns/format';

import { OnHover } from '../../styled/Item';

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

  handleOnChange = value => {
    this.setState({ value });
    if (this.props.onReminderSet) {
      this.props.onReminderSet(value);
    }
  };

  getButtonProperties() {
    if (this.props.value) {
      return {
        Icon: NotificationAllIcon,
        label: format(this.props.value, 'ddd, MMM Do @ HH:mm'),
        onClick: this.toggleOpen,
      };
    }
    return {
      Icon: NotificationDirectIcon,
      label: 'Set reminder',
      onClick: undefined,
    };
  }

  handleSmartRecomendationClick = (type: string) => {};

  renderButton() {
    const { Icon, label, onClick } = this.getButtonProperties();
    const button = (
      <Button
        appearance="subtle"
        spacing="none"
        onClick={onClick}
        iconBefore={<Icon label={label}>label</Icon>}
      />
    );
    return this.props.value ? (
      button
    ) : (
      <RecomendationsDropdown
        label={label}
        trigger={
          <Tooltip
            key="button"
            position="top"
            content={label}
            hideTooltipOnClick
          >
            <OnHover>{button}</OnHover>
          </Tooltip>
        }
        onCustom={this.toggleOpen}
        onChange={this.handleOnChange}
      />
    );
  }

  render() {
    return [
      this.renderButton(),
      <SetReminderModal
        key="modal"
        isOpen={this.state.isOpen}
        onRequetsClose={this.toggleOpen}
        onChange={this.handleOnChange}
        value={this.state.value}
      />,
    ];
  }
}

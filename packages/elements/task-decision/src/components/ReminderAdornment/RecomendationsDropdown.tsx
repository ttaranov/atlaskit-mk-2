import * as React from 'react';
import Dropdown, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import * as addDays from 'date-fns/add_days';
import * as format from 'date-fns/format';
import { Hint } from '../../styled/ReminderAdornment';
import { addMinutes } from 'date-fns';

export type RecomendationType =
  | 'two-mins'
  | 'tomorrow-morning'
  | 'custom'
  | 'next-week'
  | 'one-week';

type RecomendationOptionProps = {
  type: RecomendationType;
  onClick?: (type: RecomendationType) => void;
  children: React.ReactNode;
};

const RecomendationOption = ({
  type,
  onClick,
  children,
}: RecomendationOptionProps) => {
  const handleOnClick = () => {
    onClick && onClick(type);
  };
  return <DropdownItem onClick={handleOnClick}>{children}</DropdownItem>;
};

export type Props = {
  trigger: JSX.Element;
  onCustom?: () => void;
  onChange?: (value?: string) => void;
  label?: string;
};

const set9Am = (date: Date) => {
  date.setHours(9);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
};

export class RecomendationsDropdown extends React.Component<Props> {
  triggerOnChange(date: Date) {
    if (this.props.onChange) {
      this.props.onChange(date.toISOString());
    }
  }

  handleOptionClick = (type: RecomendationType) => {
    const { onCustom } = this.props;
    switch (type) {
      case 'custom':
        onCustom && onCustom();
        break;
      case 'two-mins': {
        const date = addMinutes(new Date(), 2);
        this.triggerOnChange(date);
        break;
      }
      case 'tomorrow-morning': {
        const date = addDays(new Date(), 1);
        set9Am(date);
        this.triggerOnChange(date);
        break;
      }
      case 'one-week': {
        const date = addDays(new Date(), 7);
        set9Am(date);
        this.triggerOnChange(date);
        break;
      }
      case 'next-week': {
        const date = addDays(new Date(), (7 - new Date().getDay()) % 7 + 1);
        set9Am(date);
        this.triggerOnChange(date);
        break;
      }
    }
  };

  render() {
    let options: Array<{
      type: RecomendationType;
      label: string;
      hint?: string;
    }> = [
      { type: 'two-mins', label: 'In Two Mins', hint: '+ 2 mins' },
      { type: 'tomorrow-morning', label: 'Tomorrow', hint: '9:00' },
      { type: 'next-week', label: 'Next week', hint: 'Mon' },
      { type: 'one-week', label: 'One week', hint: format(new Date(), 'ddd') },
      { type: 'custom', label: 'Other...' },
    ];

    return (
      <Dropdown trigger={this.props.trigger} position="bottom right">
        {this.props.label && <DropdownItemGroup title={this.props.label} />}
        {options.map(({ type, label, hint }) => (
          <RecomendationOption type={type} onClick={this.handleOptionClick}>
            {label} {hint && <Hint>{hint}</Hint>}
          </RecomendationOption>
        ))}
      </Dropdown>
    );
  }
}

// @flow

import Calendar from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import Select, { mergeStyles } from '@atlaskit/select';
import { borderRadius, colors, layers, elevation } from '@atlaskit/theme';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { format, isValid, parse, getDaysInMonth } from 'date-fns';
import pick from 'lodash.pick';
import React, { Component, type Node, type ElementRef } from 'react';
import styled from 'styled-components';

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

import {
  ClearIndicator,
  defaultDateFormat,
  DropdownIndicator,
  padToTwo,
} from '../internal';
import FixedLayer from '../internal/FixedLayer';
import type { Event } from '../types';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  /** Defines the appearance which can be default or subtle - no borders, background or icon.
   * Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: 'default' | 'subtle',
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean,
  /** Default for `isOpen`. */
  defaultIsOpen: boolean,
  /** Default for `value`. */
  defaultValue: string,
  /** An array of ISO dates that should be disabled on the calendar. */
  disabled: Array<string>,
  /** The icon to show in the field. */
  icon: Node,
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string,
  /** Props to apply to the container. **/
  innerProps: Object,
  /** Whether or not the field is disabled. */
  isDisabled?: boolean,
  /** Whether or not the dropdown is open. */
  isOpen?: boolean,
  /** The name of the field. */
  name: string,
  /** Called when the field is blurred. */
  onBlur: (e: SyntheticFocusEvent<>) => void,
  /** Called when the value changes. The only argument is an ISO time. */
  onChange: string => void,
  /** Called when the field is focused. */
  onFocus: (e: SyntheticFocusEvent<>) => void,
  /* A function for parsing input characters and transforming them into a Date object. By default uses [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) */
  parseInputValue: (date: string, dateFormat: string) => Date,
  /* A function for formatting the date displayed in the input. By default composes together [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) and [date-fn's format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string*/
  formatDisplayLabel: (value: string, dateFormat: string) => string,
  /** Props to apply to the select. This can be used to set options such as placeholder text.
   *  See [here](/packages/core/select) for documentation on select props. */
  selectProps: Object,
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: 'compact' | 'default',
  /** The ISO time that should be used as the input value. */
  value?: string,
  /** Indicates current value is invalid & changes border color */
  isInvalid?: boolean,
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean,
  /** Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat: string,
  /** Placeholder text displayed in input */
  placeholder?: string,
};

type State = {
  isOpen: boolean,
  value: string,
  /** Value to be shown in the calendar as selected.  */
  selectedValue: string,
  view: string,
};

function isoToObj(iso: string) {
  const parsed = parse(iso);
  if (!isValid(parsed)) return {};
  return {
    day: parsed.getDate(),
    month: parsed.getMonth() + 1,
    year: parsed.getFullYear(),
  };
}

const arrowKeys = {
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
};

const StyledMenu = styled.div`
  background-color: ${colors.N20};
  border-radius: ${borderRadius()}px;
  z-index: ${layers.dialog};
  ${elevation.e200};
`;

const Menu = ({ innerProps: menuInnerProps, selectProps }: Object) => (
  <StyledMenu>
    <Calendar
      {...isoToObj(selectProps.calendarValue)}
      {...isoToObj(selectProps.calendarView)}
      disabled={selectProps.calendarDisabled}
      onChange={selectProps.onCalendarChange}
      onSelect={selectProps.onCalendarSelect}
      ref={selectProps.calendarRef}
      selected={[selectProps.selectedCalendarValue]}
      innerProps={menuInnerProps}
    />
  </StyledMenu>
);

const FixedLayeredMenu = ({ selectProps, ...props }: Object) => (
  <FixedLayer
    inputValue={selectProps.inputValue}
    containerRef={selectProps.calendarContainerRef}
    content={<Menu {...props} selectProps={selectProps} />}
  />
);

class DatePicker extends Component<Props, State> {
  // $FlowFixMe - Calendar isn't being correctly detected as a react component
  calendar: ElementRef<Calendar>;
  containerRef: ?HTMLElement;
  input: Element | null;

  static defaultProps = {
    appearance: 'default',
    autoFocus: false,
    dateFormat: defaultDateFormat,
    defaultIsOpen: false,
    defaultValue: '',
    disabled: [],
    formatDisplayLabel: (value: string, dateFormat: string): string =>
      format(parse(value), dateFormat),
    hideIcon: false,
    icon: CalendarIcon,
    id: '',
    innerProps: {},
    isDisabled: false,
    isInvalid: false,
    name: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    parseInputValue: parse,
    placeholder: 'e.g. 2018/01/01',
    selectProps: {},
    spacing: 'default',
  };

  constructor(props: any) {
    super(props);
    const now = new Date();
    const thisDay = now.getDate();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    this.state = {
      isOpen: this.props.defaultIsOpen,
      selectedValue: this.props.value || this.props.defaultValue,
      value: this.props.defaultValue,
      view:
        this.props.value ||
        this.props.defaultValue ||
        `${thisYear}-${padToTwo(thisMonth)}-${padToTwo(thisDay)}`,
    };
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getState = () => {
    return {
      ...this.state,
      ...pick(this.props, ['value', 'isOpen']),
    };
  };

  /**
   * Checks if a date is one of the disabled
   */
  isDateDisabled = (date: String) => {
    return this.props.disabled.indexOf(date) > -1;
  };

  onCalendarChange = ({ iso }: { iso: string }) => {
    const [year, month, date] = iso.split('-');
    let newIso = iso;

    const lastDayInMonth = getDaysInMonth(
      new Date(parseInt(year, 10), parseInt(month, 10) - 1),
    );

    if (parseInt(lastDayInMonth, 10) < parseInt(date, 10)) {
      newIso = `${year}-${month}-${lastDayInMonth}`;
    }

    this.setState({ view: newIso });
  };

  onCalendarSelect = ({ iso: value }: { iso: string }) => {
    this.setState({ isOpen: false, selectedValue: value });
    this.triggerChange(value);
  };

  onInputClick = () => {
    if (!this.getState().isOpen) this.setState({ isOpen: true });
  };

  onSelectBlur = (e: SyntheticFocusEvent<>) => {
    this.setState({ isOpen: false });
    this.props.onBlur(e);
  };

  onSelectFocus = (e: SyntheticFocusEvent<>) => {
    this.setState({ isOpen: true });
    this.props.onFocus(e);
  };

  onSelectInput = (e: Event) => {
    let value = e.target.value;
    const { dateFormat, parseInputValue } = this.props;
    if (value) {
      const parsed = parseInputValue(value, dateFormat);
      // Only try to set the date if we have month & day
      if (isValid(parsed)) {
        // We format the parsed date to YYYY-MM-DD here because
        // this is the format expected by the @atlaskit/calendar component
        const calendarFormat = 'YYYY-MM-DD';
        value = format(parsed, calendarFormat);
        this.triggerChange(value);
      }
    }
    this.setState({ isOpen: true });
  };

  onSelectKeyDown = (e: Event) => {
    const { key } = e;
    const dir = arrowKeys[key];
    const { view } = this.getState();

    if (dir) {
      // Calendar will not exist if it's not open and this also doubles as a
      // ref check since it may not exist.
      if (this.calendar) {
        // We don't want to move the caret if the calendar is open.
        if (dir === 'left' || dir === 'right') {
          e.preventDefault();
        }
        this.calendar.navigate(dir);
      } else if (dir === 'down' || dir === 'up') {
        this.setState({ isOpen: true });
      }
    } else if (key === 'Escape') {
      this.setState({ isOpen: false });
    } else if (key === 'Backspace') {
      this.setState({ selectedValue: '' });
      this.triggerChange('');

      // Dates may be disabled
    } else if (!this.isDateDisabled(view)) {
      if (key === 'Enter') {
        this.triggerChange(view);
        this.setState({ isOpen: false, selectedValue: view });
      }

      if (key === 'Tab') {
        this.setState({ isOpen: false });
      }
    }
  };

  refCalendar = (ref: ElementRef<typeof Calendar>) => {
    this.calendar = ref;
  };

  triggerChange = (value: string) => {
    this.props.onChange(value);
    this.setState({ value, view: value });
  };

  getContainerRef = (ref: ?HTMLElement) => {
    const oldRef = this.containerRef;
    this.containerRef = ref;
    // Cause a re-render if we're getting the container ref for the first time
    // as the layered menu requires it for dimension calculation
    if (oldRef == null && ref != null) {
      this.forceUpdate();
    }
  };

  getSubtleControlStyles = () => {
    return {
      border: `2px solid ${
        this.getState().isOpen ? `${colors.B100}` : `transparent`
      }`,
      backgroundColor: 'transparent',
      padding: '1px',
    };
  };

  render() {
    const {
      autoFocus,
      disabled,
      formatDisplayLabel,
      id,
      innerProps,
      isDisabled,
      name,
      selectProps,
      spacing,
      dateFormat,
      placeholder,
    } = this.props;
    const { value, view, isOpen } = this.getState();
    const validationState = this.props.isInvalid ? 'error' : 'default';
    const icon =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : this.props.icon;

    const calendarProps = {
      calendarContainerRef: this.containerRef,
      calendarRef: this.refCalendar,
      calendarDisabled: disabled,
      calendarValue: value,
      calendarView: view,
      dropdownIndicatorIcon: icon,
      onCalendarChange: this.onCalendarChange,
      onCalendarSelect: this.onCalendarSelect,
      selectedCalendarValue: this.state.selectedValue,
    };

    const { styles: selectStyles = {} } = selectProps;
    const controlStyles =
      this.props.appearance === 'subtle' ? this.getSubtleControlStyles() : {};
    const disabledStyle = isDisabled ? { pointerEvents: 'none' } : {};
    return (
      <div
        {...innerProps}
        role="presentation"
        onClick={this.onInputClick}
        onInput={this.onSelectInput}
        onKeyDown={this.onSelectKeyDown}
        ref={this.getContainerRef}
      >
        <input name={name} type="hidden" value={value} />
        <Select
          menuIsOpen={isOpen && !isDisabled}
          openMenuOnFocus
          closeMenuOnSelect
          autoFocus={autoFocus}
          instanceId={id}
          isDisabled={isDisabled}
          onBlur={this.onSelectBlur}
          onFocus={this.onSelectFocus}
          components={{
            ClearIndicator,
            DropdownIndicator,
            Menu: FixedLayeredMenu,
          }}
          styles={mergeStyles(selectStyles, {
            control: base => ({
              ...base,
              ...controlStyles,
              ...disabledStyle,
            }),
          })}
          placeholder={placeholder}
          value={
            value && {
              label: formatDisplayLabel(value, dateFormat),
              value,
            }
          }
          {...selectProps}
          {...calendarProps}
          spacing={spacing}
          validationState={validationState}
        />
      </div>
    );
  }
}

export { DatePicker as DatePickerWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'datePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'selectedDate',
      actionSubject: 'datePicker',

      attributes: {
        componentName: 'datePicker',
        packageName,
        packageVersion,
      },
    }),
  })(DatePicker),
);

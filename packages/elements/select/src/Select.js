// @flow
import React, { Component } from 'react';
import Select, { type SelectComponents } from 'react-select';
import { colors } from '@atlaskit/theme';

import * as animatedComponents from 'react-select/lib/animated';
import * as defaultComponents from './components';

// NOTE in the future, `Props` and `defaultProps` should come
// directly from react-select

type fn = () => void;
type ValidationState = 'default' | 'error' | 'success';

type Props = {
  /* Remove the currently focused option when the user presses backspace */
  backspaceRemovesValue: boolean,
  /* Close the select menu when the user selects an option */
  closeMenuOnSelect: boolean,
  /* Replace the component parts of the select */
  components: SelectComponents,
  /* Close the select menu when the user selects an option */
  deleteRemovesValue: boolean,
  disabledKey: string,
  /* Clear all values when the user presses escape AND the menu is closed */
  escapeClearsValue: boolean,
  /* Functions to manipulate how the options data is represented when rendered */
  formatters: {},
  /* Hide the selected option from the menu */
  hideSelectedOptions: boolean,
  /* Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string,
  /* Is the select value clearable */
  isClearable: boolean,
  /* Is the select disabled */
  isDisabled: boolean,
  /* Support multiple options */
  isMulti: boolean,
  /* Complimentary label for the select, visible only to screen-readers by default */
  label: string,
  /* Maximum height of the menu before scrolling */
  maxMenuHeight: number,
  /* Maximum height of the value container before scrolling */
  maxValueHeight: number,
  /* Handle change events on the select */
  onChange: fn,
  /* Handle key down events on the select */
  onKeyDown: fn,
  /* Array of options that populate the select menu */
  options: Array<{ [key: string]: any }>,
  /* Placeholder text for the select value */
  placeholder?: string,
  /* Select the currently focused option when the user presses tab */
  tabSelectsValue: boolean,
  /* The value of the select; reflected by the selected option */
  value: any,
  /* The state of validation if used in a form */
  validationState?: ValidationState,
};

const defaultProps = {
  backspaceRemovesValue: true,
  closeMenuOnSelect: true,
  deleteRemovesValue: true,
  disabledKey: 'disabled',
  escapeClearsValue: false,
  hideSelectedOptions: true,
  isClearable: true,
  isDisabled: false,
  isMulti: false,
  maxMenuHeight: 300,
  maxValueHeight: 100,
  options: [],
  placeholder: 'Select...',
  tabSelectsValue: false,
};

export default class AtlaskitSelect extends Component<Props> {
  components: SelectComponents;
  static defaultProps = defaultProps;
  constructor(props: Props) {
    super(props);
    this.cacheComponents(props.components);
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.components !== this.props.components) {
      this.cacheComponents(nextProps.components);
    }
  }
  cacheComponents = (components: SelectComponents) => {
    this.components = {
      ...defaultComponents,
      ...animatedComponents,
      ...components,
    };
  };
  render() {
    // $FlowFixMe: `validationState` is passed in from a parent validation component
    const { validationState, ...props } = this.props; // eslint-disable-line

    let controlBorderColor = colors.N40;
    if (validationState === 'error') controlBorderColor = colors.R400;
    if (validationState === 'success') controlBorderColor = colors.G400;

    let controlBorderColorHover = colors.N50;
    if (validationState === 'error') controlBorderColorHover = colors.R300;
    if (validationState === 'success') controlBorderColorHover = colors.G300;

    // props must be spread first to stop `components` being overridden
    return (
      <Select
        {...props}
        components={this.components}
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            backgroundColor: isFocused ? colors.N0 : colors.N10,
            borderColor: isFocused ? colors.B300 : controlBorderColor,
            borderStyle: 'solid',
            borderWidth: 2,
            boxShadow: 'none',

            ':hover': {
              borderColor: isFocused ? colors.B300 : controlBorderColorHover,
            },
          }),
          indicator: (styles, { isFocused }) => ({
            ...styles,
            color: isFocused ? colors.N200 : colors.N80,

            ':hover': {
              color: colors.N200,
            },
          }),
          option: (styles, { isFocused, isSelected }) => {
            const color = isSelected ? colors.N0 : null;

            let backgroundColor;
            if (isSelected) backgroundColor = colors.B200;
            else if (isFocused) backgroundColor = colors.N20;

            return { ...styles, backgroundColor, color };
          },
        }}
      />
    );
  }
}

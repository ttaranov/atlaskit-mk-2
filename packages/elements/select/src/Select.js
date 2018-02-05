// @flow
import React, { Component } from 'react';
import Select, { type SelectComponents } from 'react-select';
import { colors } from '@atlaskit/theme';

import * as animatedComponents from 'react-select/lib/animated';
import * as defaultComponents from './components';

// NOTE in the future, `Props` and `defaultProps` should come
// directly from react-select

type ValidationState = 'default' | 'error' | 'success';
type OptionType = { [string]: any };
type OptionsType = Array<OptionType>;
type ValueType = OptionType | OptionsType | null | void;

type ReactSelectProps = {
  /* HTML ID(s) of element(s) that should be used to describe this input (for assistive tech) */
  'aria-describedby'?: string,
  /* Aria label (for assistive tech) */
  'aria-label'?: string,
  /* HTML ID of an element that should be used as the label (for assistive tech) */
  'aria-labelledby'?: string,
  /* Focus the control when it is mounted */
  autoFocus?: boolean,
  /* Remove the currently focused option when the user presses backspace */
  backspaceRemovesValue?: boolean,
  /* When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent  */
  captureMenuScroll?: boolean,
  /* Close the select menu when the user selects an option */
  closeMenuOnSelect?: boolean,
  /* Custom components to use */
  components?: {},
  /* Delimiter used to join multiple values into a single HTML Input value */
  delimiter?: string,
  /* Clear all values when the user presses escape AND the menu is closed */
  escapeClearsValue?: boolean,
  /* Custom method to filter whether an option should be displayed in the menu */
  filterOption: (({}, string) => boolean) | null,
  /* Formats option labels in the menu and control as React components */
  formatOptionLabel?: (OptionType, {}) => Node,
  /* Resolves option data to a string to be displayed as the label by components */
  getOptionLabel: OptionType => string,
  /* Resolves option data to a string to compare options and specify value attributes */
  getOptionValue: OptionType => string,
  /* Hide the selected option from the menu */
  hideSelectedOptions?: boolean,
  /* Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string,
  /* Is the select value clearable */
  isClearable?: boolean,
  /* Is the select disabled */
  isDisabled?: boolean,
  /* Is the select in a state of loading (async) */
  isLoading?: boolean,
  /* Override the built-in logic to detect whether an option is disabled */
  isOptionDisabled: (OptionType => boolean) | false,
  /* Override the built-in logic to detect whether an option is selected */
  isOptionSelected?: (OptionType, OptionsType) => boolean,
  /* Support multiple selected options */
  isMulti?: boolean,
  /* Async: Text to display when loading options */
  loadingMessage?: ({ inputValue: string }) => string,
  /* Maximum height of the menu before scrolling */
  maxMenuHeight?: number,
  /* Maximum height of the value container before scrolling */
  maxValueHeight?: number,
  /* Name of the HTML Input (optional - without this, no input will be rendered) */
  name?: string,
  /* Text to display when there are no options */
  noOptionsMessage?: ({ inputValue: string }) => string,
  /* Handle blur events on the control */
  onBlur?: (SyntheticFocusEvent<HTMLElement>) => void,
  /* Handle change events on the select */
  onChange?: (ValueType, {}) => void,
  /* Handle focus events on the control */
  onFocus?: (SyntheticFocusEvent<HTMLElement>) => void,
  /* Handle change events on the input; return a string to modify the value */
  onInputChange?: string => string | void,
  /* Handle key down events on the select */
  onKeyDown?: (SyntheticKeyboardEvent<HTMLElement>) => void,
  /* Array of options that populate the select menu */
  options: OptionsType,
  /* Placeholder text for the select value */
  placeholder: string,
  /* Status to relay to screen readers */
  screenReaderStatus?: ({ count: number }) => string,
  /* Style modifier methods */
  styles?: {},
  /* Select the currently focused option when the user presses tab */
  tabSelectsValue?: boolean,
  /* The value of the select; reflected by the selected option */
  value?: ValueType,
};

type Props = ReactSelectProps & {
  /* The state of validation if used in a form */
  validationState?: ValidationState,
};

const defaultProps = {
  validationState: 'default',
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

    // props must be spread first to stop `components` being overridden
    return (
      <Select
        {...props}
        components={this.components}
        styles={{
          control: (styles, { isFocused }) => {
            let borderColor = isFocused ? colors.B300 : colors.N40;
            if (validationState === 'error') borderColor = colors.R400;
            if (validationState === 'success') borderColor = colors.G400;

            let borderColorHover = isFocused ? colors.B300 : colors.N50;
            if (validationState === 'error') borderColorHover = colors.R400;
            if (validationState === 'success') borderColorHover = colors.G400;

            return {
              ...styles,
              backgroundColor: isFocused ? colors.N0 : colors.N10,
              borderColor,
              borderStyle: 'solid',
              borderWidth: 2,
              boxShadow: 'none',

              ':hover': {
                borderColor: borderColorHover,
              },
            };
          },
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

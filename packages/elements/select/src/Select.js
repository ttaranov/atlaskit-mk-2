// @flow
import React, { Component } from 'react';
import Select, { type SelectComponents } from 'react-select';

import * as animatedComponents from 'react-select/lib/animated';
import * as defaultComponents from './components';

// NOTE in the future, `Props` and `defaultProps` should come
// directly from react-select

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
  formatters: Formatters,
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
  onChange: (ValueType, ActionMeta) => void,
  /* Handle key down events on the select */
  onKeyDown: (SyntheticKeyboardEvent<HTMLElement>) => void,
  /* Array of options that populate the select menu */
  options: OptionsType,
  /* Placeholder text for the select value */
  placeholder?: string,
  /* Select the currently focused option when the user presses tab */
  tabSelectsValue: boolean,
  /* The value of the select; reflected by the selected option */
  value: ValueType,
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
  tabSelectsValue: true,
};

export default class AtlaskitSelect extends Component<Props> {
  components: SelectComponents;
  static defaultProps = defaultProps;
  constructor(props) {
    super(props);
    this.cacheComponents(props.components);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.components !== this.props.components) {
      // TODO just watching that this isn't running too often,
      // remove warning when things settle down
      console.warn(
        '===== AkSelect is re-caching components on prop change! =====',
      );
      this.cacheComponents(nextProps.components);
    }
  }
  cacheComponents = components => {
    this.components = {
      ...defaultComponents,
      ...animatedComponents,
      ...components,
    };
  };
  render() {
    // props must be spread first to stop `components` being overridden
    return <Select {...this.props} components={this.components} />;
  }
}

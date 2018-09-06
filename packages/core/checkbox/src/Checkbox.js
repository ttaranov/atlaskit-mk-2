// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { ThemeProvider } from 'styled-components';
import CheckboxIcon from './CheckboxIcon';

import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { HiddenCheckbox, Label } from './styled/Checkbox';
import { type CheckboxProps } from './types';

type State = {|
  isActive: boolean,
  isChecked: boolean,
  isFocused: boolean,
  isHovered: boolean,
  mouseIsDown: boolean,
|};

const emptyTheme = {};

class Checkbox extends Component<CheckboxProps, State> {
  static defaultProps = {
    isDisabled: false,
    isInvalid: false,
    defaultChecked: false,
    isIndeterminate: false,
  };
  state: State = {
    isActive: false,
    isFocused: false,
    isHovered: false,
    mouseIsDown: false,
    isChecked:
      this.props.isChecked !== undefined
        ? this.props.isChecked
        : this.props.defaultChecked,
  };
  checkbox: ?HTMLInputElement;
  actionKeys = [' '];

  componentDidMount() {
    const { isIndeterminate } = this.props;
    // there is no HTML attribute for indeterminate, and thus no prop equivalent.
    // it must be set via the ref.
    if (this.checkbox) {
      this.checkbox.indeterminate = !!isIndeterminate;
      if (this.props.inputRef) {
        this.props.inputRef(this.checkbox);
      }
    }
  }

  componentDidUpdate(prevProps: CheckboxProps) {
    const { isIndeterminate } = this.props;

    if (prevProps.isIndeterminate !== isIndeterminate && this.checkbox) {
      this.checkbox.indeterminate = !!isIndeterminate;
    }
  }

  getProp = (key: string) => {
    return this.props[key] ? this.props[key] : this.state[key];
  };

  onChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    if (this.props.isDisabled) return null;
    event.persist();
    if (event.target.checked !== undefined) {
      this.setState({ isChecked: event.target.checked });
    }
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    return true;
  };

  // expose blur/focus to consumers via ref
  blur = () => {
    if (this.checkbox && this.checkbox.blur) this.checkbox.blur();
  };
  focus = () => {
    if (this.checkbox && this.checkbox.focus) this.checkbox.focus();
  };

  onBlur = () =>
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.mouseIsDown && this.state.isActive,
      isFocused: false,
    });
  onFocus = () => this.setState({ isFocused: true });
  onMouseLeave = () => this.setState({ isActive: false, isHovered: false });
  onMouseEnter = () => this.setState({ isHovered: true });
  onMouseUp = () => this.setState({ isActive: false, mouseIsDown: false });
  onMouseDown = () => this.setState({ isActive: true, mouseIsDown: true });

  onKeyDown = (event: KeyboardEvent) => {
    if (this.actionKeys.includes(event.key)) {
      this.setState({ isActive: true });
    }
  };
  onKeyUp = (event: KeyboardEvent) => {
    if (this.actionKeys.includes(event.key)) {
      this.setState({ isActive: false });
    }
  };

  render() {
    const {
      isDisabled,
      isFullWidth,
      isInvalid,
      name,
      value,
      isIndeterminate,
      label,
      ...props
    } = this.props;
    const isChecked = this.getProp('isChecked');
    const { isFocused, isActive, isHovered } = this.state;

    return (
      <ThemeProvider theme={emptyTheme}>
        <Label
          {...props}
          isDisabled={isDisabled}
          isFullWidth={isFullWidth}
          onMouseDown={this.onMouseDown}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onMouseUp={this.onMouseUp}
        >
          <span
            style={{
              flexShrink: 0,
              display: 'inline-block',
              position: 'relative',
            }}
          >
            <HiddenCheckbox
              disabled={isDisabled}
              checked={isChecked}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyUp={this.onKeyUp}
              onKeyDown={this.onKeyDown}
              type="checkbox"
              value={value}
              name={name}
              innerRef={r => (this.checkbox = r)} // eslint-disable-line
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CheckboxIcon
                isChecked={isChecked}
                isDisabled={isDisabled}
                isFocused={isFocused}
                isActive={isActive}
                isHovered={isHovered}
                isInvalid={isInvalid}
                isIndeterminate={isIndeterminate}
                primaryColor="inherit"
                secondaryColor="inherit"
                label=""
              />
            </div>
          </span>
          {label}
        </Label>
      </ThemeProvider>
    );
  }
}

export { Checkbox as CheckboxWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'checkbox',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'checkbox',

      attributes: {
        componentName: 'checkbox',
        packageName,
        packageVersion,
      },
    }),
  })(Checkbox),
);

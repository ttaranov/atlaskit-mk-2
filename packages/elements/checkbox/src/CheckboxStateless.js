// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import { colors, themed } from '@atlaskit/theme';
import { withTheme, ThemeProvider } from 'styled-components';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { HiddenCheckbox, IconWrapper, Label, Wrapper } from './styled/Checkbox';

const backgroundColor = themed({ light: colors.N40A, dark: colors.DN10 });
const transparent = themed({ light: 'transparent', dark: 'transparent' });

type Props = {|
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked: boolean,
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean,
  /** Sets whether the checkbox should take up the full width of the parent. */
  isFullWidth?: boolean,
  /** The label to be displayed to the right of the checkbox. The label is part
   of the clickable element to select the checkbox. */
  label: string,
  /** The name of the submitted field in a checkbox. */
  name: string,
  /** Marks the field as invalid. Changes style of unchecked component. */
  isInvalid?: boolean,
  /** Function that is called whenever the state of the checkbox changes. It will
  be called with an object containing the react synthetic event as well as the
  state the checkbox will naturally be set to. The stateless version does not
  automatically update whether the checkbox is checked. */
  onChange: (event: Event & { currentTarget: HTMLInputElement }) => mixed,
  /** The value to be used in the checkbox input. This is the value that will
   be returned on form submission. */
  value: number | string,
|};

type State = {|
  isActive: boolean,
  isFocused: boolean,
  isHovered: boolean,
  mouseIsDown: boolean,
|};

class CheckboxStateless extends Component<Props, State> {
  props: Props; // eslint-disable-line react/sort-comp
  state: State = {
    isActive: false,
    isFocused: false,
    isHovered: false,
    mouseIsDown: false,
  };
  checkbox: ?HTMLButtonElement;
  actionKeys = [' '];

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

  // The secondary color represents the tick
  getSecondaryColor = (): string => {
    const { isChecked, isDisabled, ...rest } = this.props;
    const { isActive } = this.state;

    let color = themed({ light: colors.N0, dark: colors.DN10 });

    if (isDisabled && isChecked) {
      color = themed({ light: colors.N70, dark: colors.DN90 });
    } else if (isActive && isChecked && !isDisabled) {
      color = themed({ light: colors.B400, dark: colors.DN10 });
    } else if (!isChecked) {
      color = transparent;
    }
    // $FlowFixMe TEMPORARY
    return color(rest);
  };
  // The secondary color represents the box color
  getPrimaryColor = (): string => {
    const { isChecked, isDisabled, ...rest } = this.props;
    const { isHovered, isActive } = this.state;
    let color = backgroundColor;
    if (isDisabled) {
      color = themed({ light: colors.N20A, dark: colors.DN10 });
    } else if (isActive) {
      color = themed({ light: colors.B75, dark: colors.B200 });
    } else if (isHovered && isChecked) {
      color = themed({ light: colors.B300, dark: colors.B75 });
    } else if (isHovered) {
      color = themed({ light: colors.N50A, dark: colors.DN30 });
    } else if (isChecked) {
      color = colors.blue;
    }
    // $FlowFixMe TEMPORARY
    return color(rest);
  };

  render() {
    const {
      isChecked,
      isDisabled,
      isFullWidth,
      isInvalid,
      label,
      name,
      onChange,
      value,
    } = this.props;
    const { isFocused, isActive, isHovered } = this.state;
    return (
      <Label
        isDisabled={isDisabled}
        isFullWidth={isFullWidth}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
      >
        <HiddenCheckbox
          disabled={isDisabled}
          checked={isChecked}
          onChange={onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          onKeyUp={this.onKeyUp}
          onKeyDown={this.onKeyDown}
          type="checkbox"
          value={value}
          name={name}
          innerRef={r => (this.checkbox = r)} // eslint-disable-line
        />
        <Wrapper>
          <IconWrapper
            isChecked={isChecked}
            isDisabled={isDisabled}
            isFocused={isFocused}
            isActive={isActive}
            isHovered={isHovered}
            isInvalid={isInvalid}
          >
            <CheckboxIcon
              primaryColor={this.getPrimaryColor()}
              secondaryColor={this.getSecondaryColor()}
              label="checkboxIcon"
            />
          </IconWrapper>
          <span>{label}</span>
        </Wrapper>
      </Label>
    );
  }
}
// TODO: Review if the error is an issue with Flow of 'Too many type arguments. Expected at most 2...'
// possible reported related issue https://github.com/apollographql/react-apollo/issues/1220
// $FlowFixMe
const CheckboxWithTheme = withAnalyticsContext({
  component: 'checkbox',
  package: packageName,
  version: packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAnalyticsEvent => {
      const consumerEvent = createAnalyticsEvent({
        action: 'change',
      });
      consumerEvent.clone().fire('atlaskit');

      return consumerEvent;
    },
  })(withTheme(CheckboxStateless)),
);

const emptyTheme = {};

export default function(props: any) {
  return (
    <ThemeProvider theme={emptyTheme}>
      <CheckboxWithTheme {...props} />
    </ThemeProvider>
  );
}

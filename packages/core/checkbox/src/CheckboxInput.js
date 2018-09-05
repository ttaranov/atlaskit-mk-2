// @flow

import React, { Component } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import CheckboxIcon from './CheckboxIcon';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import { HiddenCheckbox } from './styled/Checkbox';
import { type CheckboxInputProps } from './types';

type State = {|
  isActive: boolean,
  isFocused: boolean,
  isHovered: boolean,
  mouseIsDown: boolean,
|};

class CheckboxInput extends Component<CheckboxInputProps, State> {
  static defaultProps = {
    isIndeterminate: false,
  };
  state: State = {
    isActive: false,
    isFocused: false,
    isHovered: false,
    mouseIsDown: false,
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

  componentDidUpdate(prevProps: CheckboxInputProps) {
    const { isIndeterminate } = this.props;

    if (prevProps.isIndeterminate !== isIndeterminate && this.checkbox) {
      this.checkbox.indeterminate = !!isIndeterminate;
    }
  }

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
      isChecked,
      isDisabled,
      isInvalid,
      name,
      onChange,
      value,
      isIndeterminate,
    } = this.props;
    const { isFocused, isActive, isHovered } = this.state;

    return (
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
    );
  }
}

export { CheckboxInput as CheckboxInputWithoutAnalytics };
const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

export default withAnalyticsContext({
  componentName: 'checkboxInput',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEventOnAtlaskit({
      action: 'changed',
      actionSubject: 'checkboxInput',

      attributes: {
        componentName: 'checkboxInput',
        packageName,
        packageVersion,
      },
    }),
  })(CheckboxInput),
);

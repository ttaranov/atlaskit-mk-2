import uid from 'uid';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import CloseIcon from '@atlaskit/icon/glyph/cross';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import { colors, themed } from '@atlaskit/theme';
import { Handle, IconWrapper, Inner, Input, Label, Slide } from './styled';

export default class ToggleStateless extends PureComponent {
  static propTypes = {
    /** Whether the toggle is checked or not */
    isChecked: PropTypes.bool,
    /** Whether the toggle is disabled or not. This will prevent any interaction with the user */
    isDisabled: PropTypes.bool,
    /** Label to be set for accessibility */
    label: PropTypes.string,
    /** Descriptive name for value property to be submitted in a form */
    name: PropTypes.string,
    /** Handler to be called when toggle is unfocused */
    onBlur: PropTypes.func,
    /** Handler to be called when native 'change' event happens internally. */
    onChange: PropTypes.func,
    /** Handler to be called when toggle is focused. */
    onFocus: PropTypes.func,
    /** Defines the size of the toggle. */
    size: PropTypes.oneOf(['regular', 'large']),
    /** The value to be submitted in a form. */
    value: PropTypes.string,
  }

  static defaultProps = {
    isChecked: false,
    isDisabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    size: 'regular',
  };

  state = {
    isFocused: false,
  }

  onMouseUp = () => this.setState({ isActive: false, mouseIsDown: false })
  onMouseDown = () => this.setState({ isActive: true, mouseIsDown: true })

  onKeyDown = (event: KeyboardEvent) => {
    if (this.actionKeys.includes(event.key)) {
      this.setState({ isActive: true });
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    if (this.actionKeys.includes(event.key)) {
      this.setState({ isActive: false });
    }
  }

  handleMouseDown = () => {
    this.setState({ isActive: true, mouseIsDown: true });
  }
  handleBlur = (e) => {
    this.setState({
      // onBlur is called after onMouseDown if the checkbox was focused, however
      // in this case on blur is called immediately after, and we need to check
      // whether the mouse is down.
      isActive: this.state.mouseIsDown && this.state.isActive,
      isFocused: false,
    });
    this.props.onBlur(e);
  }
  handleChange = (e) => {
    this.props.onChange(e);
  }
  handleFocus = (e) => {
    this.setState({ isFocused: true });
    this.props.onFocus(e);
  }

  render() {
    const { isChecked, isDisabled, label, name, size, value, ...rest } = this.props;
    const { isFocused, isActive } = this.state;
    const styledProps = { isChecked, isDisabled, isFocused: isFocused || isActive, size };
    const Icon = isChecked ? ConfirmIcon : CloseIcon;
    const id = uid();
    const primaryColor = isChecked ? themed({ light: 'inherit', dark: colors.DN30 })(rest) : 'inherit';

    return (
      <Label
        size={size}
        isDisabled={isDisabled}
        htmlFor={id}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
      >
        <Input
          checked={isChecked}
          disabled={isDisabled}
          id={id}
          name={name}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          innerRef={el => (this.input = el)}
          type="checkbox"
          value={value}
        />
        <Slide {...styledProps}>
          <Inner {...styledProps}>
            <Handle
              isChecked={isChecked}
              isDisabled={isDisabled}
              size={size}
            />
            <IconWrapper isChecked={isChecked} size={size}>
              <Icon
                primaryColor={primaryColor}
                label={label || (isChecked ? 'Uncheck' : 'Check')} size={size === 'large' ? 'medium' : 'small'}
              />
            </IconWrapper>
          </Inner>
        </Slide>
      </Label>
    );
  }
}

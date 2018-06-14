// @flow
import { type ButtonType } from './Button';

const getAppearanceProps = (props, state) => {
  const {
    appearance,
    className,
    isDisabled,
    isLoading,
    isSelected,
    spacing,
    shouldFitContainer,
  } = props;

  const { isActive, isFocus, isHover } = state;

  return {
    appearance,
    className,
    disabled: isDisabled,
    isActive,
    isFocus,
    isHover,
    isLoading,
    isSelected,
    spacing,
    fit: shouldFitContainer,
  };
};

const getInteractionProps = component => {
  const {
    onBlur,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  } = component;

  const { tabIndex } = component.props;

  // Block onClick/Keyboard submit while isLoading
  const onClick = component.props.isLoading
    ? (e: SyntheticEvent<>) => {
        e.preventDefault();
      }
    : component.props.onClick;

  return {
    onBlur,
    onClick,
    onFocus,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
    tabIndex,
  };
};

const getLinkElementProps = props => {
  const { href, target } = props;

  return { href, target };
};

const getButtonElementProps = props => {
  const { ariaHaspopup, ariaExpanded, ariaControls, form, type } = props;

  return {
    'aria-haspopup': ariaHaspopup,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    form,
    type,
  };
};

const getButtonProps = (component: ButtonType) => {
  const { props, state } = component;

  const defaultProps = {
    id: props.id,
    ...getAppearanceProps(props, state),
    ...getInteractionProps(component),
    'aria-label': props.ariaLabel,
  };

  if (props.component) {
    return {
      ...props,
      ...defaultProps,
    };
  }

  if (props.href) {
    if (props.isDisabled) {
      return defaultProps;
    }

    return {
      ...defaultProps,
      ...getLinkElementProps(props),
    };
  }

  return {
    ...defaultProps,
    ...getButtonElementProps(props),
  };
};

export default getButtonProps;

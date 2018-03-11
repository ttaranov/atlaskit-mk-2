// @flow
import React from 'react';

/**
 * Styling a button is complicated and there are a number of properties which inform its appearance.
 * We want to be able to style any arbitrary component like a button, but we don't want to pass all
 * of these appearance-related props through to the component or underlying DOM node. This component
 * acts as a layer which catches the appearance-related properties so that they can be used by
 * styled-components, then passes the rest of the props on to the custom component.
 */
/* eslint-disable react/prop-types, no-unused-vars */
import type { DerivedButtonProps } from '../types';

const CustomComponentProxy = (props: DerivedButtonProps) => {
  const {
    appearance,
    children,
    component,
    isActive,
    isDisabled,
    isFocus,
    isHover,
    isSelected,
    shouldFitContainer,
    fit,
    ...proxiedProps
  } = props;
  if (!component)
    throw new Error(
      'No custom component provided while trying to use custom button component',
    );
  const ProxiedComponent = component;
  // $FlowFixMe
  return <ProxiedComponent {...proxiedProps}>{children}</ProxiedComponent>;
};
/* eslint-enable */

export default CustomComponentProxy;

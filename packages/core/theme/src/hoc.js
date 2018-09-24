// @flow

import React, { type ComponentType } from 'react';
import Theme from './components/Theme';

// Pre-executes the theme and passes it as a prop to the supplied component.
// This is useful for ensuring that the current theme is accessible as props
// in styled-components.
export function withTheme<Props = {}>(El: ComponentType<Props>) {
  return function createComponent(props: Props) {
    return <Theme>{t => <El {...props} theme={t} />}</Theme>;
  };
}

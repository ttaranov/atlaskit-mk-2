// @flow

import React, { type ComponentType } from 'react';
import UIStateSubscriber from './UIStateSubscriber';

export default (WrappedComponent: ComponentType<*>) => (props: *) => (
  <UIStateSubscriber>
    {navigationUI => (
      <WrappedComponent navigationUI={navigationUI} {...props} />
    )}
  </UIStateSubscriber>
);

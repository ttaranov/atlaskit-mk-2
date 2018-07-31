// @flow

import React, { type ComponentType } from 'react';
import UIControllerSubscriber from './UIControllerSubscriber';

export default (WrappedComponent: ComponentType<*>) => (props: *) => (
  <UIControllerSubscriber>
    {navigationUIController => (
      <WrappedComponent
        navigationUIController={navigationUIController}
        {...props}
      />
    )}
  </UIControllerSubscriber>
);

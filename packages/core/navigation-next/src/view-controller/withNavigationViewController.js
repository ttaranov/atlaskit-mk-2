// @flow

import React, { type ComponentType } from 'react';
import ViewControllerSubscriber from './ViewControllerSubscriber';

export default (WrappedComponent: ComponentType<*>) => (props: *) => (
  <ViewControllerSubscriber>
    {navigationViewController => (
      <WrappedComponent
        navigationViewController={navigationViewController}
        {...props}
      />
    )}
  </ViewControllerSubscriber>
);

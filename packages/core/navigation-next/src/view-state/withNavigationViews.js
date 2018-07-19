// @flow

import React, { type ComponentType } from 'react';
import ViewStateSubscriber from './ViewStateSubscriber';

export default (WrappedComponent: ComponentType<*>) => (props: *) => (
  <ViewStateSubscriber>
    {navigationViews => (
      <WrappedComponent navigationViews={navigationViews} {...props} />
    )}
  </ViewStateSubscriber>
);

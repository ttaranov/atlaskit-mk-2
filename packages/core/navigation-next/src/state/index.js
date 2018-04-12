// @flow

import React, { type Node } from 'react';
import { Subscribe } from 'unstated';
import NavigationState, { type NavigationType } from './NavigationState';

export { default as NavigationProvider } from './NavigationProvider';

type SubscriberProps = { children: NavigationType => Node };
export const NavigationSubscriber = ({ children }: SubscriberProps) => (
  <Subscribe to={[NavigationState]}>{children}</Subscribe>
);

// export const withNavigationState = (WrappedComponent: any) => (props: any) => (
//   <Subscribe to={[NavigationState]}>
//     {navigation => <WrappedComponent {...props} navigation={navigation} />}
//   </Subscribe>
// );

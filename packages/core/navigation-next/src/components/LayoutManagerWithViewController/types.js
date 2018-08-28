// @flow

import type { ComponentType, Node } from 'react';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

import { UIController, ViewController } from '../../';

import type { ViewControllerState } from '../../view-controller/types';

export type LayoutManagerWithViewControllerProps = {
  children: Node,
  customComponents: { [string]: ComponentType<*> },
  globalNavigation: ComponentType<{}>,
  navigationUIController: UIController,
  navigationViewController: ViewController,
  disableAnimation?: boolean, // TODO: revisit this name
  firstSkeleton?: 'product' | 'container',
};

export type LayoutManagerWithViewControllerState = {
  hasInitialised: boolean,
  enableAnimationOnFirstLoad: boolean,
};

export type LayerInitialisedProps = WithAnalyticsEventsProps & {
  activeView: $PropertyType<ViewControllerState, 'activeView'>,
  initialised: boolean,
  onInitialised?: () => void,
};

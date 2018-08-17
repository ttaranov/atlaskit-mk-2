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
};

export type LayoutManagerWithViewControllerState = {
  hasInitialised: boolean,
};

export type LayerInitialisedProps = WithAnalyticsEventsProps & {
  children: Node,
  activeView: $PropertyType<ViewControllerState, 'activeView'>,
  initialised: boolean,
  onInitialised?: () => void,
};

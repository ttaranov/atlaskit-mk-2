// @flow

import type { ComponentType, Node } from 'react';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

import { UIController, ViewController } from '../../';

import type { CollapseListeners } from '../LayoutManager/types';

import type { ViewControllerState } from '../../view-controller/types';

export type LayoutManagerWithViewControllerProps = {
  children: Node,
  customComponents: { [string]: ComponentType<*> },
  globalNavigation: ComponentType<{}>,
  navigationUIController: UIController,
  navigationViewController: ViewController,
  firstSkeletonToRender?: 'product' | 'container',
  ...CollapseListeners,
};

export type LayoutManagerWithViewControllerState = {
  hasInitialised: boolean,
};

export type LayerInitialisedProps = WithAnalyticsEventsProps & {
  activeView: $PropertyType<ViewControllerState, 'activeView'>,
  initialised: boolean,
  onInitialised?: () => void,
};

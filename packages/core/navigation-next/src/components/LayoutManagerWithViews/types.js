// @flow

import type { ComponentType, Node } from 'react';

import { UIController, ViewController } from '../../';

export type LayoutManagerWithViewsProps = {
  children: Node,
  customComponents: { [string]: ComponentType<*> },
  globalNavigation: ComponentType<{}>,
  navigationUIController: UIController,
  navigationViewController: ViewController,
};

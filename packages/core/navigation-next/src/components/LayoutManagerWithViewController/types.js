// @flow

import type { ComponentType, Node } from 'react';

import { UIController, ViewController } from '../../';

export type LayoutManagerWithViewControllerProps = {
  children: Node,
  customComponents: { [string]: ComponentType<*> },
  globalNavigation: ComponentType<{}>,
  navigationUIController: UIController,
  navigationViewController: ViewController,
};

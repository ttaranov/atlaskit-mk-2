import { GasPayload } from '@atlaskit/analytics-gas-types';
import { context, PackageContext } from './index';
import { NavigationDirection, NavigationSource } from '../navigation';
import { Identifier } from '../domain';

function actionFromDirection(direction: NavigationDirection): string {
  switch (direction) {
    case 'next':
      return 'next';
    case 'prev':
      return 'previous';
  }
}

function inputFromSource(source: NavigationSource): string {
  switch (source) {
    case 'mouse':
      return 'button';
    case 'keyboard':
      return 'keys';
  }
}

function fileDetailsFromIdentifier(identifier: Identifier) {
  return {
    fileId: identifier.id,
  };
}

export interface NavigationAttributes {
  fileId: string;
  input: string;
}

export interface NavigationGasPayload extends GasPayload {
  attributes: NavigationAttributes & PackageContext;
}

export function createNavigationEvent(
  direction: NavigationDirection,
  source: NavigationSource,
  newItem: Identifier,
): NavigationGasPayload {
  return {
    eventType: 'ui',
    action: 'navigated',
    actionSubject: 'file',
    actionSubjectId: actionFromDirection(direction),
    attributes: {
      ...context,
      ...fileDetailsFromIdentifier(newItem),
      input: inputFromSource(source),
    },
  };
}

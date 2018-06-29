// @flow
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';

export const hoveredPayload = {
  action: 'hovered',
  actionSubject: 'tooltip',

  attributes: {
    componentName: 'tooltip',
    packageName,
    packageVersion,
  },
};

export const unhoveredPayload = {
  action: 'unhovered',
  actionSubject: 'tooltip',

  attributes: {
    componentName: 'tooltip',
    packageName,
    packageVersion,
  },
};

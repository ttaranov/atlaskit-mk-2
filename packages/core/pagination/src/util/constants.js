//@flow

import {
  name as packageName,
  version as packageVersion,
} from '../../package.json';

export const PAGINATION_ANALYTICS_EVENT_CONTEXT = {
  componentName: 'pagination',
  packageName,
  packageVersion,
};

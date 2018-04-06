import { BaseAnalyticsContext } from '../index';
import { version, name } from '../../package.json';

export const getBaseAnalyticsContext = (
  componentName,
  actionSubjectId,
): BaseAnalyticsContext => ({
  packageVersion: version,
  packageName: name,
  componentName,
  actionSubject: 'MediaCard',
  actionSubjectId,
});

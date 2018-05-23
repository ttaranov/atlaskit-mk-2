/**
 * Copied from analytics-web-react
 */
import * as merge from 'lodash.merge';

const extractFromEventContext = (propertyName: string, event) =>
  event.context
    .map((contextItem: any) => contextItem[propertyName])
    .filter(Boolean);

export const getActionSubject = event => {
  const overrides = extractFromEventContext('actionSubjectOverride', event);

  return overrides.length > 0 ? overrides[0] : event.payload.actionSubject;
};

export const getSources = event => extractFromEventContext('source', event);

export const getExtraAttributes = event =>
  extractFromEventContext('attributes', event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = event =>
  event.context
    .map(contextItem => ({
      packageName: contextItem.packageName,
      packageVersion: contextItem.packageVersion,
    }))
    .filter(p => p.packageName != null || p.packageVersion != null);

export const getPackageVersion = event =>
  extractFromEventContext('packageVersion', event);

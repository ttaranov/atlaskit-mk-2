/**
 * Largely taken from analytics-web-react
 */
import * as merge from 'lodash.merge';

const extractFromEventContext = (propertyNames: string[], event) =>
  event.context
    .reduce((acc: any[], contextItem: any) => {
      propertyNames.forEach(propertyName => {
        acc.push(contextItem[propertyName]);
      });
      return acc;
    }, [])
    .filter(Boolean);

export const getActionSubject = event => {
  return event.payload.actionSubject;
};

export const getSources = event => extractFromEventContext(['source'], event);

export const getComponents = event =>
  extractFromEventContext(['component', 'componentName'], event);

export const getExtraAttributes = event =>
  extractFromEventContext(['attributes'], event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = event =>
  event.context
    .map(contextItem => ({
      packageName: contextItem.packageName,
      packageVersion: contextItem.packageVersion,
    }))
    .filter(p => p.packageName);

export const getPackageVersion = event =>
  extractFromEventContext(['packageVersion'], event);

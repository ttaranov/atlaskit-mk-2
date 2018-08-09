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
  const closestContext =
    event.context.length > 0 ? event.context[event.context.length - 1] : {};

  return (
    event.payload.actionSubject ||
    event.payload.component ||
    closestContext.component
  );
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

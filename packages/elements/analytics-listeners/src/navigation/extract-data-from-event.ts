/**
 * Largely taken from analytics-web-react
 */
import * as merge from 'lodash.merge';
import { NAVIGATION_CONTEXT } from '@atlaskit/analytics-namespaced-context';

const extractFromEventContext = (
  propertyNames: string[],
  event,
  namespacedContextOnly = true,
) =>
  event.context
    .reduce((acc: any[], contextItem: any) => {
      propertyNames.forEach(propertyName => {
        const navContext = contextItem[NAVIGATION_CONTEXT];
        const navContextProp = navContext ? navContext[propertyName] : null;
        acc.push(
          namespacedContextOnly
            ? navContextProp
            : navContextProp || contextItem[propertyName],
        );
      });
      return acc;
    }, [])
    .filter(Boolean);

export const getSources = event =>
  extractFromEventContext(['source'], event, false);

export const getComponents = event =>
  extractFromEventContext(['component', 'componentName'], event, false);

export const getExtraAttributes = event =>
  extractFromEventContext(['attributes'], event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = event =>
  event.context
    .map(contextItem => {
      const navContext = contextItem[NAVIGATION_CONTEXT];
      const item = navContext ? navContext : contextItem;
      return {
        packageName: item.packageName,
        packageVersion: item.packageVersion,
      };
    })
    .filter(p => p.packageName);

export const getPackageVersion = event =>
  extractFromEventContext(['packageVersion'], event);

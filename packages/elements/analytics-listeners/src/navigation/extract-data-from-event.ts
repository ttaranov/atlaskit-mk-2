/**
 * Largely taken from analytics-web-react
 */
import * as merge from 'lodash.merge';
import { NAVIGATION_CONTEXT } from '@atlaskit/analytics-namespaced-context';
import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next-types';

const extractFromEventContext = (
  propertyNames: string[],
  event: UIAnalyticsEventInterface,
  namespacedContextOnly = true,
): any[] =>
  event.context
    .reduce((acc, contextItem) => {
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

export const getSources = (event: UIAnalyticsEventInterface) =>
  extractFromEventContext(['source'], event, false);

export const getComponents = (event: UIAnalyticsEventInterface) =>
  extractFromEventContext(['component', 'componentName'], event, false);

export const getExtraAttributes = (event: UIAnalyticsEventInterface) =>
  extractFromEventContext(['attributes'], event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = (event: UIAnalyticsEventInterface) =>
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

export const getPackageVersion = (event: UIAnalyticsEventInterface) =>
  extractFromEventContext(['packageVersion'], event);

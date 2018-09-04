import { DarkFeature, FeatureFlag, ParsedFlag } from './types';

export const isType = (value: any, type: string): boolean =>
  value !== null && typeof value === type;
export const isObject = (value): boolean => isType(value, 'object');
export const isBoolean = (value): boolean => isType(value, 'boolean');
export const isFeatureFlag = (flag: DarkFeature | FeatureFlag): boolean =>
  isObject(flag) &&
  'value' in (flag as FeatureFlag) &&
  'reason' in (flag as FeatureFlag);
export const isDarkFeature = (flag: DarkFeature | FeatureFlag): boolean =>
  isBoolean(flag);
export const isOneOf = (value: string, list: string[]): boolean =>
  list.indexOf(value) > -1;

export const enforceAttributes = (obj, attributes, identifier?) => {
  const title = identifier ? `${identifier}: ` : '';
  attributes.forEach(attribute => {
    if (!obj.hasOwnProperty(attribute)) {
      throw `${title}Missing ${attribute}`;
    }
  });
};

export const parseFlag = (flag): ParsedFlag | null => {
  if (isFeatureFlag(flag)) {
    return {
      type: 'feature-flag',
      value: flag.value,
      flag,
    };
  }

  if (isDarkFeature(flag)) {
    return {
      type: 'dark-feature',
      value: flag,
      flag,
    };
  }

  return null;
};

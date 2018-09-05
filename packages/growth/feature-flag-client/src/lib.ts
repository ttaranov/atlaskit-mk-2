import { FeatureFlag, AnyFlag } from './types';

export const isType = (value: any, type: string): boolean => {
  return value !== null && typeof value === type;
};

export const isObject = value => isType(value, 'object');
export const isBoolean = value => isType(value, 'boolean');

export const isFeatureFlag = (flag: AnyFlag): boolean => {
  return (
    isObject(flag) &&
    'value' in (flag as FeatureFlag) &&
    'explanation' in (flag as FeatureFlag)
  );
};

export const isDarkFeature = (flag: AnyFlag): boolean => isBoolean(flag);

export const isOneOf = (value: string, list: string[]): boolean =>
  list.indexOf(value) > -1;

export const enforceAttributes = (obj, attributes, identifier?) => {
  const title = identifier ? `${identifier}: ` : '';
  attributes.forEach(attribute => {
    if (!obj.hasOwnProperty(attribute) && obj[attribute] !== null) {
      throw new Error(`${title}Missing ${attribute}`);
    }
  });
};

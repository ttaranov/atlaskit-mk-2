import { FlagShape } from './types';

export const isType = (value: any, type: string): boolean => {
  return value !== null && typeof value === type;
};

export const isObject = value => isType(value, 'object');
export const isBoolean = value => isType(value, 'boolean');
export const isString = value => isType(value, 'string');

export const isFlagWithEvaluationDetails = (flag: FlagShape): boolean => {
  return isObject(flag) && 'value' in flag && 'explanation' in flag;
};

export const isSimpleFlag = (flag: FlagShape): boolean => {
  return isObject(flag) && 'value' in flag && !('explanation' in flag);
};

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

const validateFlag = (flagKey, flag) => {
  if (isSimpleFlag(flag) || isFlagWithEvaluationDetails(flag)) {
    return true;
  }

  // @ts-ignore
  if (process.env !== 'production') {
    throw new Error(
      `${flagKey} is not a valid flag. Missing "value" attribute.`,
    );
  }
};

export const validateFlags = flags => {
  Object.keys(flags).forEach(key => validateFlag(key, flags[key]));
};

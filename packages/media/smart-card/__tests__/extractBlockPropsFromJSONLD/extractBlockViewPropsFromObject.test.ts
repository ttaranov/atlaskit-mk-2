import { object } from './_fixtures';
import { createTestsForObject } from './_createTestsForObject';
import { extractPropsFromObject } from '../../src/extractBlockPropsFromJSONLD/extractPropsFromObject';

describe('extractPropsFromObject()', () => {
  createTestsForObject('object', object, extractPropsFromObject);
});

import { object } from './_fixtures';
import { createTestsForObject } from './_createTestsForObject';
import { extractBlockViewPropsFromObject } from '../../../src/extract/block/extractBlockViewPropsFromObject';

describe('extractBlockViewPropsFromObject()', () => {
  createTestsForObject('object', object, extractBlockViewPropsFromObject);
});

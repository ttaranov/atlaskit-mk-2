/**
 * This package is not in the bundle, but is intended for use
 * by consuming components for testing/storybooks for test and
 * sample data.
 *
 * It can be imported as follows:
 *
 * ```import { ... } from '@atlaskit/task-decision/src/support';```
 *
 * or
 *
 * ```import { ... } from '@atlaskit/task-decision/dist/es5/support';```
 *
 * or
 *
 * ```import { ... } from '@atlaskit/task-decision/dist/es2015/support';```
 */

export * from './support-types';

import * as _testData from './test-data';
import * as _storyData from './story-data';

export const testData = _testData;
export const storyData = _storyData;

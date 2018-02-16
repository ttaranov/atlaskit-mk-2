/**
 * This package is not in the bundle, but is intended for use
 * by consuming components for testing/storybooks for test and
 * sample data.
 *
 * It can be imported as follows:
 *
 * ```import { ... } from '@atlaskit/mention/src/support';```
 *
 * or
 *
 * ```import { ... } from '@atlaskit/mention/dist/es5/support';```
 *
 * or
 *
 * ```import { ... } from '@atlaskit/mention/dist/es2015/support';```
 */

export * from './support-types';

import * as _mockMentionResource from './MockMentionResource';
import * as _mockMentionResourceWithInfoHints from './MockMentionResourceWithInfoHints';
import * as _mockPresenceResource from './MockPresenceResource';
import * as mentionData from './mention-data';
import * as presenceData from './presence-data';
import * as _storyData from './story-data';

export const mockMentionResource = _mockMentionResource;
export const mockMentionResourceWithInfoHints = _mockMentionResourceWithInfoHints;
export const mockPresenceResource = _mockPresenceResource;
export const testData = {
  mentionData,
  presenceData,
};
export const storyData = _storyData;

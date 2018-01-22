/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import Avatar from '../Avatar';
import { assertCorrectColors, assertCorrectOpacity } from './_util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Avatar);
});

test('correctly sets opacity from prop', () => {
  assertCorrectOpacity(Avatar);
});

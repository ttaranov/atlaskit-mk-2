/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import Icon from '../Icon';
import { assertCorrectColors, assertCorrectOpacity } from './_util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Icon);
});

test('correctly sets opacity from prop', () => {
  assertCorrectOpacity(Icon);
});

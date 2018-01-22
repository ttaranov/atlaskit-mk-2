/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import Paragraph from '../Paragraph';

import { assertCorrectColors, assertCorrectOpacity } from './_util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Paragraph);
});

test('correctly sets opacity from prop', () => {
  assertCorrectOpacity(Paragraph);
});

/**
 * TODO remove when using styled-components > v1.
 *
 * @jest-environment node
 */
// @flow

import Icon from '../Icon';
import { assertCorrectColors } from './util';

test('correctly sets color from prop', () => {
  assertCorrectColors(Icon);
});

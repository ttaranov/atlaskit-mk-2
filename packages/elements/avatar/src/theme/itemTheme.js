// @flow
import { itemThemeNamespace } from '@atlaskit/item';
import { gridSize, math } from '@atlaskit/theme';

const dropdownPadding = {
  bottom: 1,
  left: math.multiply(gridSize, 1.5),
  right: math.multiply(gridSize, 1.5),
  top: 1,
};

// Override specific parts of droplist's item theme
const avatarItemTheme: Object = {
  padding: {
    default: dropdownPadding,
    compact: dropdownPadding,
  },
};

export default {
  [itemThemeNamespace]: avatarItemTheme,
};

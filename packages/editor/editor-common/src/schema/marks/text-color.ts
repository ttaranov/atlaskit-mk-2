import { Mark, MarkSpec } from 'prosemirror-model';
import {
  akColorG300,
  akColorN80,
  akColorP300,
  akColorR300,
  akColorT300,
  akColorY400,
  akColorY500,
  akColorT500,
  akColorG500,
  akColorP500,
  akColorN90,
  akColorR500,
} from '@atlaskit/util-shared-styles';
import { COLOR } from '../groups';
import { rgbToHex } from '../../utils';

export interface TextColorAttributes {
  /**
   * @pattern "^#[0-9a-f]{6}$"
   */
  color: string;
}

/**
 * @name textColor_mark
 */
export interface TextColorDefinition {
  type: 'textColor';
  attrs: TextColorAttributes;
}

export interface TextColorMark extends Mark {
  attrs: TextColorAttributes;
}

/** New borders for colors in the color picker */
export const borderColorPalette = {
  orange: akColorY500,
  teal: akColorT500,
  red: akColorR500,
  'light-grey': akColorN90,
  purple: akColorP500,
  green: akColorG500,
};

// @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/55979455/Colour+picker+decisions#Colourpickerdecisions-Visualdesigndecisions
export const colorPalette = new Map<string, string>();
[
  // [akColorN800, default],
  [akColorN80, 'Light-grey'],
  [akColorP300, 'Purple'],
  [akColorT300, 'Teal'],
  [akColorG300, 'Green'],
  [akColorR300, 'Red'],
  [akColorY400, 'Orange'],
].forEach(([color, label]) => colorPalette.set(color.toLowerCase(), label));

export const textColor: MarkSpec = {
  attrs: { color: {} },
  inclusive: true,
  group: COLOR,
  parseDOM: [
    {
      style: 'color',
      getAttrs: (value: string) => {
        let hexColor;
        if (value.match(/^rgb/i)) {
          hexColor = rgbToHex(value);
        } else if (value[0] === '#') {
          hexColor = value.toLowerCase();
        }
        // else handle other colour formats
        return colorPalette.has(hexColor) ? { color: hexColor } : false;
      },
    },
  ],
  toDOM(mark: TextColorMark): [string, { style: string }] {
    return [
      'span',
      {
        style: `color: ${mark.attrs.color}`,
      },
    ];
  },
};

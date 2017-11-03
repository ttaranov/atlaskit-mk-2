import { Mark, MarkSpec } from 'prosemirror-model';
import {
  akColorG300, akColorN80, akColorP300, akColorR300, akColorT300, akColorY400,
} from '@atlaskit/util-shared-styles';
import { COLOR } from '../groups';
import { rgbToHex } from '../../utils';

export interface Attributes {
  /**
   * @pattern "^#[0-9a-f]{6}$"
   */
  color: string;
}

/**
 * @name textColor_mark
 */
export interface Definition {
  type: 'textColor';
  attrs: Attributes;
}

export interface TextColorMark extends Mark {
  attrs: Attributes;
}

// @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/55979455/Colour+picker+decisions#Colourpickerdecisions-Visualdesigndecisions
export const colorPalette = new Map<string, string>();
[
  // [akColorN800, default],
  [akColorN80, 'Light grey'],
  [akColorP300, 'Purple'],
  [akColorT300, 'Teal'],
  [akColorG300, 'Green'],
  [akColorR300, 'Red'],
  [akColorY400, 'Orange'],
].forEach(([color, label]) => colorPalette.set(color.toLowerCase(), label));

export const textColor: MarkSpec = {
  attrs: { color: { } },
  inclusive: true,
  group: COLOR,
  parseDOM: [
    {
      style: 'color',
      getAttrs: (value: string) => {
        let hexColor;
        if (value.match(/^rgb/i)) {
          hexColor = rgbToHex(value);
        }
        else if (value[0] === '#') {
          hexColor = value.toLowerCase();
        }
        // else handle other colour formats
        return colorPalette.has(hexColor) ? { color: hexColor } : false;
      }
    }
  ],
  toDOM(mark: TextColorMark): [string, { style: string }] {
    return ['span', {
      style: `color: ${mark.attrs.color}`
    }];
  }
};

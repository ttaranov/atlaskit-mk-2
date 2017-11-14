import { MarkSpec } from 'prosemirror-model';
import { marks } from 'prosemirror-schema-basic';
import { FONT_STYLE } from '../groups';

/**
 * @name strong_mark
 */
export interface Definition {
  type: 'strong';
}

export const strong: MarkSpec = {
  ...marks.strong,
  inclusive: true,
  group: FONT_STYLE,
};

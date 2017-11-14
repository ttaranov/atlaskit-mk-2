import { MarkSpec } from 'prosemirror-model';
import { marks } from 'prosemirror-schema-basic';
import { FONT_STYLE } from '../groups';

/**
 * @name em_mark
 */
export interface Definition {
  type: 'em';
}

export const em: MarkSpec = {...marks.em,
  inclusive: true,
  group: FONT_STYLE,
};

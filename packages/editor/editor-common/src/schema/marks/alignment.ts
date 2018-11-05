import { Mark, MarkSpec } from 'prosemirror-model';

export interface AlignmentAttributes {
  /**
   * @pattern "^#[0-9a-f]{6}$"
   */
  align: 'left' | 'center' | 'right';
}

export interface AlignmentMark extends Mark {
  attrs: AlignmentAttributes;
}

export interface AlignmentMarkDefinition {
  type: 'alignment';
  attrs: AlignmentAttributes;
}

export const alignment: MarkSpec = {
  attrs: {
    align: {
      default: 'left',
    },
  },
  parseDOM: [
    {
      getAttrs: (dom: Element) => {
        return {
          align: (dom as HTMLElement).getAttribute('align'),
        };
      },
    },
  ],
  toDOM(mark: AlignmentMark) {
    return [
      'div',
      { class: `align-${mark.attrs.align}`, 'data-align': mark.attrs.align },
      0,
    ];
  },
};

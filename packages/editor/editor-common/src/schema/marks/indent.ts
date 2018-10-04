import { MarkSpec } from 'prosemirror-model';

export const indent: MarkSpec = {
  inclusive: true,
  attrs: {
    level: {
      default: 1,
    },
  },
  parseDOM: [
    {
      tag: 'div.editor--mark__indent',
      getAttrs(dom) {
        return {
          level: (dom as HTMLElement).getAttribute('data-level'),
        };
      },
    },
  ],
  toDOM(mark) {
    return [
      'div',
      { class: 'editor--mark__indent', 'data-level': mark.attrs.level || 1 },
    ];
  },
};

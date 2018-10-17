import { MarkSpec } from 'prosemirror-model';

export const breakout: MarkSpec = {
  parseDOM: [
    {
      tag: 'div.fabric-editor-breakout',
      getAttrs(dom) {
        return {
          mode: (dom as HTMLElement).getAttribute('mode'),
        };
      },
    },
  ],
  attrs: {
    mode: { default: 'wide' },
  },
  toDOM(mark) {
    return [
      'div',
      { class: 'fabric-editor-breakout', mode: mark.attrs.mode },
      0,
    ];
  },
};

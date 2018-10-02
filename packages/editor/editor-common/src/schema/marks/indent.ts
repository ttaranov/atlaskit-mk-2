import { MarkSpec, DOMOutputSpec } from 'prosemirror-model';

const indentDOM: DOMOutputSpec = ['div', { class: 'editor--mark__indent' }];
export const indent: MarkSpec = {
  inclusive: true,
  parseDOM: [{ tag: 'div', attrs: { class: 'editor--mark__indent' } }],
  toDOM() {
    return indentDOM;
  },
};

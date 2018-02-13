import { MarkSpec } from 'prosemirror-model';

const styleArr = [
  'color:#ea7f51;',
  // 1: punctuation
  'color:#c63ed4;',
  // 2: punctuation
  'color:#78af46;',
  // 3: strings and regexps
  'color:#3d83c1;',
  // 4: comments
  'color:gray;font-style: italic;',
];

export const codeFormat: MarkSpec = {
  inclusive: false,
  attrs: {
    formatType: { default: 0 },
  },
  parseDOM: [{ tag: 'span[data-code-format-type]' }],
  toDOM(mark: any) {
    const formatType = mark.attrs['formatType'];
    return [
      'span',
      {
        style: styleArr[formatType],
      },
    ];
  },
};

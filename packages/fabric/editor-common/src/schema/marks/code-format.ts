import { MarkSpec } from 'prosemirror-model';

const colorArr = [
  'red',
  // 2: punctuation
  '#1bc71b',
  // 3: strings and regexps
  'blue',
  // 4: comments
  'gray',
];

export const codeFormat: MarkSpec = {
  inclusive: false,
  attrs: {
    formatType: { default: 0 },
  },
  parseDOM: [{ tag: 'span[data-code-format-type]' }],
  toDOM(mark: any) {
    const formatType = mark.attrs['formatType'];
    console.log('formatType', formatType);
    return [
      'span',
      {
        style: `color: ${colorArr[formatType]}`,
      },
    ];
  },
};

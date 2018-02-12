import { MarkSpec, Mark } from 'prosemirror-model';
import { COLOR, FONT_STYLE, LINK, SEARCH_QUERY } from '../groups';

const statusStyles = {
  '0': 'color:#42526E;background-color:#F4F5F7;',
  '1': 'color:#006644;background-color:#E3FCEF;',
  '2': 'color:#BF2600;background-color:#FFEBE6;',
  '3': 'color:#0747A6;background-color:#DEEBFF;',
  '4': 'color:#403294;background-color:#EAE6FF;',
  '5': 'color:#344563;background-color:#FFFAE6;',
};

export const confluenceStatus: MarkSpec = {
  excludes: `${FONT_STYLE} ${LINK} ${SEARCH_QUERY} ${COLOR}`,
  inclusive: true,
  attrs: {
    status: { default: '0' },
  },
  parseDOM: [
    {
      tag: 'span[data-status]',
      getAttrs: (dom: HTMLElement) => ({
        status: dom.getAttribute('data-status'),
      }),
    },
  ],
  toDOM(mark: Mark) {
    const attrs = {
      'data-status': mark.attrs.status,
      style: statusStyles[mark.attrs.status],
    };
    return ['span', attrs, 0];
  },
};

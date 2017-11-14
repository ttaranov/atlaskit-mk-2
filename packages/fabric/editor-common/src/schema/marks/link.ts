import { MarkSpec } from 'prosemirror-model';
import { LINK, COLOR } from '../groups';
import { isSafeUrl, normalizeUrl } from '../../utils';

/**
 * @name link_mark
 */
export interface Definition {
  type: 'link';
  attrs: {
    href: string;
    title?: string;
    collection?: string;
    occurrenceKey?: string;
  };
}

export const link: MarkSpec = {
  excludes: COLOR,
  group: LINK,
  attrs: {
    href: {}
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]', getAttrs: (dom: Element) => {
        const href = dom.getAttribute('href') || '';

        return isSafeUrl(href)
          ? { href: normalizeUrl(href) }
          : false;
      }
    }
  ],
  toDOM(node): [string, any] { return ['a', node.attrs]; }
};

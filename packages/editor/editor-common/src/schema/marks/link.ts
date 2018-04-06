import { MarkSpec } from 'prosemirror-model';
import { LINK, COLOR } from '../groups';
import { isSafeUrl, normalizeUrl } from '../../utils';

export interface ConfluenceLinkMetadata {
  linkType: string;
  versionAtSave?: string | null;
  fileName?: string | null;
  spaceKey?: string | null;
  contentTitle?: string | null;
  isRenamedTitle?: boolean;
  anchorName?: string | null;
  contentId?: string | null;
  container?: ConfluenceLinkMetadata;
}

export interface LinkAttributes {
  href: string;
  title?: string;
  id?: string;
  collection?: string;
  occurrenceKey?: string;

  __confluenceMetadata?: ConfluenceLinkMetadata;
}

/**
 * @name link_mark
 */
export interface Definition {
  type: 'link';
  attrs: LinkAttributes;
}

export const link: MarkSpec = {
  excludes: COLOR,
  group: LINK,
  attrs: {
    href: {},
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs: (dom: Element) => {
        let href = dom.getAttribute('href') || '';
        if (href.slice(-1) === '/') {
          href = href.slice(0, -1);
        }
        return isSafeUrl(href) ? { href: normalizeUrl(href) } : false;
      },
    },
  ],
  toDOM(node): [string, any] {
    return ['a', node.attrs];
  },
};

import { MarkSpec } from 'prosemirror-model';
import { LINK, COLOR } from '../groups';

/**
 * @name action_mark
 */
export interface Definition {
  type: 'action';
  attrs: Attributes;
}

export interface Attributes extends Action {
  title: string;
}

export interface Action {
  target: {
    receiver?: string;
    key: string;
  };
  parameters?: object;
}

export const action: MarkSpec = {
  excludes: COLOR,
  group: LINK,
  attrs: {
    title: { default: null },
    target: { default: null },
    parameters: { default: null }
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'span[data-mark-type="action"]',
      getAttrs: (dom: Element) => {
        const receiver = dom.getAttribute('data-action-mark-target-receiver');
        const key = dom.getAttribute('data-action-mark-target-key');
        const title = dom.getAttribute('data-action-mark-title');

        return {
          title,
          target: {
            receiver,
            key
          }
        };
      }
    }
  ],
  toDOM(node): [string, any] {
    const { title, target } = node.attrs;
    return ['span', {
      'data-mark-type': 'action',
      'data-action-mark-title': title,
      'data-action-mark-target-receiver': target && target.receiver,
      'data-action-mark-target-key': target && target.key,
    }];
  }
};

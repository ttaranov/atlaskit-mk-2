import { NodeSpec, Node as PMNode } from 'prosemirror-model';

// Migrate to String Enums when we move to TypeScript 2.4
export const USER_TYPES = {
  DEFAULT: true,
  SPECIAL: true,
  APP: true,
};

export type UserType = keyof typeof USER_TYPES;

export interface Attributes {
  id: string;
  text?: string;
  userType?: UserType;
}

/**
 * @name mention_node
 */
export interface Definition {
  type: 'mention';
  attrs: Attributes;
}

export const mention: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  attrs: {
    id: { default: '' },
    text: { default: '' },
    accessLevel: { default: '' },
    userType: { default: null },
  },
  parseDOM: [{
    tag: 'span[data-mention-id]',
    getAttrs: (dom: Element) => {
      const attrs = {
        id: dom.getAttribute('data-mention-id')!,
        text: dom.textContent!,
        accessLevel: dom.getAttribute('data-access-level')!,
      };

      const userType = dom.getAttribute('data-user-type')!;
      if (USER_TYPES[userType]) {
        attrs['userType'] = userType;
      }

      return attrs;
    },
  }],
  toDOM(node: any) {
    const { id, accessLevel, text, userType } = node.attrs;
    const attrs = {
      'data-mention-id': id,
      'data-access-level': accessLevel,
      'contenteditable': 'false',
    };
    if (userType) {
      attrs['data-user-type'] = userType;
    }
    return ['span', attrs, text];
  }
};

const isOptional = (key: string) => {
  return ['userType'].indexOf(key) > -1;
};

export const toJSON = (node: PMNode) => ({
  attrs: Object.keys(node.attrs)
    .reduce((obj, key) => {
      if (isOptional(key) && !node.attrs[key]) {
        return obj;
      }
      obj[key] = node.attrs[key];
      return obj;
    }, {})
});

import { NodeSpec, Node as PMNode } from 'prosemirror-model';

/**
 * @name applicationCard_node
 */
export interface ApplicationCardDefinition {
  type: 'applicationCard';
  attrs: ApplicationCardAttributes;
}

export interface ApplicationCardAttributes {
  text: string;
  textUrl?: string;
  link?: {
    /**
     * @pattern "^https?:\/\/|^data:image\/"
     */
    url: string;
  };
  background?: {
    /**
     * @pattern "^https:\/\/|^data:image\/"
     */
    url: string;
  };
  collapsible?: boolean;
  preview?: {
    /**
     * @pattern "^https:\/\/|^data:image\/"
     */
    url: string;
  };
  title: AppCardTitle;
  description?: AppCardDescription;
  details?: AppCardDetails[];
  actions?: AppCardAction[];
  context?: AppCardContext;
}

export interface AppCardContext {
  text: string;
  icon?: AppCardIcon;
}

export interface AppCardTitle {
  text: string;
  user?: AppCardUser;
}

export interface AppCardDescription {
  text: string;
}

export interface AppCardDetails {
  title?: string;
  text?: string;
  icon?: AppCardIcon;
  badge?: AppCardBadge;
  lozenge?: AppCardLozenge;
  users?: AppCardUser[];
}

export interface AppCardAction {
  key?: string;
  title: string;
  target: {
    receiver?: string;
    key: string;
  };
  parameters?: object;
}

export interface AppCardBadge {
  value: number;
  max?: number;
  theme?: 'default' | 'dark';
  appearance?: 'default' | 'primary' | 'important' | 'added' | 'removed';
}

export interface AppCardLozenge {
  text: string;
  bold?: boolean;
  appearance?:
    | 'default'
    | 'success'
    | 'removed'
    | 'inprogress'
    | 'new'
    | 'moved';
}

export interface AppCardUser {
  id?: string;
  icon: AppCardIcon;
}

export interface AppCardIcon {
  /**
   * @pattern "^https:\/\/|^data:image\/"
   */
  url: string;
  label: string;
}

const defaultAttrs = {
  text: { default: '' },
  textUrl: { default: null },
  link: { default: null },
  background: { default: null },
  collapsible: { default: null },
  preview: { default: null },
  title: { default: { text: '' } },
  description: { default: null },
  details: { default: null },
  actions: { default: null },
  context: { default: null },
};

export const applicationCard: NodeSpec = {
  inline: false,
  selectable: true,
  attrs: defaultAttrs,
  group: 'block',
  parseDOM: [
    {
      tag: 'div[data-node-type="media"]',
      getAttrs: dom => {
        const attrs: ApplicationCardAttributes = {
          text: '',
          title: { text: '' },
        };

        Object.keys(defaultAttrs).forEach(key => {
          attrs[key] = (dom as HTMLElement).dataset[key];
        });

        return attrs;
      },
    },
  ],
  toDOM(node: PMNode) {
    return ['div', node.attrs];
  },
};

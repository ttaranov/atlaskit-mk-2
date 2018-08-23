import * as React from 'react';
import GraphBarIcon from '@atlaskit/icon/glyph/graph-bar';
import FolderIcon from '@atlaskit/icon/glyph/folder';
import RSVPIcon from '@atlaskit/icon/glyph/hipchat/lobby';
import {
  QuickInsertItem,
  QuickInsertProvider,
} from '../src/plugins/quick-insert/types';
import { getPollDefaultNode } from '../apps/Poll/document';
import { EDITOR_APPS_EXTENSION_TYPE, RSVP_EXTENSION_KEY } from '../apps/RSVP';

export const rsvpExtensionDefault = {
  type: 'extension',
  attrs: {
    extensionType: EDITOR_APPS_EXTENSION_TYPE,
    extensionKey: RSVP_EXTENSION_KEY,
    parameters: {},
  },
};

export const tabsExtensionDefault = {
  type: 'bodiedExtension',
  attrs: {
    extensionType: 'com.atlassian.editor.apps.core',
    extensionKey: 'tabs',
    parameters: {
      tabs: [
        {
          name: 'Tab',
          id: '1',
        },
      ],
      tabsContent: [
        {
          tabId: '1',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ],
    },
  },
  content: [
    {
      type: 'paragraph',
      content: [],
    },
  ],
};

const items: Array<QuickInsertItem> = [
  {
    title: 'Poll',
    icon: () => <GraphBarIcon label="Poll" />,
    action(insert) {
      return insert(getPollDefaultNode());
    },
  },
  {
    title: 'Tabs',
    icon: () => <FolderIcon label="Tabs" />,
    action(insert) {
      return insert(tabsExtensionDefault);
    },
  },
  {
    title: 'RSVP',
    icon: () => <RSVPIcon label="RSVP" />,
    action(insert) {
      return insert(rsvpExtensionDefault);
    },
  },
];

export default function quickInsertProviderFactory(): QuickInsertProvider {
  return {
    getItems() {
      return new Promise(resolve => {
        setTimeout(() => resolve(items), 1000);
      });
    },
  };
}

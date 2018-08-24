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
import { getTabsDefaultNode } from '../apps/Tabs/document';

const getRSVPDefault = () => {
  const date = new Date();
  return {
    type: 'extension',
    attrs: {
      extensionType: EDITOR_APPS_EXTENSION_TYPE,
      extensionKey: RSVP_EXTENSION_KEY,
      parameters: {
        id: '6f4c4f14-a5db-4553-95c3-391e00fe8f49',
        title: 'ShipIt 43',
        location: '363 George Street, NSW 2009',
        showMap: true,
        dateTime: date.setDate(date.getDate() + 7),
        // deadline: new Date(2018, 11, 12),
        duration: 2 * 60 * 60 * 1000,
        maxAttendees: 5,
      },
    },
  };
};

export const tabsExtensionDefault = getTabsDefaultNode();

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
      return insert(getRSVPDefault());
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

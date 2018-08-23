import * as React from 'react';
import RSVPIcon from '@atlaskit/icon/glyph/hipchat/lobby';
import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../apps/RSVP/document';
import { EDITOR_APPS_EXTENSION_TYPE, RSVP_EXTENSION_KEY } from '../apps/RSVP';

const rsvpExtensionDefault = {
  type: 'extension',
  attrs: {
    extensionType: EDITOR_APPS_EXTENSION_TYPE,
    extensionKey: RSVP_EXTENSION_KEY,
    parameters: {},
  },
};

const quickInsertItems = [
  {
    title: 'RSVP',
    icon: () => <RSVPIcon label="RSVP" />,
    action(insert) {
      return insert(rsvpExtensionDefault);
    },
  },
];

function quickInsertProviderFactory() {
  return {
    getItems() {
      return new Promise(resolve => {
        setTimeout(() => resolve(quickInsertItems), 1000);
      });
    },
  };
}

const insertMenuItems = [
  {
    content: 'RSVP',
    value: { name: 'rsvp' },
    tooltipDescription: 'Insert rsvp!',
    tooltipPosition: 'right',
    elemBefore: <RSVPIcon label="RSVP" />,
    onClick: function(editorActions) {
      editorActions.replaceSelection(rsvpExtensionDefault);
    },
  },
];

const quickInsert = { provider: Promise.resolve(quickInsertProviderFactory()) };

export default function Example() {
  return FullPageExample({
    defaultValue: exampleDocument,
    insertMenuItems,
    quickInsert,
  });
}

import * as React from 'react';
import { ExtensionHandlers } from '@atlaskit/editor-common';
import {
  EDITOR_APPS_EXTENSION_TYPE,
  POLL_EXTENSION_KEY,
  PollApp,
} from '../apps/Poll';
import { TABS_EXTENSION_KEY, TabsApp } from '../apps/Tabs';
import { RSVP_EXTENSION_KEY, RSVPApp } from '../apps/RSVP';

const FakeExtension = ({ colour, children }) => {
  return (
    <div
      style={{
        backgroundColor: colour,
        color: 'white',
        padding: 10,
      }}
    >
      {children}
    </div>
  );
};

const InlineExtension = () => {
  return <FakeExtension colour="green">Inline extension demo</FakeExtension>;
};

const BlockExtension = () => {
  return <FakeExtension colour="black">Block extension demo</FakeExtension>;
};

const BodiedExtension = () => {
  return <FakeExtension colour="blue">Bodied extension demo</FakeExtension>;
};

export const extensionHandlers: ExtensionHandlers = {
  'com.atlassian.confluence.macro.core': (ext, doc) => {
    const { extensionKey } = ext;

    // using any here because most props are going to be injected through the extension handler
    // and typescript won't accept that as valid
    const macroProps: any = {
      node: ext,
    };

    switch (extensionKey) {
      case 'block-eh':
        return <BlockExtension {...macroProps} />;
      case 'bodied-eh':
        return <BodiedExtension {...macroProps} />;
      case 'inline-eh':
        return <InlineExtension {...macroProps} />;
    }

    return null;
  },
  [EDITOR_APPS_EXTENSION_TYPE]: (ext, doc, syncEditorState, isFocused) => {
    const { extensionKey, parameters, content } = ext;

    if (extensionKey === POLL_EXTENSION_KEY) {
      return <PollApp {...parameters} editable={true} />;
    }

    if (extensionKey === TABS_EXTENSION_KEY) {
      return (
        <TabsApp
          {...parameters}
          editable={true}
          syncEditorState={syncEditorState}
          content={content}
          isFocused={isFocused}
        />
      );
    }

    if (extensionKey === RSVP_EXTENSION_KEY) {
      return <RSVPApp {...parameters} editable={true} />;
    }

    return null;
  },
};

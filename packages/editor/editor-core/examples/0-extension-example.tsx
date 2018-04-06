import * as React from 'react';

import Editor from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import { ExtensionProvider, ExtensionAttributes } from '../src/plugins/macro';
import { Node } from 'prosemirror-model';
import { InsertMenuCustomItem } from '../src/types';
import { EditorActions } from '../src';
import { ExtensionHandlers } from '@atlaskit/editor-common';

class ExampleExtensionProvider implements ExtensionProvider {
  config = {};

  editExtension(extensionNode?: Node | undefined) {
    if (extensionNode) {
      console.log('Edited extension', extensionNode);
    }
    alert('You clicked edit!');
    return Promise.resolve({
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.example',
        extensionKey: 'dummy',
      },
      content: [],
    } as any);
  }

  autoConvert(link: String): ExtensionAttributes | null {
    return null;
  }
}

const insertExampleExtension: InsertMenuCustomItem = {
  content: 'Insert my example extension!',
  value: { name: 'example!' },
  tooltipDescription: 'Do not click this',
  tooltipPosition: 'right',
  elemBefore: '-',
  onClick(editorActions: EditorActions) {
    editorActions.replaceSelection({
      type: 'extension',
      attrs: {
        extensionType: 'com.atlassian.example',
        extensionKey: 'dummy',
      },
      content: [],
    });
  },
} as any;

class DummyRenderer extends React.Component {
  state = { content: 'Loading...' };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ content: 'This is what we want to see' });
    }, 2000);
  }

  render() {
    return <p>{this.state.content}</p>;
  }
}

export const extensionHandlers: ExtensionHandlers = {
  'com.atlassian.example': (ext, doc) => {
    if (ext.extensionKey === 'dummy') {
      return <DummyRenderer />;
    }
    return <p>Not my extension</p>;
  },
};

export default class Example extends React.Component {
  render() {
    return (
      <EditorContext>
        <Editor
          appearance="full-page"
          allowTextFormatting={true}
          allowCodeBlocks={true}
          allowLists={true}
          allowTextColor={true}
          allowDate={true}
          allowPanel={true}
          // Extension stuff here
          allowExtension={true}
          extensionProvider={Promise.resolve(new ExampleExtensionProvider())}
          extensionHandlers={extensionHandlers}
          insertMenuItems={[insertExampleExtension]}
        />
      </EditorContext>
    );
  }
}

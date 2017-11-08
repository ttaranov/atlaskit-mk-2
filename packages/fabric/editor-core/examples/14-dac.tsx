/*
 *
 *
 * PLEASE DO NOT REMOVE THIS STORY
 * IT'S USED FOR developer.atlassian.com documentation playground
 *
 *
 * */
import * as React from 'react';
import { PureComponent } from 'react';
import { storyData as emojiStoryData } from '@atlaskit/emoji/dist/es5/support';

import Editor from '../example-helpers/editor';
import { createSchema } from '@atlaskit/editor-common';
import { JSONTransformer } from '../src/transformers';
import ProviderFactory from '../src/providerFactory';

const providerFactory = new ProviderFactory();
providerFactory.setProvider('emojiProvider', emojiStoryData.getEmojiResource());

const schema = createSchema({
  nodes: [
    'doc',
    'paragraph',
    'text',
    'bulletList',
    'orderedList',
    'listItem',
    'heading',
    'blockquote',
    'codeBlock',
    'panel',
    'rule',
    'hardBreak',
    'emoji',
  ],
  marks: [
    'em',
    'strong',
    'code',
    'strike',
    'underline',
    'link',
    'emojiQuery',
    'subsup',
  ]
});

export default class DACEditor extends PureComponent<{}, {}> {
  private transformer = new JSONTransformer();

  onChange = (editor: Editor) => {
    if (!editor.doc) {
      return;
    }

    const json = this.transformer.encode(editor.doc);
    window.parent.postMessage({ doc: json, editor: true }, '*');
  }

  render() {
    const emojiProvider = emojiStoryData.getEmojiResource();

    return (
      <Editor
        schema={schema}
        height={200}
        isExpandedByDefault={true}
        onChange={this.onChange}
        emojiProvider={emojiProvider}
      />
    );
  }
}

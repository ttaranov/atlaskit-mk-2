import mobileEditor from '../../../src/mobile-editor-element';
import * as React from 'react';
import * as chai from 'chai';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { EditorActions, Editor } from '@atlaskit/editor-core';

declare var bridge;

describe('NativeToWebBridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };
  let editor;

  beforeEach(() => {
    editor = mount(mobileEditor());
  });

  afterEach(() => {
    editor.unmount();
  });

  it('sets content', async () => {
    bridge.setContent(JSON.stringify(originalContent));

    const value = await bridge.editorActions.getValue();
    expect(value).to.be.deep.equal(originalContent);
  });

  it('gets content', async () => {
    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));

    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(originalContent);
  });
});

import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import LayerManager from '@atlaskit/layer-manager';
import { EditorView } from 'prosemirror-view';
import { browser, createSchema, doc } from '@atlaskit/editor-common';
import {
  createEditor,
  mountWithIntlContext,
} from '@atlaskit/editor-test-helpers';
import HelpDialog, {
  formatting,
  getComponentFromKeymap,
  getSupportedFormatting,
} from '../../../../../src/plugins/help-dialog/ui';
import helpDialog from '../../../../../src/plugins/help-dialog';
import * as keymaps from '../../../../../src/keymaps';
import EditorActions from '../../../../../src/actions';
import { EventDispatcher } from '../../../../../src/event-dispatcher';

describe('@atlaskit/editor-core/editor/ui/HelpDialog', () => {
  let editorActions: EditorActions;
  let editorView: EditorView;
  beforeEach(() => {
    const editor = createEditor({ editorPlugins: [helpDialog] });
    editorActions = new EditorActions();
    editorActions._privateRegisterEditor(
      editor.editorView,
      new EventDispatcher(),
    );
    editorView = editor.editorView;
  });

  it('should not be null if isVisible is true', () => {
    const helpDialog = mountWithIntlContext(
      <LayerManager>
        <HelpDialog editorView={editorView} isVisible={true} />
      </LayerManager>,
    );

    expect(helpDialog.find(HelpDialog).length).to.equal(1);
    helpDialog.unmount();
  });

  it('should return correct description of codemap when getComponentFromKeymap is called', () => {
    const key = getComponentFromKeymap(keymaps.toggleBold);
    const shortcut = mount(<div>{key}</div>);
    if (browser.mac) {
      expect(shortcut.text()).to.equal('⌘ + B');
    } else {
      expect(shortcut.text()).to.equal('Ctrl + B');
    }
    shortcut.unmount();
  });

  describe('formatting', () => {
    it('should be an array for verious formattings supported', () => {
      expect(formatting instanceof Array).to.equal(true);
    });

    it('should have value defined for quote', () => {
      expect(formatting.filter(f => f.name === 'Bold').length).to.equal(1);
      expect(formatting.filter(f => f.name === 'Quote').length).to.equal(1);
      expect(formatting.filter(f => f.name === 'Link').length).to.equal(1);
    });

    it('should have a value of type keymap in keymap property', () => {
      expect(
        formatting.filter(f => f.name === 'Quote')[0].keymap!() ===
          keymaps.toggleBlockQuote,
      ).to.equal(true);
    });

    it('should return undefined keymap for links in message editor', () => {
      expect(
        formatting.filter(f => f.name === 'Link')[0].keymap!({
          appearance: 'message',
        }),
      ).to.equal(undefined);
    });

    it('should have correct value for auto-formatting', () => {
      const autoformat = formatting.filter(f => f.name === 'Quote')[0]
        .autoFormatting;
      const label = mount(<div>{autoformat!()}</div>);
      expect(label.text()).to.equal('> space');
      label.unmount();
    });
  });

  describe('getSupportedFormatting', () => {
    const completeSchema = createSchema({
      nodes: [
        'paragraph',
        'text',
        'mention',
        'emoji',
        'decisionList',
        'decisionItem',
        'taskList',
        'taskItem',
        'mediaGroup',
        'media',
        'codeBlock',
        'orderedList',
        'bulletList',
        'listItem',
      ],
      marks: [
        'link',
        'em',
        'underline',
        'mentionQuery',
        'emojiQuery',
        'textColor',
        'code',
      ],
      customNodeSpecs: { doc },
    });
    it('should return only the list of formatting supported by schema', () => {
      const formatting = getSupportedFormatting(completeSchema);
      expect(formatting.filter(f => f.type === 'mention').length).to.equal(1);
      expect(formatting.filter(f => f.type === 'hardBreak').length).to.equal(0);
      expect(formatting.filter(f => f.type === 'em').length).to.equal(1);
      expect(formatting.filter(f => f.type === 'strong').length).to.equal(0);
      expect(formatting.filter(f => f.type === 'codeBlock').length).to.equal(1);
      expect(formatting.filter(f => f.type === 'blockquote').length).to.equal(
        0,
      );
    });
  });
});

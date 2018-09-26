import { expect } from 'chai';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import LayerManager from '@atlaskit/layer-manager';
import { EditorView } from 'prosemirror-view';
import { browser, createSchema, doc } from '@atlaskit/editor-common';
import { createEditor, mountWithIntl } from '@atlaskit/editor-test-helpers';
import HelpDialog, {
  formatting,
  getComponentFromKeymap,
  getSupportedFormatting,
} from '../../../../../src/plugins/help-dialog/ui';
import helpDialog from '../../../../../src/plugins/help-dialog';
import * as keymaps from '../../../../../src/keymaps';
import EditorActions from '../../../../../src/actions';
import { EventDispatcher } from '../../../../../src/event-dispatcher';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();

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
    const helpDialog = mountWithIntl(
      <LayerManager>
        <HelpDialog editorView={editorView} isVisible={true} />
      </LayerManager>,
    );

    expect(helpDialog.find(HelpDialog).length).to.equal(1);
    helpDialog.unmount();
  });

  it('should return correct description of codemap when getComponentFromKeymap is called', () => {
    const key = getComponentFromKeymap(keymaps.toggleBold);
    const shortcut = mountWithIntl(<div>{key}</div>);
    if (browser.mac) {
      expect(shortcut.text()).to.equal('⌘ + B');
    } else {
      expect(shortcut.text()).to.equal('Ctrl + B');
    }
    shortcut.unmount();
  });

  describe('formatting', () => {
    it('should have value defined for quote', () => {
      expect(formatting(intl).filter(f => f.type === 'strong').length).to.equal(
        1,
      );
      expect(
        formatting(intl).filter(f => f.type === 'blockquote').length,
      ).to.equal(1);
      expect(formatting(intl).filter(f => f.type === 'link').length).to.equal(
        1,
      );
    });

    it('should have a value of type keymap in keymap property', () => {
      expect(
        formatting(intl).filter(f => f.type === 'blockquote')[0].keymap!() ===
          keymaps.toggleBlockQuote,
      ).to.equal(true);
    });

    it('should return undefined keymap for links in message editor', () => {
      expect(
        formatting(intl).filter(f => f.type === 'link')[0].keymap!({
          appearance: 'message',
        }),
      ).to.equal(undefined);
    });

    it('should have correct value for auto-formatting', () => {
      const autoFormat = formatting(intl).filter(
        f => f.type === 'blockquote',
      )[0].autoFormatting;
      const label = mountWithIntl(<div>{autoFormat!()}</div>);
      expect(label.text()).to.equal('> Space');
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
      const formatting = getSupportedFormatting(completeSchema, intl);
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

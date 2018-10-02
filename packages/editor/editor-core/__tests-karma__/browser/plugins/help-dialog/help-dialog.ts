import { expect } from 'chai';
import * as sinon from 'sinon';
import { EditorView } from 'prosemirror-view';
import { createEditor, sendKeyToPm } from '@atlaskit/editor-test-helpers';
import helpDialog, {
  pluginKey,
  openHelpCommand,
  closeHelpCommand,
} from '../../../../src/plugins/help-dialog';
import EditorActions from '../../../../src/actions';
import { analyticsService } from '../../../../src/analytics';
import { EventDispatcher } from '../../../../src/event-dispatcher';

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

  afterEach(() => {
    editorView.destroy();
  });

  describe('openHelpCommand', () => {
    it('should set helpDialog visible flag to true', () => {
      const {
        state: { tr },
        dispatch,
      } = editorView;
      openHelpCommand(tr, dispatch);
      expect(tr.getMeta(pluginKey)).to.equal(true);
    });
  });

  describe('closeHelpCommand', () => {
    it('should set helpDialog visible flag to false', () => {
      const {
        state: { tr },
        dispatch,
      } = editorView;
      closeHelpCommand(tr, dispatch);
      expect(tr.getMeta(pluginKey)).to.equal(false);
    });
  });

  describe('keymap plugin', () => {
    it('should open help dialog on Mod-/ keypress', () => {
      sendKeyToPm(editorView, 'Mod-/');
      const dialogState = pluginKey.getState(editorView.state);
      expect(dialogState.isVisible).to.equal(true);
    });
    it('should call analytics event correctly', () => {
      let trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      sendKeyToPm(editorView, 'Mod-/');
      expect(trackEvent.calledWith('atlassian.editor.help.keyboard')).to.equal(
        true,
      );
    });
  });
});

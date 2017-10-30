import { expect } from 'chai';
import * as sinon from 'sinon';
import createEditor from '../../../../helpers/create-editor';
import helpDialog, { pluginKey, openHelpCommand, closeHelpCommand } from '../../../../../src/editor/plugins/help-dialog';
import { EditorView } from 'prosemirror-view';
import EditorActions from '../../../../../src/editor/actions';
import { sendKeyToPm } from '../../../../../src/test-helper';
import { analyticsService } from '../../../../../src/analytics';

describe('@atlaskit/editor-core/editor/ui/HelpDialog', () => {

  let editorActions: EditorActions;
  let editorView: EditorView;
  beforeEach(() => {
    const editor = createEditor([helpDialog]);
    editorActions = new EditorActions();
    editorActions._privateRegisterEditor(editor.editorView);
    editorView = editor.editorView;
  });

  afterEach(() => {
    editorView.destroy();
  });

  describe('pluginKey', () => {
    it('should not be undefined', () => {
      expect(pluginKey).to.not.equal(undefined);
    });
  });

  describe('openHelpCommand', () => {
    it('should set helpDialog visible flag to true', () => {
      const { state: { tr }, dispatch } = editorView;
      openHelpCommand(tr, dispatch);
      expect(tr.getMeta(pluginKey)).to.equal(true);
    });
  });

  describe('closeHelpCommand', () => {
    it('should set helpDialog visible flag to false', () => {
      const { state: { tr }, dispatch } = editorView;
      closeHelpCommand(tr, dispatch);
      expect(tr.getMeta(pluginKey)).to.equal(false);
    });
  });

  describe('helpDialog.pmPlugins', () => {
    it('should return array of size 2', () => {
      expect(helpDialog.pmPlugins!().length).to.equal(2);
    });
    it('should have well defined contentComponent', () => {
      expect(helpDialog.contentComponent).to.not.equal(undefined);
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
      expect(trackEvent.calledWith('atlassian.editor.help.keyboard')).to.equal(true);
    });
  });
});

import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import {
  MediaPluginState,
  mediaPluginFactory,
  ProviderFactory,
} from '../../../../src';
import {
  chaiPlugin,
  doc,
  makeEditor,
  p,
  sendKeyToPm,
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';

chai.use(chaiPlugin);

describe('media - keymaps', () => {
  const providerFactory = new ProviderFactory();

  const editor = (doc: any, uploadErrorHandler?: () => void) => makeEditor<MediaPluginState>({
    doc,
    plugins: [
      ...mediaPluginFactory(defaultSchema, { providerFactory, uploadErrorHandler }),
    ],
    schema: defaultSchema
  });

  after(() => {
    providerFactory.destroy();
  });

  describe('Mod-z keypress', () => {
    it('does not detect links', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));

      sendKeyToPm(editorView, 'Mod-z');

      expect(pluginState.ignoreLinks).to.equal(true);
      editorView.destroy();
    });
  });

  describe('Backspace keypress', () => {
    it('calls media plugin state to remove media node', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const removeMediaNodeSpy = sinon.spy(pluginState, 'removeSelectedMediaNode');

      sendKeyToPm(editorView, 'Backspace');

      expect(removeMediaNodeSpy.calledOnce).to.equal(true);
      editorView.destroy();
    });
  });

  describe('Enter keypress', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const splitMediaGroupSpy = sinon.spy(pluginState, 'splitMediaGroup');

      sendKeyToPm(editorView, 'Enter');

      expect(splitMediaGroupSpy.calledOnce).to.equal(true);
      editorView.destroy();
    });
  });

  describe('Shift-Enter keypress', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const splitMediaGroupSpy = sinon.spy(pluginState, 'splitMediaGroup');

      sendKeyToPm(editorView, 'Shift-Enter');

      expect(splitMediaGroupSpy.calledOnce).to.equal(true);
      editorView.destroy();
    });
  });
});

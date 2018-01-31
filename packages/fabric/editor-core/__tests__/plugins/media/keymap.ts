import mediaPluginFactory, {
  MediaPluginState,
} from '../../../src/plugins/media';
import {
  doc,
  makeEditor,
  p,
  sendKeyToPm,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

describe('media - keymaps', () => {
  const providerFactory = new ProviderFactory();

  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    makeEditor<MediaPluginState>({
      doc,
      plugins: [
        ...mediaPluginFactory(defaultSchema, {
          providerFactory,
          uploadErrorHandler,
        }),
      ],
      schema: defaultSchema,
    });

  afterEach(() => {
    providerFactory.destroy();
  });

  describe('Mod-z keypress', () => {
    it('does not detect links', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));

      sendKeyToPm(editorView, 'Mod-z');

      expect(pluginState.ignoreLinks).toBe(true);
      editorView.destroy();
    });
  });

  describe('Backspace keypress', () => {
    it('calls media plugin state to remove media node', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const removeMediaNodeSpy = jest.spyOn(
        pluginState,
        'removeSelectedMediaNode',
      );

      sendKeyToPm(editorView, 'Backspace');

      expect(removeMediaNodeSpy).toHaveBeenCalled();
      editorView.destroy();
    });
  });

  describe('Enter keypress', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const splitMediaGroupSpy = jest.spyOn(pluginState, 'splitMediaGroup');

      sendKeyToPm(editorView, 'Enter');

      expect(splitMediaGroupSpy).toHaveBeenCalled();
      editorView.destroy();
    });
  });

  describe('Shift-Enter keypress', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(doc(p('{<>}')));
      const splitMediaGroupSpy = jest.spyOn(pluginState, 'splitMediaGroup');

      sendKeyToPm(editorView, 'Shift-Enter');

      expect(splitMediaGroupSpy).toHaveBeenCalled();
      editorView.destroy();
    });
  });
});

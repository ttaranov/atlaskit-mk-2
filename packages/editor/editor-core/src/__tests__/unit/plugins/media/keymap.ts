import {
  doc,
  createEditor,
  p,
  mediaGroup,
  media,
  sendKeyToPm,
  storyMediaProviderFactory,
  randomId,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  DefaultMediaStateManager,
} from '../../../../plugins/media/pm-plugins/main';
import mediaPlugin from '../../../../plugins/media';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

describe('media - keymaps', () => {
  const providerFactory = new ProviderFactory();

  const editor = (doc: any, uploadErrorHandler?: () => void) => {
    const stateManager = new DefaultMediaStateManager();
    const mediaProvider = storyMediaProviderFactory({
      collectionName: testCollectionName,
      stateManager,
      includeUserAuthProvider: true,
    });

    return createEditor<MediaPluginState>({
      doc,
      editorPlugins: [mediaPlugin({ provider: mediaProvider })],
      editorProps: {
        uploadErrorHandler,
      },
      pluginKey: mediaPluginKey,
    });
  };

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
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      const splitMediaGroupSpy = jest.spyOn(pluginState, 'splitMediaGroup');

      sendKeyToPm(editorView, 'Shift-Enter');
      expect(splitMediaGroupSpy).toHaveBeenCalled();
      editorView.destroy();
    });
  });
});

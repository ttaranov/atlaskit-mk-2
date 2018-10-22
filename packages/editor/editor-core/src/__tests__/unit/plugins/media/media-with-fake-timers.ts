import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  createEditor,
  p,
  storyMediaProviderFactory,
  randomId,
} from '@atlaskit/editor-test-helpers';

import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  DefaultMediaStateManager,
} from '../../../../plugins/media/pm-plugins/main';
import mediaPlugin from '../../../../plugins/media';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    stateManager,
    includeUserAuthProvider: true,
    includeUploadContext: true,
  });

describe('Media plugin', async () => {
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) =>
    createEditor<MediaPluginState>({
      doc,
      editorPlugins: [mediaPlugin({ provider: mediaProvider })],
      editorProps: editorProps,
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  afterAll(() => {
    providerFactory.destroy();
  });

  describe('updateUploadState', () => {
    it('should change upload state to unfinished when uploads start', async () => {
      const { pluginState } = editor(doc(p('')));
      const provider = await mediaProvider;
      await provider.uploadContext;
      await provider.viewContext;

      pluginState.insertFiles([
        {
          id: 'foo',
          fileMimeType: 'image/jpeg',
          fileId: Promise.resolve('id'),
        },
      ]);
      jest.runOnlyPendingTimers();
      expect(pluginState.allUploadsFinished).toBe(false);
    });

    it('should change upload state to finished once uploads have been finished', async () => {
      const { pluginState } = editor(doc(p('')));
      const provider = await mediaProvider;
      await provider.uploadContext;
      await provider.viewContext;

      pluginState.insertFiles([
        {
          id: 'foo',
          fileMimeType: 'image/jpeg',
          fileId: Promise.resolve('id'),
          status: 'preview',
        },
      ]);
      jest.runOnlyPendingTimers();
      pluginState.stateManager.updateState('foo', {
        id: 'foo',
        fileName: 'foo.jpg',
        fileSize: 100,
        fileMimeType: 'image/jpeg',
        status: 'ready',
        dimensions: { height: 100, width: 100 },
      });
      jest.runOnlyPendingTimers();
      await pluginState.waitForPendingTasks();
      expect(pluginState.allUploadsFinished).toBe(true);
    });
  });
});

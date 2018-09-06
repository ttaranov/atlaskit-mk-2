import * as assert from 'assert';
import { undo } from 'prosemirror-history';
import { EditorView } from 'prosemirror-view';

import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  h1,
  createEditor,
  mediaGroup,
  mediaSingle,
  media,
  p,
  a,
  hr,
  table,
  tr,
  td,
  tdCursor,
  tdEmpty,
  code_block,
  storyMediaProviderFactory,
  randomId,
  sleep,
  insertText,
  getLinkCreateContextMock,
} from '@atlaskit/editor-test-helpers';

import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  DefaultMediaStateManager,
  MediaState,
} from '../../../../plugins/media/pm-plugins/main';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import { AnalyticsHandler, analyticsService } from '../../../../analytics';
import mediaPlugin from '../../../../plugins/media';
import codeBlockPlugin from '../../../../plugins/code-block';
import rulePlugin from '../../../../plugins/rule';
import tablePlugin from '../../../../plugins/table';
import pickerFacadeLoader from '../../../../plugins/media/picker-facade-loader';
import { insertMediaAsMediaSingle } from '../../../../plugins/media/utils/media-single';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const testLinkId = `mock-link-id${randomId()}`;
const linkCreateContextMock = getLinkCreateContextMock(testLinkId);

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    stateManager,
    includeUserAuthProvider: true,
  });

describe('Media plugin', () => {
  const mediaProvider = getFreshMediaProvider();
  const temporaryFileId = `temporary:${randomId()}`;
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) =>
    createEditor<MediaPluginState>({
      doc,
      editorPlugins: [
        mediaPlugin({
          provider: mediaProvider,
          allowMediaSingle: true,
          customDropzoneContainer: dropzoneContainer,
        }),
        codeBlockPlugin(),
        rulePlugin,
        tablePlugin(),
      ],
      editorProps: editorProps,
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  const getNodePos = (pluginState: MediaPluginState, id: string) => {
    const mediaNodeWithPos = pluginState.findMediaNode(id);
    assert(
      mediaNodeWithPos,
      `Media node with id "${id}" has not been mounted yet`,
    );

    return mediaNodeWithPos!.getPos();
  };

  const waitForMediaPickerReady = async (pluginState: MediaPluginState) =>
    Promise.all([
      new Promise(resolve => pluginState.subscribe(resolve)),
      pickerFacadeLoader(),
    ]);

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should invoke binary picker when calling insertFileFromDataUrl', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);
    await waitForMediaPickerReady(pluginState);
    const provider = await mediaProvider;
    await provider.uploadContext;

    await waitForMediaPickerReady(pluginState);
    expect(typeof pluginState.binaryPicker!).toBe('object');

    pluginState.binaryPicker!.upload = jest.fn();

    pluginState.insertFileFromDataUrl(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'test.gif',
    );

    expect(pluginState.binaryPicker!.upload as any).toHaveBeenCalledTimes(1);
    collectionFromProvider.mockRestore();
    pluginState.destroy();
  });

  it('should set local preview on context when file is uploaded', async () => {
    const provider = await mediaProvider;
    const { pluginState } = editor(doc(p('')));
    const temporaryId = 'temp-id';
    const publicId = 'public-id';
    const src = 'file-preview';

    await waitForMediaPickerReady(pluginState);
    await provider.viewContext;

    const context = await pluginState['mediaProvider'].viewContext;
    const spy = jest.spyOn(context, 'setLocalPreview');
    pluginState.insertFiles([
      {
        id: temporaryId,
        fileMimeType: 'image/jpeg',
      },
    ]);
    stateManager.updateState(temporaryId, {
      id: temporaryId,
      status: 'processing',
      thumbnail: {
        src,
      },
      publicId,
    });

    await sleep(0);

    expect(spy).toBeCalledWith(publicId, src);
  });

  describe('when message editor', () => {
    it('inserts media group', async () => {
      const { editorView, pluginState } = editor(doc(p('')), {
        appearance: 'message',
      });
      await waitForMediaPickerReady(pluginState);

      pluginState.insertFiles([
        { id: 'foo', fileMimeType: 'image/jpeg' },
        { id: 'bar', fileMimeType: 'image/png' },
      ]);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'foo',
              __key: 'foo',
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/jpeg',
            })(),
            media({
              id: 'bar',
              __key: 'bar',
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })(),
          ),
          p(),
        ),
      );
    });
  });

  describe('when non message editor', () => {
    describe('when all of the files are images', () => {
      it('inserts single medias', async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await waitForMediaPickerReady(pluginState);

        pluginState.insertFiles([
          {
            id: 'foo',
            fileMimeType: 'image/jpeg',
          },
          {
            id: 'bar',
            fileMimeType: 'image/png',
          },
        ]);

        stateManager.updateState('foo', {
          id: 'foo',
          status: 'preview',
          fileName: 'foo.jpg',
          fileSize: 100,
          fileMimeType: 'image/jpeg',
          thumbnail: { dimensions: { width: 100, height: 100 }, src: '' },
        });

        stateManager.updateState('foo', {
          id: 'foo',
          status: 'ready',
          publicId: 'foo',
        });

        stateManager.updateState('bar', {
          id: 'bar',
          status: 'preview',
          fileName: 'bar.png',
          fileSize: 200,
          fileMimeType: 'image/png',
          thumbnail: { dimensions: { width: 200, height: 200 }, src: '' },
        });

        stateManager.updateState('bar', {
          id: 'bar',
          status: 'ready',
          publicId: 'bar',
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'center',
            })(
              media({
                id: 'foo',
                __key: 'foo',
                type: 'file',
                collection: testCollectionName,
                __fileName: 'foo.jpg',
                __fileSize: 100,
                __fileMimeType: 'image/jpeg',
                height: 100,
                width: 100,
              })(),
            ),
            mediaSingle({
              layout: 'center',
            })(
              media({
                id: 'bar',
                __key: 'bar',
                type: 'file',
                collection: testCollectionName,
                __fileName: 'bar.png',
                __fileSize: 200,
                __fileMimeType: 'image/png',
                height: 200,
                width: 200,
              })(),
            ),
            p(),
          ),
        );
      });

      it(`shouldn't insert multiple media in uploading triggers multiple times`, async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await waitForMediaPickerReady(pluginState);

        pluginState.insertFiles([
          {
            id: 'foo',
            fileMimeType: 'image/jpeg',
          },
        ]);

        const eventPayload: MediaState = {
          id: 'foo',
          status: 'preview',
          fileName: 'foo.jpg',
          fileSize: 100,
          fileMimeType: 'image/jpeg',
          thumbnail: { dimensions: { width: 100, height: 100 }, src: '' },
        };

        stateManager.updateState('foo', eventPayload);
        stateManager.updateState('foo', eventPayload);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaSingle({
              layout: 'center',
            })(
              media({
                id: 'foo',
                __key: 'foo',
                type: 'file',
                collection: testCollectionName,
                __fileName: 'foo.jpg',
                __fileSize: 100,
                __fileMimeType: 'image/jpeg',
                height: 100,
                width: 100,
              })(),
            ),
            p(),
          ),
        );
      });

      describe('when inserting inside table cell', () => {
        it('inserts media single', async () => {
          const { editorView } = editor(
            doc(table()(tr(tdCursor, tdEmpty, tdEmpty))),
          );

          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            })()(editorView.state.schema),
          );

          // Different from media single that those optional properties are copied over only when the thumbnail is ready in media group.
          expect(editorView.state.doc).toEqualDocument(
            doc(
              table()(
                tr(
                  td({})(
                    mediaSingle({ layout: 'center' })(
                      media({
                        id: temporaryFileId,
                        __key: temporaryFileId,
                        type: 'file',
                        collection: testCollectionName,
                        __fileMimeType: 'image/png',
                      })(),
                    ),
                    p(''),
                  ),
                  tdEmpty,
                  tdEmpty,
                ),
              ),
            ),
          );
        });
      });
    });

    describe('when it is a mix of pdf and image', () => {
      it('inserts pdf as a media group and images as single', async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await waitForMediaPickerReady(pluginState);

        pluginState.insertFiles([
          { id: 'lala', fileMimeType: 'pdf' },
          { id: 'bar', fileMimeType: 'image/png' },
        ]);

        stateManager.updateState('bar', {
          id: 'bar',
          status: 'preview',
          fileName: 'bar.png',
          fileSize: 200,
          fileMimeType: 'image/png',
          thumbnail: { dimensions: { width: 200, height: 200 }, src: '' },
        });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaGroup(
              media({
                id: 'lala',
                __key: 'lala',
                type: 'file',
                __fileMimeType: 'pdf',
                collection: testCollectionName,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: 'bar',
                __key: 'bar',
                __fileName: 'bar.png',
                __fileSize: 200,
                height: 200,
                width: 200,
                __fileMimeType: 'image/png',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p(),
          ),
        );
      });
    });

    describe('when all media are non-images', () => {
      it('should insert as media group', async () => {
        const { editorView, pluginState } = editor(doc(p('')));
        await waitForMediaPickerReady(pluginState);

        pluginState.insertFiles([
          { id: 'foo', fileMimeType: 'pdf' },
          { id: 'bar', fileMimeType: 'pdf' },
          { id: 'foobar', fileMimeType: 'pdf' },
        ]);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaGroup(
              media({
                id: 'foo',
                __key: 'foo',
                type: 'file',
                __fileMimeType: 'pdf',
                collection: testCollectionName,
              })(),
              media({
                id: 'bar',
                __key: 'bar',
                type: 'file',
                __fileMimeType: 'pdf',
                collection: testCollectionName,
              })(),
              media({
                id: 'foobar',
                __key: 'foobar',
                type: 'file',
                __fileMimeType: 'pdf',
                collection: testCollectionName,
              })(),
            ),
            p(''),
          ),
        );
      });
    });
  });

  it('should call uploadErrorHandler on upload error', async () => {
    const errorHandlerSpy = jest.fn();
    const { pluginState } = editor(doc(p(), p('{<>}')), {
      uploadErrorHandler: errorHandlerSpy,
    });
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);

    await waitForMediaPickerReady(pluginState);

    pluginState.insertFiles([{ id: temporaryFileId, status: 'uploading' }]);

    stateManager.updateState(temporaryFileId, {
      id: temporaryFileId,
      status: 'error',
      error: {
        name: 'some-error',
        description: 'something went wrong',
      },
    });

    expect(errorHandlerSpy).toHaveBeenCalledTimes(1);
    expect(errorHandlerSpy).toHaveBeenCalledWith({
      id: temporaryFileId,
      status: 'error',
      error: {
        name: 'some-error',
        description: 'something went wrong',
      },
    });
    collectionFromProvider.mockRestore();
    pluginState.destroy();
  });

  it('should swap temporary id with public id', async () => {
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')));

    const tempFileId = `temporary:${randomId()}`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;

    const publicId = 'public-id';

    pluginState.insertFiles([{ id: tempFileId, status: 'uploading' }]);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: tempFileId,
            __key: tempFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    stateManager.updateState(tempFileId, {
      id: tempFileId,
      status: 'processing',
      publicId,
    });

    await sleep(0);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: publicId,
            __key: tempFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );
    editorView.destroy();
    pluginState.destroy();
  });

  it('should remove failed uploads from the document', async () => {
    const handler = jest.fn();
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')), handler);
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);

    const provider = await mediaProvider;
    await provider.uploadContext;

    pluginState.insertFiles([{ id: temporaryFileId, status: 'uploading' }]);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    stateManager.updateState(temporaryFileId, {
      id: temporaryFileId,
      status: 'error',
    });

    expect(editorView.state.doc).toEqualDocument(doc(p(), p()));
    collectionFromProvider.mockRestore();
    editorView.destroy();
    pluginState.destroy();
  });

  it('should cancel in-flight uploads after media item is removed from document', async () => {
    const spy = jest.fn();
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')), spy);
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);
    const firstTemporaryFileId = `temporary:first`;
    const secondTemporaryFileId = `temporary:second`;
    const secondFileId = `second`;
    const thirdTemporaryFileId = `temporary:third`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;
    await waitForMediaPickerReady(pluginState);

    pluginState.insertFiles([
      { id: firstTemporaryFileId, status: 'uploading' },
      { id: secondTemporaryFileId, status: 'uploading' },
      { id: thirdTemporaryFileId, status: 'uploading' },
    ]);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: firstTemporaryFileId,
            __key: firstTemporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
          media({
            id: secondTemporaryFileId,
            __key: secondTemporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
          media({
            id: thirdTemporaryFileId,
            __key: thirdTemporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    stateManager.updateState(firstTemporaryFileId, {
      id: firstTemporaryFileId,
      status: 'uploading',
    });

    stateManager.updateState(secondTemporaryFileId, {
      id: secondTemporaryFileId,
      status: 'processing',
      publicId: secondTemporaryFileId,
    });

    stateManager.on(firstTemporaryFileId, spy);
    stateManager.on(secondTemporaryFileId, spy);
    stateManager.on(secondFileId, spy);
    stateManager.on(thirdTemporaryFileId, spy);

    let pos: number;
    pos = getNodePos(pluginState, firstTemporaryFileId);
    editorView.dispatch(editorView.state.tr.delete(pos, pos + 1));
    // When removing multiple nodes with node view, ProseMirror performs the DOM update
    // asynchronously after a 20ms timeout. In order for the operations to succeed, we
    // must wait for the DOM reconciliation to conclude before proceeding.
    await sleep(100);

    pos = getNodePos(pluginState, secondTemporaryFileId);
    editorView.dispatch(editorView.state.tr.delete(pos, pos + 1));
    await sleep(100);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: thirdTemporaryFileId,
            __key: thirdTemporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    /** Since we have a state manager in the nodeview now too */
    expect(spy).toHaveBeenCalledTimes(2);

    expect(spy).toHaveBeenCalledWith({
      id: firstTemporaryFileId,
      status: 'cancelled',
    });

    collectionFromProvider.mockRestore();
    editorView.destroy();
    pluginState.destroy();
  });

  it('should not revert to temporary media nodes after upload finished and we undo', async () => {
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')));
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);
    const tempFileId = `temporary:${randomId()}`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;

    pluginState.insertFiles([{ id: tempFileId, status: 'uploading' }]);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: tempFileId,
            __key: tempFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    stateManager.updateState(tempFileId, {
      id: tempFileId,
      status: 'uploading',
    });

    // mark the upload as finished, triggering replacement of media node
    stateManager.updateState(tempFileId, {
      id: tempFileId,
      publicId: tempFileId,
      status: 'ready',
    });

    expect(editorView.state.doc).toEqualDocument(
      doc(
        p(),
        mediaGroup(
          media({
            id: tempFileId,
            __key: tempFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    // undo last change
    expect(undo(editorView.state, editorView.dispatch)).toBe(true);

    expect(editorView.state.doc).toEqualDocument(doc(p(), p()));
    collectionFromProvider.mockRestore();
    editorView.destroy();
    pluginState.destroy();
  });

  it('It should not hide the progress bar before upload is done', async () => {
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')));

    const tempFileId = `temporary:${randomId()}`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;

    pluginState.insertFiles([{ id: tempFileId, status: 'uploading' }]);

    /** update to preview state of the media */
    stateManager.updateState(tempFileId, {
      id: tempFileId,
      publicId: tempFileId,
      status: 'preview',
    });
    const updatedState = stateManager.getState(tempFileId);
    expect(updatedState!.progress).not.toEqual(1);
    editorView.destroy();
    pluginState.destroy();
  });

  it('should set new pickers exactly when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    const mediaProvider1 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider1);
    const mediaProvider2 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider2);

    const resolvedMediaProvider1 = await mediaProvider1;
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider1.uploadContext;
    await resolvedMediaProvider2.uploadContext;

    expect(pluginState.pickers.length).toBe(4);
  });

  it('should re-use old pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    const mediaProvider1 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider1);
    const resolvedMediaProvider1 = await mediaProvider1;
    await resolvedMediaProvider1.uploadContext;
    const pickersAfterMediaProvider1 = pluginState.pickers;
    expect(pickersAfterMediaProvider1.length).toBe(4);

    const mediaProvider2 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider2);
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider2.uploadContext;
    const pickersAfterMediaProvider2 = pluginState.pickers;

    expect(pickersAfterMediaProvider1).toHaveLength(
      pickersAfterMediaProvider2.length,
    );
    for (let i = 0; i < pickersAfterMediaProvider1.length; i++) {
      expect(pickersAfterMediaProvider1[i]).toEqual(
        pickersAfterMediaProvider2[i],
      );
    }
  });

  it('should hide any existing popup picker when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    const mediaProvider1 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider1);
    const resolvedMediaProvider1 = await mediaProvider1;
    await resolvedMediaProvider1.uploadContext;

    const spy = jest.spyOn((pluginState as any).popupPicker, 'hide');

    const mediaProvider2 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider2);
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider2.uploadContext;
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set new upload params for existing pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers.length).toBe(0);

    const mediaProvider1 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider1);
    const resolvedMediaProvider1 = await mediaProvider1;
    await resolvedMediaProvider1.uploadContext;

    pluginState.pickers.forEach(picker => {
      picker.setUploadParams = jest.fn();
    });

    const mediaProvider2 = getFreshMediaProvider();
    await pluginState.setMediaProvider(mediaProvider2);
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider2.uploadContext;

    pluginState.pickers.forEach(picker => {
      expect(picker.setUploadParams as any).toHaveBeenCalledTimes(1);
    });
  });

  it('should trigger analytics events for picking and dropzone', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    const provider = await mediaProvider;
    await provider.uploadContext;

    await waitForMediaPickerReady(pluginState);

    expect(typeof pluginState.binaryPicker!).toBe('object');

    const testFileData = {
      files: [
        {
          id: 'test',
          name: 'test.png',
          size: 1,
          type: 'file/test',
        },
      ],
    };

    (pluginState as any).dropzonePicker!.handleUploadsStart(testFileData);
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.dropzone', {
      fileMimeType: 'file/test',
    });
  });

  it('should trigger analytics events for picking and clipboard', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    const provider = await mediaProvider;
    await provider.uploadContext;

    await waitForMediaPickerReady(pluginState);

    expect(typeof pluginState.binaryPicker!).toBe('object');

    const testFileData = {
      files: [
        {
          id: 'test',
          name: 'test.png',
          size: 1,
          type: `file/test`,
        },
      ],
    };

    (pluginState as any).clipboardPicker!.handleUploadsStart(testFileData);
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.clipboard', {
      fileMimeType: 'file/test',
    });
  });

  it('should trigger analytics events for picking and popup', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    const provider = await mediaProvider;
    await provider.uploadContext;

    await waitForMediaPickerReady(pluginState);

    expect(typeof pluginState.binaryPicker!).toBe('object');

    const testFileData = {
      files: [
        {
          id: 'test',
          name: 'test.png',
          size: 1,
          type: `file/test`,
        },
      ],
    };

    (pluginState as any).popupPicker!.handleUploadsStart(testFileData);
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.popup', {
      fileMimeType: 'file/test',
    });
  });

  it('should trigger analytics events for picking and binary', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = jest.fn();
    analyticsService.handler = spy as AnalyticsHandler;

    afterEach(() => {
      analyticsService.handler = null;
    });

    const provider = await mediaProvider;
    await provider.uploadContext;

    await waitForMediaPickerReady(pluginState);

    expect(typeof pluginState.binaryPicker!).toBe('object');

    const testFileData = {
      files: [
        {
          id: 'test',
          name: 'test.png',
          size: 1,
          type: `file/test`,
        },
      ],
    };

    (pluginState as any).binaryPicker!.handleUploadsStart(testFileData);
    expect(spy).toHaveBeenCalledWith('atlassian.editor.media.file.binary', {
      fileMimeType: 'file/test',
    });
  });

  describe('handleMediaNodeRemove', () => {
    it('removes media node', () => {
      const deletingMediaNodeId = 'foo';
      const deletingMediaNode = media({
        id: deletingMediaNodeId,
        type: 'file',
        collection: testCollectionName,
      })();
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(deletingMediaNode),
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      const pos = getNodePos(pluginState, deletingMediaNodeId);
      pluginState.handleMediaNodeRemoval(
        deletingMediaNode(editorView.state.schema),
        () => pos,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'bar',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
      editorView.destroy();
      pluginState.destroy();
    });
  });

  describe('removeSelectedMediaNode', () => {
    describe('when selection is a media node', () => {
      it('removes node', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { editorView, pluginState } = editor(
          doc(mediaGroup(deletingMediaNode())),
        );
        setNodeSelection(editorView, 1);

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).toEqualDocument(doc(p()));
        editorView.destroy();
        pluginState.destroy();
      });

      it('returns true', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { editorView, pluginState } = editor(
          doc(mediaGroup(deletingMediaNode())),
        );
        setNodeSelection(editorView, 1);

        expect(pluginState.removeSelectedMediaNode()).toBe(true);
        editorView.destroy();
        pluginState.destroy();
      });
    });

    describe('when selection is a non media node', () => {
      it('does not remove media node', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { editorView, pluginState } = editor(
          doc(hr(), mediaGroup(deletingMediaNode())),
        );
        setNodeSelection(editorView, 1);

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).toEqualDocument(
          doc(hr(), mediaGroup(deletingMediaNode())),
        );
        editorView.destroy();
        pluginState.destroy();
      });

      it('returns false', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { editorView, pluginState } = editor(
          doc(hr(), mediaGroup(deletingMediaNode())),
        );
        setNodeSelection(editorView, 1);

        expect(pluginState.removeSelectedMediaNode()).toBe(false);
        editorView.destroy();
        pluginState.destroy();
      });
    });

    describe('when selection is text', () => {
      it('does not remove media node', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { editorView, pluginState } = editor(
          doc(p('hello{<>}'), mediaGroup(deletingMediaNode())),
        );

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).toEqualDocument(
          doc(p('hello'), mediaGroup(deletingMediaNode())),
        );
        editorView.destroy();
        pluginState.destroy();
      });

      it('returns false', () => {
        const deletingMediaNode = media({
          id: 'media',
          type: 'file',
          collection: testCollectionName,
        });
        const { pluginState } = editor(
          doc(p('hello{<>}'), mediaGroup(deletingMediaNode())),
        );

        expect(pluginState.removeSelectedMediaNode()).toBe(false);
        pluginState.destroy();
      });
    });
  });

  it('should focus the editor after files are added to the document', async () => {
    const { editorView, pluginState } = editor(doc(p('')));
    await waitForMediaPickerReady(pluginState);

    const spy = jest.spyOn(editorView, 'focus');

    pluginState.insertFiles([{ id: 'foo' }]);
    expect(spy).toHaveBeenCalled();

    pluginState.insertFiles([{ id: 'bar' }]);
    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaGroup(
          media({
            id: 'bar',
            __key: 'bar',
            type: 'file',
            collection: testCollectionName,
          })(),
          media({
            id: 'foo',
            __key: 'foo',
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );
    spy.mockRestore();
    editorView.destroy();
    pluginState.destroy();
  });

  it('should copy optional attributes from MediaState to Node attrs', () => {
    const { editorView, pluginState } = editor(doc(p('{<>}')));
    const collectionFromProvider = jest.spyOn(
      pluginState,
      'collectionFromProvider' as any,
    );
    collectionFromProvider.mockImplementation(() => testCollectionName);

    pluginState.insertFiles([
      {
        id: temporaryFileId,
        status: 'uploading',
        fileName: 'foo.png',
        fileSize: 1234,
        fileMimeType: 'pdf',
      },
    ]);

    expect(editorView.state.doc).toEqualDocument(
      doc(
        mediaGroup(
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileName: 'foo.png',
            __fileSize: 1234,
            __fileMimeType: 'pdf',
          })(),
        ),
        p(),
      ),
    );
    collectionFromProvider.mockRestore();
    editorView.destroy();
    pluginState.destroy();
  });

  describe('detectLinkRangesInSteps', () => {
    const link1 = a({ href: 'www.google.com' })('google');
    const link2 = a({ href: 'www.baidu.com' })('baidu');

    describe('when ignore links flag is set to true', () => {
      it('does not detect any links', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const tr = state.tr.replaceWith(
          sel,
          sel,
          link1(editorView.state.schema).concat(link2(editorView.state.schema)),
        );
        pluginState.ignoreLinks = true;
        pluginState.allowsLinks = true;

        const linksRanges = pluginState.detectLinkRangesInSteps(tr, state);

        expect(linksRanges).toEqual([]);
        editorView.destroy();
        pluginState.destroy();
      });

      it('resets ignore links flag to false', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const tr = state.tr.replaceWith(
          sel,
          sel,
          link1(editorView.state.schema).concat(link2(editorView.state.schema)),
        );
        pluginState.ignoreLinks = true;
        pluginState.allowsLinks = true;

        pluginState.detectLinkRangesInSteps(tr, state);

        expect(pluginState.ignoreLinks).toBe(false);
        editorView.destroy();
        pluginState.destroy();
      });
    });

    describe('when ignore links flag is set to false', () => {
      it('sets ranges with links', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const nodes = link1(editorView.state.schema).concat(
          link2(editorView.state.schema),
        );
        const tr = state.tr.replaceWith(sel, sel, nodes);
        pluginState.ignoreLinks = false;
        pluginState.allowsLinks = true;

        pluginState.detectLinkRangesInSteps(tr, state);

        expect((pluginState as any).linkRanges).toEqual([
          { href: 'www.google.com', pos: 1 },
          { href: 'www.baidu.com', pos: 'google'.length + 1 },
        ]);
        editorView.destroy();
        pluginState.destroy();
      });
    });
  });

  describe('insertLinks', () => {
    it('creates a link card below linkified text', async () => {
      const href = 'www.google.com';
      const { editorView, pluginState } = editor(doc(p(`${href} {<>}`)));
      const mediaProvider = getFreshMediaProvider();

      // wait until mediaProvider has been set
      const provider = await mediaProvider;
      // wait until mediaProvider's linkCreateContext has been set
      await provider.linkCreateContext;

      provider.linkCreateContext = Promise.resolve(linkCreateContextMock);

      await pluginState.setMediaProvider(Promise.resolve(provider));

      // way to stub private member
      (pluginState as any).linkRanges = [{ href, pos: 1 }];

      // -1 for space, simulate the scenario of autoformatting link
      const linkIds = await pluginState.insertLinks();

      expect(linkIds).toHaveLength(1);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(`${href} `),
          mediaGroup(
            media({
              id: `${linkIds![0]}`,
              type: 'link',
              collection: testCollectionName,
            })(),
          ),
          p(),
        ),
      );
      editorView.destroy();
      pluginState.destroy();
    });
  });

  describe('splitMediaGroup', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: 'media2',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
      const positionOfFirstMediaNode = 2;
      setNodeSelection(editorView, positionOfFirstMediaNode);

      pluginState.splitMediaGroup();

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'media1',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p(),
        ),
      );
      editorView.destroy();
      pluginState.destroy();
    });

    describe('when insert text in the middle of media group', () => {
      it('splits media group', () => {
        const { editorView, pluginState } = editor(
          doc(
            mediaGroup(
              media({
                id: 'media1',
                type: 'file',
                collection: testCollectionName,
              })(),
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        const positionOfFirstMediaNode = 1;
        setNodeSelection(editorView, positionOfFirstMediaNode);

        insertText(editorView, 'hello', 1);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('hello'),
            mediaGroup(
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        editorView.destroy();
        pluginState.destroy();
      });
    });
  });

  describe('ignoreLinks', () => {
    it('should set to true when at the beginning of a link', () => {
      const { pluginState } = editor(
        doc(p(a({ href: 'www.google.com' })('{<>}www.google.com'))),
      );
      expect(pluginState.ignoreLinks).toBe(true);
      pluginState.destroy();
    });

    it('should set to true when at the end of a link', () => {
      const { pluginState } = editor(
        doc(p(a({ href: 'www.google.com' })('www.google.com{<>}'))),
      );
      expect(pluginState.ignoreLinks).toBe(true);
      pluginState.destroy();
    });

    it('should switch from true to false when insert space after a link', () => {
      const { editorView, pluginState, sel } = editor(
        doc(p(a({ href: 'www.google.com' })('www.google.com{<>}'))),
      );
      expect(pluginState.ignoreLinks).toBe(true);
      insertText(editorView, ' ', sel);
      expect(pluginState.ignoreLinks).toBe(false);
      editorView.destroy();
      pluginState.destroy();
    });
  });

  describe('align', () => {
    describe('when there is only one image in the media group', () => {
      describe('when selection is a media node', () => {
        it('changes media group to mediaSingle with layout', () => {
          const { editorView, pluginState } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('hello'),
            ),
          );

          setNodeSelection(editorView, 1);

          pluginState.align('wrap-left');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'wrap-left' })(
                media({
                  id: 'media',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('hello'),
            ),
          );
          editorView.destroy();
          pluginState.destroy();
        });
      });

      describe('when selection is not a media node', () => {
        it('does nothing', () => {
          const { editorView, pluginState } = editor(
            doc(
              mediaGroup(
                media({
                  id: 'media',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('hel{<>}lo'),
            ),
          );

          pluginState.align('wide');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: 'media',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('hello'),
            ),
          );
          editorView.destroy();
          pluginState.destroy();
        });
      });
    });
  });

  describe('Drop Placeholder', () => {
    // Copied from MediaPicker DropZone test spec
    const createDragOverOrLeaveEvent = (
      eventName: 'dragover' | 'dragleave',
      type?: string,
    ) => {
      const event = document.createEvent('Event') as any;
      event.initEvent(eventName, true, true);
      event.preventDefault = () => {};

      event.dataTransfer = {
        types: [type || 'Files'],
        files: [],
        effectAllowed: 'move',
      };

      return event;
    };

    const getWidgetDom = (editorView: EditorView): Node | null =>
      (editorView as any).docView.dom.querySelector('.ProseMirror-widget');

    let dropzoneContainer;

    beforeEach(() => {
      dropzoneContainer = document.createElement('div');
    });

    afterEach(() => {
      dropzoneContainer = undefined;
    });

    it('should show the placeholder at the current position inside paragraph', async () => {
      const { editorView } = editor(
        doc(p('hello{<>} world')),
        {},
        dropzoneContainer,
      );

      const provider = await mediaProvider;
      await provider.uploadContext;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).toBeNull();

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).toBeDefined();
      expect(dragZoneDom!.previousSibling!.textContent).toEqual('hello');
      expect(dragZoneDom!.nextSibling!.textContent).toEqual(' world');

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).toBeNull();
    });

    it('should show the placeholder for code block', async () => {
      const { editorView } = editor(
        doc(code_block()('const foo = undefined;{<>}')),
        {},
        dropzoneContainer,
      );

      const provider = await mediaProvider;
      await provider.uploadContext;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).toBeNull();

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).toBeDefined();
      expect(dragZoneDom!.previousSibling!.textContent).toEqual(
        'const foo = undefined;',
      );
      expect(dragZoneDom!.nextSibling!.textContent).toEqual('');

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).toBeNull();
    });
  });

  describe('element', () => {
    describe('when cursor is on a media node of a single image', () => {
      it('returns dom', () => {
        const { editorView, pluginState } = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                width: 100,
                height: 100,
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        setNodeSelection(editorView, 1);

        expect(pluginState.element).not.toBeUndefined();
        expect(pluginState.element!.className).toBe('wrapper');
      });
    });

    describe('when cursor is on one of the media nodes inside media group', () => {
      it('returns dom', () => {
        const { editorView, pluginState } = editor(
          doc(
            mediaGroup(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
          ),
        );
        setNodeSelection(editorView, 1);

        expect(pluginState.element).toBeUndefined();
      });
    });

    describe('when cursor is not on a media node', () => {
      it('returns undefined', () => {
        const { pluginState } = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('{<>}'),
          ),
        );

        expect(pluginState.element).toBeUndefined();
      });
    });

    describe('when cursor move from a media node to another media node', () => {
      let pluginState;
      let editorView;

      beforeEach(() => {
        const createdEditor = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media1',
                type: 'file',
                collection: testCollectionName,
                width: 100,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: 'media2',
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 100,
              })(),
            ),
            p(''),
          ),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;

        setNodeSelection(editorView, 1);
      });

      it('returns dom', () => {
        setNodeSelection(editorView, 4);

        expect(pluginState.element).not.toBeUndefined();
      });

      it('notified subscriber', () => {
        const subscriber = jest.fn();
        pluginState.subscribe(subscriber);

        setNodeSelection(editorView, 4);

        expect(subscriber).toHaveBeenCalledTimes(2);
      });
    });

    describe('when cursor move to a media node', () => {
      let pluginState;
      let editorView;

      beforeEach(() => {
        const createdEditor = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('{<>}'),
          ),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;
      });

      it('returns dom', () => {
        setNodeSelection(editorView, 1);

        expect(pluginState.element).not.toBeUndefined();
      });

      it('notified subscriber', () => {
        const subscriber = jest.fn();
        pluginState.subscribe(subscriber);

        setNodeSelection(editorView, 1);

        expect(subscriber).toHaveBeenCalledTimes(2);
      });
    });

    describe('when cursor move away from a media node', () => {
      let pluginState;
      let editorView;
      let refs;

      beforeEach(() => {
        const createdEditor = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('{nextPos}'),
          ),
        );

        pluginState = createdEditor.pluginState;
        editorView = createdEditor.editorView;
        refs = createdEditor.refs;

        setNodeSelection(editorView, 1);
      });

      it('returns undefined', () => {
        const { nextPos } = refs;

        setTextSelection(editorView, nextPos);

        expect(pluginState.element).toBeUndefined();
      });

      it('notified subscriber', () => {
        const subscriber = jest.fn();
        pluginState.subscribe(subscriber);
        const { nextPos } = refs;

        setTextSelection(editorView, nextPos);

        expect(subscriber).toHaveBeenCalledTimes(2);
      });
    });

    describe('when element has not been changed', () => {
      it('does not notified subscriber', () => {
        const { pluginState, editorView, refs } = editor(
          doc(
            mediaSingle({ layout: 'wrap-left' })(
              media({
                id: 'media',
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('{<>}hello{nextPos}'),
          ),
        );

        const subscriber = jest.fn();
        pluginState.subscribe(subscriber);
        const { nextPos } = refs;

        setTextSelection(editorView, nextPos);

        expect(subscriber).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('updateLayout', () => {
    it('updates the plugin layout', () => {
      const { pluginState } = editor(
        doc(
          mediaSingle({ layout: 'wrap-left' })(
            media({
              id: 'media',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      pluginState.updateLayout('center');

      expect(pluginState.layout).toBe('center');
    });

    it('notifies subscriber', () => {
      const { pluginState } = editor(
        doc(
          mediaSingle({ layout: 'center' })(
            media({
              id: 'media',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      const subscriber = jest.fn();
      pluginState.subscribe(subscriber);

      pluginState.updateLayout('wrap-right');

      expect(subscriber).toHaveBeenCalledTimes(2);
    });
  });
});

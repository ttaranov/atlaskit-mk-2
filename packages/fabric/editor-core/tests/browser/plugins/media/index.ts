import * as assert from 'assert';
import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { DefaultMediaStateManager } from '@atlaskit/media-core';

import {
  mediaPluginFactory,
  MediaPluginState,
  ProviderFactory,
} from '../../../../src';
import { undo, history } from 'prosemirror-history';
import { EditorView } from 'prosemirror-view';
import {
  chaiPlugin,
  doc,
  h1,
  makeEditor,
  mediaGroup,
  singleImage,
  media,
  p,
  a,
  hr,
  code_block,
  storyMediaProviderFactory,
  randomId,
  sleep,
  insertText,
  getLinkCreateContextMock,
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { setNodeSelection } from '../../../../src/utils';
import { AnalyticsHandler, analyticsService } from '../../../../src/analytics';

chai.use(chaiPlugin);

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const testLinkId = `mock-link-id${randomId()}`;
const linkCreateContextMock = getLinkCreateContextMock(testLinkId);

const getFreshMediaProvider = () => {
  return storyMediaProviderFactory({ collectionName: testCollectionName, stateManager, includeUserAuthProvider: true });
};

describe('Media plugin', () => {
  const mediaProvider = getFreshMediaProvider();
  const temporaryFileId = `temporary:${randomId()}`;

  const providerFactory = new ProviderFactory();
  providerFactory.setProvider('mediaProvider', mediaProvider);

  const editor = (doc: any, uploadErrorHandler?: () => void) => makeEditor<MediaPluginState>({
    doc,
    plugins: [
      ...mediaPluginFactory(defaultSchema, { providerFactory, uploadErrorHandler }),
      history(),
    ],
    schema: defaultSchema
  });

  const getNodePos = (pluginState: MediaPluginState, id: string) => {
    const mediaNodeWithPos = pluginState.findMediaNode(id);
    assert(mediaNodeWithPos, `Media node with id "${id}" has not been mounted yet`);

    return mediaNodeWithPos!.getPos();
  };

  after(() => {
    providerFactory.destroy();
  });

  it('should invoke binary picker when calling insertFileFromDataUrl', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);
    const provider = await mediaProvider;
    await provider.uploadContext;

    expect(pluginState.binaryPicker!).to.be.an('object');

    pluginState.binaryPicker!.upload = sinon.spy();

    pluginState.insertFileFromDataUrl(
      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      'test.gif'
    );

    sinon.assert.calledOnce(pluginState.binaryPicker!.upload as any);
    collectionFromProvider.restore(); pluginState.destroy();
  });

  it('should call uploadErrorHandler on upload error', async () => {
    const handler = sinon.spy();
    const { pluginState } = editor(doc(p(), p('{<>}')), handler);
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);

    await mediaProvider;

    pluginState.insertFile({ id: temporaryFileId, status: 'uploading' });

    stateManager.updateState(temporaryFileId, {
      id: temporaryFileId,
      status: 'error',
      error: {
        name: 'some-error',
        description: 'something went wrong'
      }
    });

    expect(handler.calledOnce).to.eq(true, 'uploadErrorHandler should be called once per failed upload');
    expect(handler.calledWithExactly({
      id: temporaryFileId,
      status: 'error',
      error: {
        name: 'some-error',
        description: 'something went wrong'
      }
    })).to.eq(true, 'uploadErrorHandler should be called with MediaState containing \'error\' status');
    collectionFromProvider.restore(); pluginState.destroy();
  });

  it('should remove failed uploads from the document', async () => {
    const handler = sinon.spy();
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')), handler);
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);

    const provider = await mediaProvider;
    await provider.uploadContext;

    pluginState.insertFile({ id: temporaryFileId, status: 'uploading' });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        mediaGroup(media({ id: temporaryFileId, type: 'file', collection: testCollectionName })),
        p(),
      )
    );

    stateManager.updateState(temporaryFileId, {
      id: temporaryFileId,
      status: 'error'
    });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        p()
      )
    );
    collectionFromProvider.restore(); editorView.destroy(); pluginState.destroy();
  });

  it('should cancel in-flight uploads after media item is removed from document', async () => {
    const spy = sinon.spy();
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')), spy);
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);
    const firstTemporaryFileId = `temporary:first`;
    const secondTemporaryFileId = `temporary:second`;
    const thirdTemporaryFileId = `temporary:third`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;

    pluginState.insertFile({ id: firstTemporaryFileId, status: 'uploading' });
    pluginState.insertFile({ id: secondTemporaryFileId, status: 'uploading' });
    pluginState.insertFile({ id: thirdTemporaryFileId, status: 'uploading' });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        mediaGroup(
          media({ id: thirdTemporaryFileId, type: 'file', collection: testCollectionName }),
          media({ id: secondTemporaryFileId, type: 'file', collection: testCollectionName }),
          media({ id: firstTemporaryFileId, type: 'file', collection: testCollectionName }),
        ),
        p(),
      )
    );

    stateManager.updateState(firstTemporaryFileId, {
      id: firstTemporaryFileId,
      status: 'uploading'
    });

    stateManager.updateState(secondTemporaryFileId, {
      id: secondTemporaryFileId,
      status: 'processing'
    });

    stateManager.subscribe(firstTemporaryFileId, spy);
    stateManager.subscribe(secondTemporaryFileId, spy);
    stateManager.subscribe(thirdTemporaryFileId, spy);

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

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        mediaGroup(
          media({ id: thirdTemporaryFileId, type: 'file', collection: testCollectionName }),
        ),
        p(),
      )
    );

    expect(spy.callCount).to.eq(2, 'State Manager should receive "cancelled" status');

    expect(spy.calledWithExactly({
      id: firstTemporaryFileId,
      status: 'cancelled'
    })).to.eq(true, 'State Manager should emit "cancelled" status');

    expect(spy.calledWithExactly({
      id: secondTemporaryFileId,
      status: 'cancelled'
    })).to.eq(true, 'State Manager should emit "cancelled" status');
    collectionFromProvider.restore(); editorView.destroy(); pluginState.destroy();
  });

  it('should not revert to temporary media nodes after upload finished and we undo', async () => {
    const { editorView, pluginState } = editor(doc(p(), p('{<>}')));
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);
    const tempFileId = `temporary:${randomId()}`;
    const publicFileId = `${randomId()}`;

    // wait until mediaProvider has been set
    const provider = await mediaProvider;
    // wait until mediaProvider's uploadContext has been set
    await provider.uploadContext;

    pluginState.insertFile({ id: tempFileId, status: 'uploading' });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        mediaGroup(
          media({ id: tempFileId, type: 'file', collection: testCollectionName }),
        ),
        p(),
      )
    );

    stateManager.updateState(tempFileId, {
      id: tempFileId,
      status: 'uploading'
    });

    // mark the upload as finished, triggering replacement of media node
    stateManager.updateState(tempFileId, {
      id: tempFileId,
      publicId: publicFileId,
      status: 'ready'
    });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        mediaGroup(
          media({ id: publicFileId, type: 'file', collection: testCollectionName }),
        ),
        p(),
      )
    );

    // undo last change
    expect(undo(editorView.state, editorView.dispatch)).to.equal(true);

    expect(editorView.state.doc).to.deep.equal(
      doc(
        p(),
        // the second paragraph is a side effect of PM history snapshots merging
        p(),
      )
    );
    collectionFromProvider.restore(); editorView.destroy(); pluginState.destroy();
  });

  it('should set new pickers exactly when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers).to.have.length(0);

    const mediaProvider1 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider1);
    const mediaProvider2 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider2);

    const resolvedMediaProvider1 = await mediaProvider1;
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider1.uploadContext;
    await resolvedMediaProvider2.uploadContext;

    expect(pluginState.pickers).to.have.length(4);
  });

  it('should re-use old pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers).to.have.length(0);

    const mediaProvider1 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider1);
    const resolvedMediaProvider1 = await mediaProvider1;
    await resolvedMediaProvider1.uploadContext;
    const pickersAfterMediaProvider1 = pluginState.pickers;
    expect(pickersAfterMediaProvider1).to.have.length(4);

    const mediaProvider2 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider2);
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider2.uploadContext;
    const pickersAfterMediaProvider2 = pluginState.pickers;

    expect(pickersAfterMediaProvider1).to.have.length(pickersAfterMediaProvider2.length);
    for (let i = 0; i < pickersAfterMediaProvider1.length; i++) {
      expect(pickersAfterMediaProvider1[i]).to.equal(pickersAfterMediaProvider2[i]);
    }
  });

  it('should set new upload params for existing pickers when new media provider is set', async () => {
    const { pluginState } = editor(doc(h1('text{<>}')));
    expect(pluginState.pickers).to.have.length(0);

    const mediaProvider1 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider1);
    const resolvedMediaProvider1 = await mediaProvider1;
    await resolvedMediaProvider1.uploadContext;

    pluginState.pickers.forEach(picker => {
      picker.setUploadParams = sinon.spy();
    });

    const mediaProvider2 = getFreshMediaProvider();
    pluginState.setMediaProvider(mediaProvider2);
    const resolvedMediaProvider2 = await mediaProvider2;
    await resolvedMediaProvider2.uploadContext;

    pluginState.pickers.forEach(picker => {
      expect((picker.setUploadParams as any).calledOnce).to.equal(true);
    });
  });

  it('should trigger analytics events for picking', async () => {
    const { pluginState } = editor(doc(p('{<>}')));
    const spy = sinon.spy();
    analyticsService.handler = (spy as AnalyticsHandler);

    afterEach(() => {
      analyticsService.handler = null;
    });

    const provider = await mediaProvider;
    await provider.uploadContext;

    expect(pluginState.binaryPicker!).to.be.an('object');

    const testFileData = {
      file: {
        id: 'test',
        name: 'test.png',
        size: 1,
        type: 'file/test'
      }
    };

    // Warning: calling private methods below
    (pluginState as any).dropzonePicker!.handleUploadStart(testFileData);
    expect(spy.calledWithExactly('atlassian.editor.media.file.drop', { fileMimeType: 'file/test' })).to.eq(true);

    (pluginState as any).clipboardPicker!.handleUploadStart(testFileData);
    expect(spy.calledWithExactly('atlassian.editor.media.file.paste', { fileMimeType: 'file/test' })).to.eq(true);

    (pluginState as any).popupPicker!.handleUploadStart(testFileData);
    expect(spy.calledWithExactly('atlassian.editor.media.file.popup', { fileMimeType: 'file/test' })).to.eq(true);

    (pluginState as any).binaryPicker!.handleUploadStart(testFileData);
    expect(spy.calledWithExactly('atlassian.editor.media.file.binary', { fileMimeType: 'file/test' })).to.eq(true);
  });


  describe('handleMediaNodeRemove', () => {
    it('removes media node', () => {
      const deletingMediaNodeId = 'foo';
      const deletingMediaNode = media({ id: deletingMediaNodeId, type: 'file', collection: testCollectionName });
      const { editorView, pluginState } = editor(
        doc(
          mediaGroup(deletingMediaNode),
          mediaGroup(media({ id: 'bar', type: 'file', collection: testCollectionName })),
        ),
      );

      const pos = getNodePos(pluginState, deletingMediaNodeId);
      pluginState.handleMediaNodeRemoval(deletingMediaNode, () => pos);

      expect(editorView.state.doc).to.deep.equal(
        doc(
          mediaGroup(media({ id: 'bar', type: 'file', collection: testCollectionName })
          )
        ));
      editorView.destroy(); pluginState.destroy();
    });
  });

  describe('removeSelectedMediaNode', () => {
    context('when selection is a media node', () => {
      it('removes node', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { editorView, pluginState } = editor(doc(mediaGroup(deletingMediaNode)));
        setNodeSelection(editorView, 1);

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).to.deep.equal(doc(p()));
        editorView.destroy(); pluginState.destroy();
      });

      it('returns true', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { editorView, pluginState } = editor(doc(mediaGroup(deletingMediaNode)));
        setNodeSelection(editorView, 1);

        expect(pluginState.removeSelectedMediaNode()).to.equal(true);
        editorView.destroy(); pluginState.destroy();
      });
    });

    context('when selection is a non media node', () => {
      it('does not remove media node', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { editorView, pluginState } = editor(doc(hr, mediaGroup(deletingMediaNode)));
        setNodeSelection(editorView, 1);

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).to.deep.equal(doc(hr, mediaGroup(deletingMediaNode)));
        editorView.destroy(); pluginState.destroy();
      });

      it('returns false', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { editorView, pluginState } = editor(doc(hr, mediaGroup(deletingMediaNode)));
        setNodeSelection(editorView, 1);

        expect(pluginState.removeSelectedMediaNode()).to.equal(false);
        editorView.destroy(); pluginState.destroy();
      });
    });

    context('when selection is text', () => {
      it('does not remove media node', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { editorView, pluginState } = editor(doc('hello{<>}', mediaGroup(deletingMediaNode)));

        pluginState.removeSelectedMediaNode();

        expect(editorView.state.doc).to.deep.equal(doc('hello', mediaGroup(deletingMediaNode)));
        editorView.destroy(); pluginState.destroy();
      });

      it('returns false', () => {
        const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
        const { pluginState } = editor(doc('hello{<>}', mediaGroup(deletingMediaNode)));

        expect(pluginState.removeSelectedMediaNode()).to.equal(false);
        pluginState.destroy();
      });
    });
  });


  it('should focus the editor after files are added to the document', async () => {
    const { editorView, pluginState } = editor(doc(p('')));
    await mediaProvider;

    pluginState.insertFile({ id: 'foo' });
    expect(editorView.hasFocus()).to.be.equal(true);

    pluginState.insertFile({ id: 'bar' });
    expect(editorView.state.doc).to.deep.equal(
      doc(
        mediaGroup(
          media({ id: 'bar', type: 'file', collection: testCollectionName }),
          media({ id: 'foo', type: 'file', collection: testCollectionName }),
        ),
        p(),
      ),
    );
    editorView.destroy(); pluginState.destroy();
  });

  it(`should copy optional attributes from MediaState to Node attrs`, () => {
    const { editorView, pluginState } = editor(doc(p('{<>}')));
    const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);

    pluginState.insertFile({
      id: temporaryFileId, status: 'uploading', fileName: 'foo.png', fileSize: 1234, fileMimeType: 'image/png'
    });

    expect(editorView.state.doc).to.deep.equal(
      doc(
        mediaGroup(
          media({
            id: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileName: 'foo.png',
            __fileSize: 1234,
            __fileMimeType: 'image/png'
          }),
        ),
        p(),
      ),
    );
    collectionFromProvider.restore(); editorView.destroy(); pluginState.destroy();
  });


  describe('detectLinkRangesInSteps', () => {
    const link1 = a({ href: 'www.google.com' })('google');
    const link2 = a({ href: 'www.baidu.com' })('baidu');

    context('when ignore links flag is set to true', () => {
      it('does not detect any links', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const tr = state.tr.replaceWith(sel, sel, link1.concat(link2));
        pluginState.ignoreLinks = true;
        pluginState.allowsLinks = true;

        const linksRanges = pluginState.detectLinkRangesInSteps(tr, state);

        expect(linksRanges).to.deep.equal([]);
        editorView.destroy(); pluginState.destroy();
      });

      it('resets ignore links flag to false', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const tr = state.tr.replaceWith(sel, sel, link1.concat(link2));
        pluginState.ignoreLinks = true;
        pluginState.allowsLinks = true;

        pluginState.detectLinkRangesInSteps(tr, state);

        expect(pluginState.ignoreLinks).to.equal(false);
        editorView.destroy(); pluginState.destroy();
      });
    });

    context('when ignore links flag is set to false', () => {
      it('sets ranges with links', () => {
        const { editorView, pluginState, sel } = editor(doc(p('{<>}')));
        const { state } = editorView;
        const nodes = link1.concat(link2);
        const tr = state.tr.replaceWith(sel, sel, nodes);
        pluginState.ignoreLinks = false;
        pluginState.allowsLinks = true;

        pluginState.detectLinkRangesInSteps(tr, state);

        expect((pluginState as any).linkRanges).to.deep.equal([
          { href: 'www.google.com', pos: 1 },
          { href: 'www.baidu.com', pos: 'google'.length + 1 },
        ]);
        editorView.destroy(); pluginState.destroy();
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

      expect(linkIds).to.have.lengthOf(1);

      expect(editorView.state.doc).to.deep.equal(doc(
        p(`${href} `),
        mediaGroup(media({ id: `${linkIds![0]}`, type: 'link', collection: testCollectionName })),
        p(),
      ));
      editorView.destroy(); pluginState.destroy();
    });
  });

  describe('splitMediaGroup', () => {
    it('splits media group', () => {
      const { editorView, pluginState } = editor(doc(
        mediaGroup(
          media({ id: 'media1', type: 'file', collection: testCollectionName }),
          media({ id: 'media2', type: 'file', collection: testCollectionName }),
        ),
      ));
      const positionOfFirstMediaNode = 2;
      setNodeSelection(editorView, positionOfFirstMediaNode);

      pluginState.splitMediaGroup();

      expect(editorView.state.doc).to.deep.equal(doc(
        mediaGroup(
          media({ id: 'media1', type: 'file', collection: testCollectionName }),
        )
      ));
      editorView.destroy(); pluginState.destroy();
    });

    context('when insert text in the middle of media group', () => {
      it('splits media group', () => {
        const { editorView, pluginState } = editor(doc(
          mediaGroup(
            media({ id: 'media1', type: 'file', collection: testCollectionName }),
            media({ id: 'media2', type: 'file', collection: testCollectionName }),
          ),
        ));
        const positionOfFirstMediaNode = 1;
        setNodeSelection(editorView, positionOfFirstMediaNode);

        insertText(editorView, 'hello', 1);

        expect(editorView.state.doc).to.deep.equal(doc(
          p('hello'),
          mediaGroup(
            media({ id: 'media2', type: 'file', collection: testCollectionName }),
          )
        ));
        editorView.destroy(); pluginState.destroy();
      });
    });
  });

  describe('ignoreLinks', () => {
    it('should set to true when at the beginning of a link', () => {
      const { pluginState } = editor(doc(p(a({ href: 'www.google.com' })('{<>}www.google.com'))));
      expect(pluginState.ignoreLinks).to.equal(true);
      pluginState.destroy();
    });

    it('should set to true when at the end of a link', () => {
      const { pluginState } = editor(doc(p(a({ href: 'www.google.com' })('www.google.com{<>}'))));
      expect(pluginState.ignoreLinks).to.equal(true);
      pluginState.destroy();
    });

    it('should switch from true to false when insert space after a link', () => {
      const { editorView, pluginState, sel } = editor(doc(p(a({ href: 'www.google.com' })('www.google.com{<>}'))));
      expect(pluginState.ignoreLinks).to.equal(true);
      insertText(editorView, ' ', sel);
      expect(pluginState.ignoreLinks).to.equal(false);
      editorView.destroy(); pluginState.destroy();
    });
  });

  describe('align', () => {
    context('when there is only one image in the media group', () => {
      context('when selection is a media node', () => {
        it('changes media group to single image with layout', () => {
          const { editorView, pluginState } = editor(doc(
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('hello')
          ));

          setNodeSelection(editorView, 1);

          pluginState.align('left', 'inline-block');

          expect(editorView.state.doc).to.deep.equal(doc(
            singleImage({ alignment: 'left', display: 'inline-block' })(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('hello')
          ));
          editorView.destroy(); pluginState.destroy();
        });
      });

      context('when selection is not a media node', () => {
        it('does nothing', () => {
          const { editorView, pluginState } = editor(doc(
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('hel{<>}lo')
          ));

          pluginState.align('right', 'block');

          expect(editorView.state.doc).to.deep.equal(doc(
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('hello')
          ));
          editorView.destroy(); pluginState.destroy();
        });
      });
    });
  });

  describe('Drop Placeholder', () => {
    // Copied from MediaPicker DropZone test spec
    const createDragOverOrLeaveEvent = (eventName: 'dragover' | 'dragleave', type?: string) => {
      const event = document.createEvent('Event') as any;
      event.initEvent(eventName, true, true);
      event.preventDefault = () => {};
      if (eventName === 'dragover') {
        event.dataTransfer = {
          types: [type || 'Files'],
          files: [],
          effectAllowed: 'move'
        };
      }
      return event;
    };

    const getWidgetDom = (editorView: EditorView): Node | null =>
      (editorView as any).docView.dom.querySelector('.ProseMirror-widget');

    let dropzoneContainer;
    let mediaProvider;

    beforeEach(() => {
      dropzoneContainer = document.createElement('div');
      mediaProvider = storyMediaProviderFactory({ stateManager, dropzoneContainer });
      providerFactory.setProvider('mediaProvider', mediaProvider);
    });

    afterEach(() => {
      dropzoneContainer = undefined;
    });

    it('should show the placeholder at the current position inside paragraph', async () => {
      const { editorView } = editor(doc(p('hello{<>} world')));

      const provider = await mediaProvider;
      await provider.uploadContext;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).to.equal(null);

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).to.not.equal(null);
      expect(dragZoneDom!.previousSibling!.textContent).to.equal('hello');
      expect(dragZoneDom!.nextSibling!.textContent).to.equal(' world');

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).to.equal(null);
    });

    it('should show the placeholder for code block', async () => {
      const { editorView } = editor(doc(code_block()('const foo = undefined;{<>}')));

      const provider = await mediaProvider;
      await provider.uploadContext;
      // MediaPicker DropZone bind events inside a `whenDomReady`, so we have to wait for the next tick
      await sleep(0);
      expect(getWidgetDom(editorView)).to.equal(null);

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragover'));
      const dragZoneDom = getWidgetDom(editorView);
      expect(dragZoneDom).to.not.equal(null);
      expect(dragZoneDom!.previousSibling!.textContent).to.equal('const foo = undefined;');
      expect(dragZoneDom!.nextSibling!.textContent).to.equal('');

      dropzoneContainer.dispatchEvent(createDragOverOrLeaveEvent('dragleave'));
      // MediaPicker DropZone has a 50ms timeout on dragleave event, so we have to wait for at least 50ms
      await sleep(50);
      expect(getWidgetDom(editorView)).to.equal(null);
    });
  });
});

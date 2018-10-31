import {
  doc,
  p,
  mediaSingle,
  media,
  randomId,
  createEditor,
} from '@atlaskit/editor-test-helpers';

import {
  insertMediaSingleNode,
  insertMediaAsMediaSingle,
} from '../../../../plugins/media/utils/media-single';
import { MediaState } from '../../../../plugins/media/pm-plugins/main';
import mediaPlugin from '../../../../plugins/media';

const createMediaState = (
  id: string,
  width = 100,
  height = 200,
): MediaState => ({
  id,
  status: 'preview',
  dimensions: { width, height },
  fileId: Promise.resolve('hello'),
});

describe('media-single', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorPlugins: [mediaPlugin({ allowMediaSingle: true })],
    });

  describe('insertMediaAsMediaSingle', () => {
    describe('when inserting node that is not a media node', () => {
      it('does not insert mediaSingle', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        insertMediaAsMediaSingle(
          editorView,
          p('world')(editorView.state.schema),
        );

        expect(editorView.state.doc).toEqualDocument(doc(p('text')));
      });
    });

    describe('when inserting node is a media node', () => {
      describe('when media node is not an image', () => {
        it('does not insert mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsMediaSingle(
            editorView,
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'pdf',
            })()(editorView.state.schema),
          );

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });

      describe('when media node is an image', () => {
        it('inserts mediaSingle', () => {
          const { editorView } = editor(doc(p('text{<>}')));
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

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
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
    });
  });

  describe('insertMediaSingleNode', () => {
    describe('when there is only one image data', () => {
      it('inserts one mediaSingle node into the document', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertMediaSingleNode(
          editorView,
          createMediaState(temporaryFileId),
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 200,
              })(),
            ),
            p(),
          ),
        );
      });
    });

    describe("when there are multiple images' data", () => {
      it('inserts multiple mediaSingle nodes into the document', () => {
        const { editorView } = editor(doc(p('text{<>}hello')));

        ([
          createMediaState(temporaryFileId),
          createMediaState(temporaryFileId + '1'),
          createMediaState(temporaryFileId + '2'),
        ] as Array<MediaState>).forEach(state =>
          insertMediaSingleNode(editorView, state, testCollectionName),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 200,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '1',
                __key: temporaryFileId + '1',
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 200,
              })(),
            ),
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId + '2',
                __key: temporaryFileId + '2',
                type: 'file',
                collection: testCollectionName,
                width: 100,
                height: 200,
              })(),
            ),
            p('hello'),
          ),
        );
      });
    });

    describe('when current selection not empty', () => {
      describe('at the beginning of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('{<}text{>}')));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  width: 100,
                  height: 200,
                })(),
              ),
              p(),
            ),
          );
        });
      });

      describe('at the middle of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('hello'), p('{<}text{>}'), p()));

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  width: 100,
                  height: 200,
                })(),
              ),
              p(''),
            ),
          );
        });
      });

      describe('at the end of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(
            doc(p('hello'), p('world'), p('{<}text{>}')),
          );

          insertMediaSingleNode(
            editorView,
            createMediaState(temporaryFileId),
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              p('world'),
              mediaSingle({ layout: 'center' })(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  width: 100,
                  height: 200,
                })(),
              ),
              p(''),
            ),
          );
        });
      });
    });

    it('should respect scaleFactor', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaSingleNode(
        editorView,
        { ...createMediaState(temporaryFileId), scaleFactor: 2 },
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
          mediaSingle({ layout: 'center' })(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              width: 50,
              height: 100,
            })(),
          ),
          p(),
        ),
      );
    });
  });

  it('should be able to show mediaSingle without height or width', () => {
    const { editorView } = editor(
      doc(
        p('text'),
        mediaSingle()(
          media({
            id: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        ),
        p(),
      ),
    );

    const mediaSingleDom = editorView.dom.querySelector('.media-single');
    expect(mediaSingleDom).toBeInstanceOf(HTMLElement);
    expect(mediaSingleDom!.getAttribute('width')).toBe('250');
    expect(mediaSingleDom!.getAttribute('height')).toBe('200');
  });
});

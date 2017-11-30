import {
  textAlign,
  float,
  clear,
  insertSingleImageNodes,
  insertMediaAsSingleImage,
} from '../../../src/plugins/media/single-image';
import {
  doc,
  p,
  singleImage,
  media,
  randomId,
  defaultSchema,
  makeEditor,
} from '@atlaskit/editor-test-helpers';
import { MediaPluginState } from '../../../src';

describe('single-image', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    makeEditor<MediaPluginState>({
      doc,
      schema: defaultSchema,
    });

  describe('textAlign', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });

      describe('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns right', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('right');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns center', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('center');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).toBe('left');
        });
      });
    });
  });

  describe('float', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = float(alignment, display);

          expect(result).toBe('right');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).toBe('none');
        });
      });

      describe('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).toBe('left');
        });
      });
    });
  });

  describe('clear', () => {
    describe('when node alignment property is left', () => {
      const alignment = 'left';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = clear(alignment, display);

          expect(result).toBe('left');
        });
      });
    });

    describe('when node alignment property is right', () => {
      const alignment = 'right';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = clear(alignment, display);

          expect(result).toBe('right');
        });
      });
    });

    describe('when node alignment property is center', () => {
      const alignment = 'center';

      describe('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });

      describe('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).toBe('both');
        });
      });
    });
  });

  describe('insertMediaAsSingleImage', () => {
    describe('when inserting node that is not a media node', () => {
      it('does not insert single image', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        insertMediaAsSingleImage(editorView, p('world'));

        expect(editorView.state.doc).toEqualDocument(doc(p('text')));
      });
    });

    describe('when inserting node is a media node', () => {
      describe('when media node is not an image', () => {
        it('does not insert single image', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsSingleImage(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'pdf',
            }),
          );

          expect(editorView.state.doc).toEqualDocument(doc(p('text')));
        });
      });

      describe('when media node is an image', () => {
        it('inserts single image', () => {
          const { editorView } = editor(doc(p('text{<>}')));
          insertMediaAsSingleImage(
            editorView,
            media({
              id: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
            }),
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
              singleImage({ alignment: 'center', display: 'block' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                  __fileMimeType: 'image/png',
                }),
              ),
              p(),
            ),
          );
        });
      });
    });
  });

  describe('insertSingleImageNodes', () => {
    describe('when there is only one image data', () => {
      it('inserts one single image node into the document', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertSingleImageNodes(
          editorView,
          [{ id: temporaryFileId, status: 'uploading' }],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            singleImage({ alignment: 'center', display: 'block' })(
              media({
                id: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              }),
            ),
            p(),
          ),
        );
      });
    });

    describe("when there are multiple images' data", () => {
      it('inserts multiple single image nodes into the document', () => {
        const { editorView } = editor(doc(p('text{<>}hello')));

        insertSingleImageNodes(
          editorView,
          [
            { id: temporaryFileId, status: 'uploading' },
            { id: temporaryFileId + '1', status: 'uploading' },
            { id: temporaryFileId + '2', status: 'uploading' },
          ],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('text'),
            singleImage({ alignment: 'center', display: 'block' })(
              media({
                id: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              }),
            ),
            singleImage({ alignment: 'center', display: 'block' })(
              media({
                id: temporaryFileId + '1',
                type: 'file',
                collection: testCollectionName,
              }),
            ),
            singleImage({ alignment: 'center', display: 'block' })(
              media({
                id: temporaryFileId + '2',
                type: 'file',
                collection: testCollectionName,
              }),
            ),
            p('hello'),
          ),
        );
      });
    });

    describe('when current selection not empty', () => {
      describe('at the begining of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('{<}text{>}')));

          insertSingleImageNodes(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              singleImage({ alignment: 'center', display: 'block' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                }),
              ),
              p(),
            ),
          );
        });
      });

      describe('at the middle of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('hello'), p('{<}text{>}'), p()));

          insertSingleImageNodes(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              singleImage({ alignment: 'center', display: 'block' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                }),
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

          insertSingleImageNodes(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('hello'),
              p('world'),
              singleImage({ alignment: 'center', display: 'block' })(
                media({
                  id: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                }),
              ),
              p(''),
            ),
          );
        });
      });
    });
  });
});

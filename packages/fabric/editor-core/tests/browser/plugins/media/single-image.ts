import { expect } from 'chai';
import {
  textAlign,
  float,
  clear,
  insertSingleImages,
  insertMediaAsSingleImage,
} from '../../../../src/plugins/media/single-image';
import { MediaPluginState } from '../../../../src';
import {
  doc,
  p,
  singleImage,
  media,
  randomId,
  defaultSchema,
  makeEditor,
} from '@atlaskit/editor-test-helpers';

describe('single-image', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    makeEditor<MediaPluginState>({
      doc,
      schema: defaultSchema,
    });

  describe('textAlign', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });

      context('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns right', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('right');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns center', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('center');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = textAlign(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });
  });

  describe('float', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = float(alignment, display);

          expect(result).to.equal('right');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns none', () => {
          const result = float(alignment, display);

          expect(result).to.equal('none');
        });
      });

      context('and display property is block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = float(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });
  });

  describe('clear', () => {
    context('when node alignment property is left', () => {
      const alignment = 'left';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns left', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('left');
        });
      });
    });

    context('when node alignment property is right', () => {
      const alignment = 'right';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns right', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('right');
        });
      });
    });

    context('when node alignment property is center', () => {
      const alignment = 'center';

      context('and display property is block', () => {
        const display = 'block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });

      context('and display property is inline-block', () => {
        const display = 'inline-block';

        it('returns both', () => {
          const result = clear(alignment, display);

          expect(result).to.equal('both');
        });
      });
    });
  });

  describe('insertMediaAsSingleImage', () => {
    context('when inserting node is not a media node', () => {
      it('does not insert single image', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        insertMediaAsSingleImage(editorView, p('world'));

        expect(editorView.state.doc).to.deep.equal(doc(p('text')));
      });
    });

    context('when inserting node is a media node', () => {
      context('when media node is not an image', () => {
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

          expect(editorView.state.doc).to.deep.equal(doc(p('text')));
        });
      });

      context('when media node is an image', () => {
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

          expect(editorView.state.doc).to.deep.equal(
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

  describe('insertSingleImages', () => {
    context('when there is only one image data', () => {
      it('inserts one single image node into the document', () => {
        const { editorView } = editor(doc(p('text{<>}')));

        insertSingleImages(
          editorView,
          [{ id: temporaryFileId, status: 'uploading' }],
          testCollectionName,
        );

        expect(editorView.state.doc).to.deep.equal(
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

    context("when there are multiple images' data", () => {
      it('inserts multiple single image nodes into the document', () => {
        const { editorView } = editor(doc(p('text{<>}hello')));

        insertSingleImages(
          editorView,
          [
            { id: temporaryFileId, status: 'uploading' },
            { id: temporaryFileId + '1', status: 'uploading' },
            { id: temporaryFileId + '2', status: 'uploading' },
          ],
          testCollectionName,
        );

        expect(editorView.state.doc).to.deep.equal(
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

    context('when current selection not empty', () => {
      context('at the begining of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('{<}text{>}')));

          insertSingleImages(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).to.deep.equal(
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

      context('at the middle of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(doc(p('hello'), p('{<}text{>}'), p()));

          insertSingleImages(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).to.deep.equal(
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

      context('at the end of the doc', () => {
        it('deletes the selection', () => {
          const { editorView } = editor(
            doc(p('hello'), p('world'), p('{<}text{>}')),
          );

          insertSingleImages(
            editorView,
            [{ id: temporaryFileId, status: 'uploading' }],
            testCollectionName,
          );

          expect(editorView.state.doc).to.deep.equal(
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

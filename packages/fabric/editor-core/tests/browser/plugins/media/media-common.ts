import * as chai from 'chai';
import { expect } from 'chai';
import {
  MediaPluginState,
} from '../../../../src';
import {
  chaiPlugin,
  doc,
  makeEditor,
  mediaGroup,
  media,
  p,
  hr,
  mention,
  randomId,
} from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import {
  undo,
  history,
} from 'prosemirror-history';
import {
  NodeSelection,
  TextSelection,
} from 'prosemirror-state';
import { setNodeSelection} from '../../../../src/utils';
import { removeMediaNode, splitMediaGroup } from '../../../../src/plugins/media/media-common';

chai.use(chaiPlugin);

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

describe('media-common', () => {
  const editor = (doc: any, uploadErrorHandler?: () => void) => makeEditor<MediaPluginState>({
    doc,
    plugins: [
      history(),
    ],
    schema: defaultSchema,
  });

  describe('removeMediaNode', () => {
    context('media node is selected', () => {
      const temporaryFileId = `temporary:${randomId()}`;

      context('when it is a temporary file', () => {
        const deletingMediaNodeId = temporaryFileId;
        const deletingMediaNode = media({ id: deletingMediaNodeId, type: 'file', collection: testCollectionName });

        it('removes the media node', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          expect(editorView.state.doc).to.deep.equal(
            doc(
              p('hello'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
              ),
            ));
            editorView.destroy();
        });

        it('is not able to undo', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          undo(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).to.deep.equal(doc(
            p('hello'),
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
            ),
          ));
          editorView.destroy();
        });
      });

      context('when it is uploaded', () => {
        const deletingMediaNodeId = 'media2';
        const deletingMediaNode = media({ id: deletingMediaNodeId, type: 'file', collection: testCollectionName });

        it('removes the media node', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          expect(editorView.state.doc).to.deep.equal(
            doc(
              p('hello'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
              )
            ));
            editorView.destroy();
        });

        it('is able to undo', () => {
          const { editorView, sel } = editor(
            doc(
              p('hello{<>}'),
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                deletingMediaNode,
              ),
            ),
          );
          const positionOfDeletingNode = sel + 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          undo(editorView.state, editorView.dispatch);

          expect(editorView.state.doc).to.deep.equal(doc(
            p('hello'),
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              deletingMediaNode,
            ),
          ));
          editorView.destroy();
        });
      });

      context('when selected node is the first media node', () => {
        context('when it is not at the beginning of the document', () => {
          it('selects the media node to the back', () => {
            const deletingMediaNode = media({ id: 'media1', type: 'file', collection: testCollectionName });
            const { editorView, sel } = editor(doc(
              p('hello{<>}'),
              mediaGroup(
                deletingMediaNode,
                media({ id: 'media2', type: 'file', collection: testCollectionName }),
                media({ id: 'media3', type: 'file', collection: testCollectionName }),
              ),
              p('world')
            ));
            const positionOfDeletingNode = sel + 2;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

            expect(editorView.state.selection.from).to.equal(sel);
            editorView.destroy();
          });
        });

        context('when it is at the beginning of the document', () => {
          it('selects the media node to the back', () => {
            const deletingMediaNode = media({ id: 'media1', type: 'file', collection: testCollectionName });
            const { editorView } = editor(doc(
              mediaGroup(
                deletingMediaNode,
                media({ id: 'media2', type: 'file', collection: testCollectionName }),
                media({ id: 'media3', type: 'file', collection: testCollectionName }),
              ),
              p('hello')
            ));
            const positionOfDeletingNode = 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

            const selectedNode = (editorView.state.selection as NodeSelection).node;
            expect(selectedNode && selectedNode.attrs.id).to.equal('media2');
            editorView.destroy();
          });
        });
      });

      context('when selected node is the middle media node', () => {
        it('selects the media node in the front', () => {
          const deletingMediaNode = media({ id: 'media2', type: 'file', collection: testCollectionName });
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              deletingMediaNode,
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            )
          ));
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          const selectedNode = (editorView.state.selection as NodeSelection).node;

          expect(selectedNode && selectedNode.attrs.id).to.equal('media1');
          editorView.destroy();
        });
      });


      context('when selected node and deleting node is not the same node', () => {
        it('does not change selection', () => {
          const deletingMediaNode = media({ id: 'media2', type: 'file', collection: testCollectionName });
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              deletingMediaNode,
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            )
          ));
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode + 1);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          const selectedNode = (editorView.state.selection as NodeSelection).node;

          expect(selectedNode && selectedNode.attrs.id).to.equal('media3');
          editorView.destroy();
        });

        it('removes the node', () => {
          const deletingMediaNode = media({ id: 'media2', type: 'file', collection: testCollectionName });
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              deletingMediaNode,
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            )
          ));
          const positionOfDeletingNode = 2;
          setNodeSelection(editorView, positionOfDeletingNode + 1);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          expect(editorView.state.doc).to.deep.equal(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            )
          ));
          editorView.destroy();
        });
      });

      context('when selected node is the last media node', () => {
        it('selects the media node in the front', () => {
          const deletingMediaNode = media({ id: 'media3', type: 'file', collection: testCollectionName });
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              media({ id: 'media2', type: 'file', collection: testCollectionName }),
              deletingMediaNode,
            )
          ));
          const positionOfDeletingNode = 3;
          setNodeSelection(editorView, positionOfDeletingNode);

          removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

          const selectedNode = (editorView.state.selection as NodeSelection).node;

          expect(selectedNode && selectedNode.attrs.id).to.equal('media2');
          editorView.destroy();
        });
      });

      context('when selected node is the only media node', () => {
        context('when it is not at the beginning of the document', () => {
          it('puts cursor to the beginging of the paragraph that replaced the media group', () => {
            const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
            const { editorView } = editor(doc(
              p('hello'),
              mediaGroup(
                deletingMediaNode,
              ),
              p('world')
            ));

            const positionOfDeletingNode = p('hello').nodeSize + 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

            expect(editorView.state.selection instanceof TextSelection).to.equal(true);
            expect(editorView.state.selection.from).to.equal(positionOfDeletingNode);
            editorView.destroy();
          });
        });

        context('when it is at the beginning of the document', () => {
          it('puts cursor to the beginging of the document', () => {
            const deletingMediaNode = media({ id: 'media', type: 'file', collection: testCollectionName });
            const { editorView } = editor(doc(
              mediaGroup(
                deletingMediaNode,
              ),
              p('hello')
            ));

            const positionOfDeletingNode = 1;
            setNodeSelection(editorView, positionOfDeletingNode);

            removeMediaNode(editorView, deletingMediaNode, () => positionOfDeletingNode);

            expect(editorView.state.selection instanceof TextSelection).to.equal(true);
            expect(editorView.state.selection.from).to.equal(positionOfDeletingNode);
            editorView.destroy();
          });
        });
      });
    });
  });

  describe('splitMediaGroup', () => {
    context('when selection is a media node', () => {
      it('returns true', () => {
        const { editorView } = editor(doc(
          mediaGroup(
            media({ id: 'media', type: 'file', collection: testCollectionName })
          ),
          p('text'),
        ));
        const positionOfFirstMediaNode = 1;
        setNodeSelection(editorView, positionOfFirstMediaNode);

        const result = splitMediaGroup(editorView);

        expect(result).to.equal(true);
        editorView.destroy();
      });

      context('when media node is the first one in media group', () => {
        it('removes the selected media node and insert a new p', () => {
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              media({ id: 'media2', type: 'file', collection: testCollectionName }),
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
          const positionOfFirstMediaNode = 1;
          setNodeSelection(editorView, positionOfFirstMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).to.deep.equal(
            doc(
              p(),
              mediaGroup(
                media({ id: 'media2', type: 'file', collection: testCollectionName }),
                media({ id: 'media3', type: 'file', collection: testCollectionName }),
              ),
              p('text'),
            )
          );
          editorView.destroy();
        });
      });

      context('when media node in the middle of a media group', () => {
        it('removes the selected media node and insert a new p', () => {
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              media({ id: 'media2', type: 'file', collection: testCollectionName }),
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
          const positionOfMiddleMediaNode = 2;
          setNodeSelection(editorView, positionOfMiddleMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).to.deep.equal(
            doc(
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
              ),
              p(),
              mediaGroup(
                media({ id: 'media3', type: 'file', collection: testCollectionName }),
              ),
              p('text'),
            )
          );
          editorView.destroy();
        });
      });

      context('when media node is the last one in the media group', () => {
        it('removes the selected media node', () => {
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media1', type: 'file', collection: testCollectionName }),
              media({ id: 'media2', type: 'file', collection: testCollectionName }),
              media({ id: 'media3', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
          const positionOfLastMediaNode = 3;
          setNodeSelection(editorView, positionOfLastMediaNode);

          splitMediaGroup(editorView);
          expect(editorView.state.doc).to.deep.equal(
            doc(
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                media({ id: 'media2', type: 'file', collection: testCollectionName }),
              ),
              p('text'),
            )
          );

          expect(editorView.state.doc).to.deep.equal(
            doc(
              mediaGroup(
                media({ id: 'media1', type: 'file', collection: testCollectionName }),
                media({ id: 'media2', type: 'file', collection: testCollectionName }),
              ),
              p('text'),
            )
          );
          editorView.destroy();
        });
      });

      context('when media node is the only one in the media group', () => {
        it('removes the whole media group', () => {
          const { editorView } = editor(doc(
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
          const positionOfMiddleMediaNode = 1;
          setNodeSelection(editorView, positionOfMiddleMediaNode);

          splitMediaGroup(editorView);

          expect(editorView.state.doc).to.deep.equal(
            doc(
              p('text'),
            )
          );
          editorView.destroy();
        });
      });

    });

    context('when is text selection', () => {
      it('returns false', () => {
        const { editorView } = editor(doc(
          p('hello{<>}'),
          mediaGroup(
            media({ id: 'media', type: 'file', collection: testCollectionName }),
          ),
          p('text'),
        ));

        const result = splitMediaGroup(editorView);

        expect(result).to.equal(false);
        editorView.destroy();
      });

      it('does nothing', () => {
        const { editorView } = editor(doc(
          p('hello'),
          mediaGroup(
            media({ id: 'media', type: 'file', collection: testCollectionName }),
          ),
          p('te{<>}xt'),
        ));

        splitMediaGroup(editorView);

        expect(editorView.state.doc).to.deep.equal(
          doc(
            p('hello'),
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          )
        );
        editorView.destroy();
      });
    });

    context('when is non media node selection', () => {
      it('returns false', () => {
        const { editorView } = editor(
          doc(
            hr,
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
        setNodeSelection(editorView, 0);

        const result = splitMediaGroup(editorView);

        expect(result).to.equal(false);
        editorView.destroy();
      });

      it('does nothing', () => {
        const { editorView } = editor(
          doc(
            p(
              mention({ id: 'foo1', text: '@bar1' })
            ),
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          ));
        setNodeSelection(editorView, 1);

        splitMediaGroup(editorView);

        expect(editorView.state.doc).to.deep.equal(
          doc(
            p(
              mention({ id: 'foo1', text: '@bar1' })
            ),
            mediaGroup(
              media({ id: 'media', type: 'file', collection: testCollectionName }),
            ),
            p('text'),
          )
        );
        editorView.destroy();
      });
    });
  });
});

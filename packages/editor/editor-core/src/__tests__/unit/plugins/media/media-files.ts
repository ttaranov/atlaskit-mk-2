import {
  doc,
  createEditor,
  mediaGroup,
  media,
  p,
  h1,
  hr,
  mention,
  code_block,
  randomId,
  panel,
} from '@atlaskit/editor-test-helpers';
import { insertMediaGroupNode } from '../../../../plugins/media/utils/media-files';
import { setNodeSelection } from '../../../../utils';
import mediaPlugin from '../../../../plugins/media';
import mentionsPlugin from '../../../../plugins/mentions';
import codeBlockPlugin from '../../../../plugins/code-block';
import rulePlugin from '../../../../plugins/rule';
import { panelPlugin } from '../../../../plugins';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

describe('media-files', () => {
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any, uploadErrorHandler?: () => void) =>
    createEditor({
      doc,
      editorPlugins: [
        mediaPlugin(),
        mentionsPlugin(),
        codeBlockPlugin(),
        rulePlugin,
        panelPlugin,
      ],
    });

  describe('when cursor is at the end of a text block', () => {
    it('inserts media node into the document after current paragraph node', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text'),
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
      editorView.destroy();
    });

    it('puts cursor to the next paragraph after inserting media node', () => {
      const { editorView } = editor(doc(p('text{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      const paragraphNodeSize = p('text')(editorView.state.schema).nodeSize;
      const mediaGroupNodeSize = mediaGroup(
        media({
          id: temporaryFileId,
          __key: temporaryFileId,
          type: 'file',
          collection: testCollectionName,
        })(),
      )(editorView.state.schema).nodeSize;
      expect(editorView.state.selection.from).toEqual(
        paragraphNodeSize + mediaGroupNodeSize + 1,
      );
      editorView.destroy();
    });

    it('should prepend media node to existing media group after it', () => {
      const { editorView } = editor(
        doc(
          p('text{<>}'),
          mediaGroup(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );

      insertMediaGroupNode(
        editorView,
        [{ id: 'mock2', fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p('text{<>}'),
          mediaGroup(
            media({
              id: 'mock2',
              __key: 'mock2',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
        ),
      );
      editorView.destroy();
    });
  });

  describe('when cursor is at the beginning of a text block', () => {
    it('should prepend media node to existing media group before it', () => {
      const { editorView } = editor(
        doc(
          mediaGroup(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p('{<>}text'),
        ),
      );

      insertMediaGroupNode(
        editorView,
        [{ id: 'mock2', fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'mock2',
              __key: 'mock2',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p('text'),
        ),
      );
      editorView.destroy();
    });
  });

  describe('when cursor is in the middle of a text block', () => {
    describe('when inside a paragraph', () => {
      it('splits text', () => {
        const { editorView } = editor(doc(p('te{<>}xt')));

        insertMediaGroupNode(
          editorView,
          [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('te'),
            mediaGroup(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('xt'),
          ),
        );
        editorView.destroy();
      });

      it('moves cursor to the front of later part of the text', () => {
        const { editorView } = editor(doc(p('te{<>}xt')));

        const paragraphNodeSize = p('te')(editorView.state.schema).nodeSize;
        const mediaGroupNodeSize = mediaGroup(
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
          })(),
        )(editorView.state.schema).nodeSize;

        insertMediaGroupNode(
          editorView,
          [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
          testCollectionName,
        );

        expect(editorView.state.selection.from).toEqual(
          paragraphNodeSize + mediaGroupNodeSize + 1,
        );
        editorView.destroy();
      });
    });

    describe('when inside a heading', () => {
      it('preserves heading', () => {
        const { editorView } = editor(doc(h1('te{<>}xt')));

        insertMediaGroupNode(
          editorView,
          [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            h1('te'),
            mediaGroup(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            h1('xt'),
          ),
        );
        editorView.destroy();
      });
    });
  });
  describe('when selection is not empty', () => {
    describe('when selection is a text', () => {
      describe('when selection is in the middle of the text block', () => {
        it('replaces selection with a media node', () => {
          const { editorView } = editor(doc(p('te{<}x{>}t')));

          insertMediaGroupNode(
            editorView,
            [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('te'),
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('t'),
            ),
          );
          editorView.destroy();
        });
      });

      describe('when selection covers the whole text block', () => {
        describe('when there is no existing media group nearby', () => {
          describe('when inside a paragraph', () => {
            it('replaces selection with a media node', () => {
              const { editorView } = editor(doc(p('{<}text{>}')));

              insertMediaGroupNode(
                editorView,
                [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
                testCollectionName,
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
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
              editorView.destroy();
            });
          });

          describe('when inside a heading', () => {
            it('replaces selection with a media node', () => {
              const { editorView } = editor(doc(h1('{<}text{>}')));

              insertMediaGroupNode(
                editorView,
                [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
                testCollectionName,
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  h1(),
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
              editorView.destroy();
            });
          });
        });

        describe('when there is an existing media group nearby', () => {
          it('prepend media to the media group after parent', () => {
            const { editorView } = editor(
              doc(
                mediaGroup(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
                p('{<}text{>}'),
                mediaGroup(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
              ),
            );

            insertMediaGroupNode(
              editorView,
              [{ id: 'new one', fileId: Promise.resolve('id') }],
              testCollectionName,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                mediaGroup(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
                p(),
                mediaGroup(
                  media({
                    id: 'new one',
                    __key: 'new one',
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                  })(),
                ),
              ),
            );
            editorView.destroy();
          });
        });
      });

      describe('when selection is at the end of the text block', () => {
        it('replaces selection with a media node', () => {
          const { editorView } = editor(doc(p('te{<}xt{>}')));

          insertMediaGroupNode(
            editorView,
            [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('te'),
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
          editorView.destroy();
        });

        it('prepends to existing media group after parent', () => {
          const { editorView } = editor(
            doc(
              p('te{<}xt{>}'),
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );

          insertMediaGroupNode(
            editorView,
            [{ id: 'new one', fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('te'),
              mediaGroup(
                media({
                  id: 'new one',
                  __key: 'new one',
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          editorView.destroy();
        });
      });
    });

    describe('when selection is a node', () => {
      describe('when selection is an inline node', () => {
        it('replaces selection with a media node', () => {
          const { editorView, sel } = editor(
            doc(p('text{<>}', mention({ id: 'foo1', text: '@bar1' })())),
          );
          setNodeSelection(editorView, sel);

          insertMediaGroupNode(
            editorView,
            [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              p('text'),
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
          editorView.destroy();
        });
      });

      describe('when selection is a media node', () => {
        it('prepends to the existing media group', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          setNodeSelection(editorView, 1);

          insertMediaGroupNode(
            editorView,
            [{ id: 'new one', fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'new one',
                  __key: 'new one',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          editorView.destroy();
        });

        it('prepends to the existing media group - w/o any following paragraph', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          setNodeSelection(editorView, 1);

          insertMediaGroupNode(
            editorView,
            [{ id: 'new one', fileId: Promise.resolve('id') }],
            testCollectionName,
          );

          expect(editorView.state.doc).toEqualDocument(
            doc(
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
                media({
                  id: 'new one',
                  __key: 'new one',
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
            ),
          );
          editorView.destroy();
        });

        it('sets cursor to the paragraph after', () => {
          const { editorView } = editor(
            doc(
              mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              ),
              p('text'),
            ),
          );
          setNodeSelection(editorView, 1);

          insertMediaGroupNode(
            editorView,
            [{ id: 'new one', fileId: Promise.resolve('id') }],
            testCollectionName,
          );
          const mediaGroupNodeSize = mediaGroup(
            media({
              id: 'new one',
              __key: 'new one',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          )(editorView.state.schema).nodeSize;

          expect(editorView.state.selection.from).toEqual(
            mediaGroupNodeSize + 1,
          );
          editorView.destroy();
        });
      });

      describe('when selection is a non media block node', () => {
        describe('when no existing media group', () => {
          it('append a media node under selected node', () => {
            const { editorView } = editor(doc(hr()));
            setNodeSelection(editorView, 0);

            insertMediaGroupNode(
              editorView,
              [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
              testCollectionName,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                hr(),
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
            editorView.destroy();
          });
        });

        describe('when there are exisiting media group', () => {
          describe('when media group is in the front of selected node', () => {
            it('append media below selected node', () => {
              const { editorView } = editor(
                doc(
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                  hr(),
                ),
              );
              const mediaGroupNodeSize = mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              )(editorView.state.schema).nodeSize;
              setNodeSelection(editorView, mediaGroupNodeSize);

              insertMediaGroupNode(
                editorView,
                [{ id: 'new one', fileId: Promise.resolve('id') }],
                testCollectionName,
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                  hr(),
                  mediaGroup(
                    media({
                      id: 'new one',
                      __key: 'new one',
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                  p(),
                ),
              );
              editorView.destroy();
            });
          });

          describe('when media group is at the end', () => {
            it('prepend media to the exisiting media group after', () => {
              const { editorView } = editor(
                doc(
                  hr(),
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                ),
              );
              setNodeSelection(editorView, 0);

              insertMediaGroupNode(
                editorView,
                [{ id: 'new one', fileId: Promise.resolve('id') }],
                testCollectionName,
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  hr(),
                  mediaGroup(
                    media({
                      id: 'new one',
                      __key: 'new one',
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                ),
              );
              editorView.destroy();
            });
          });

          describe('when both sides have media groups', () => {
            it('prepend media to the exisiting media group after', () => {
              const { editorView } = editor(
                doc(
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                  hr(),
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                ),
              );
              const mediaGroupNodeSize = mediaGroup(
                media({
                  id: temporaryFileId,
                  __key: temporaryFileId,
                  type: 'file',
                  collection: testCollectionName,
                })(),
              )(editorView.state.schema).nodeSize;
              setNodeSelection(editorView, mediaGroupNodeSize);

              insertMediaGroupNode(
                editorView,
                [{ id: 'new one', fileId: Promise.resolve('id') }],
                testCollectionName,
              );

              expect(editorView.state.doc).toEqualDocument(
                doc(
                  mediaGroup(
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                  hr(),
                  mediaGroup(
                    media({
                      id: 'new one',
                      __key: 'new one',
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                    media({
                      id: temporaryFileId,
                      __key: temporaryFileId,
                      type: 'file',
                      collection: testCollectionName,
                    })(),
                  ),
                ),
              );
              editorView.destroy();
            });
          });
        });
      });
    });

    describe('when selection is at the beginning of the text block', () => {
      it('replaces selection with a media node', () => {
        const { editorView } = editor(doc(p('{<}te{>}xt')));

        insertMediaGroupNode(
          editorView,
          [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaGroup(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('xt'),
          ),
        );
        editorView.destroy();
      });

      it('prepends to exisiting media group before parent', () => {
        const { editorView } = editor(
          doc(
            mediaGroup(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('{<}te{>}xt'),
          ),
        );

        insertMediaGroupNode(
          editorView,
          [{ id: 'new one', fileId: Promise.resolve('id') }],
          testCollectionName,
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            mediaGroup(
              media({
                id: 'new one',
                __key: 'new one',
                type: 'file',
                collection: testCollectionName,
              })(),
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
              })(),
            ),
            p('xt'),
          ),
        );
        editorView.destroy();
      });
    });
  });

  it(`should insert media node into the document after current heading node`, () => {
    const { editorView } = editor(doc(h1('text{<>}')));

    insertMediaGroupNode(
      editorView,
      [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
      testCollectionName,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        h1('text'),
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
    editorView.destroy();
  });

  it(`should insert media node into the document after current codeblock node`, () => {
    const { editorView } = editor(doc(code_block()('text{<>}')));

    insertMediaGroupNode(
      editorView,
      [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
      testCollectionName,
    );

    expect(editorView.state.doc).toEqualDocument(
      doc(
        code_block()('text'),
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
    editorView.destroy();
  });

  describe('inside empty block', () => {
    it('replaces empty paragraph with the media grroup in an empty document', () => {
      const { editorView } = editor(doc(p('{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
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
      editorView.destroy();
    });

    it('apends media group to empty paragraph in an empty code block', () => {
      const { editorView } = editor(doc(code_block()('{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          code_block()('{<>}'),
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
      editorView.destroy();
    });

    it('apends media group to empty paragraph in an empty heading', () => {
      const { editorView } = editor(doc(h1('{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          h1('{<>}'),
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
      editorView.destroy();
    });

    it('prepends media to existing media group before the empty paragraph', () => {
      const { editorView } = editor(
        doc(
          mediaGroup(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p('{<>}'),
        ),
      );

      insertMediaGroupNode(
        editorView,
        [{ id: 'another one', fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'another one',
              __key: 'another one',
              type: 'file',
              collection: testCollectionName,
            })(),
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
      editorView.destroy();
    });

    it('should replace empty paragraph with mediaGroup and preserve next empty paragraph', () => {
      const { editorView } = editor(doc(p('{<>}'), p()));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
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
      editorView.destroy();
    });

    it('should replace empty paragraph with mediaGroup and preserve previous empty paragraph', () => {
      const { editorView } = editor(doc(p(), p('{<>}')));

      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );

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
      editorView.destroy();
    });

    it('should insert all media nodes on the same line', async () => {
      const { editorView } = editor(doc(p('{<>}')));

      insertMediaGroupNode(
        editorView,
        [
          { id: 'mock1', fileId: Promise.resolve('id') },
          { id: 'mock2', fileId: Promise.resolve('id') },
        ],
        testCollectionName,
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          mediaGroup(
            media({
              id: 'mock1',
              __key: 'mock1',
              type: 'file',
              collection: testCollectionName,
            })(),
            media({
              id: 'mock2',
              __key: 'mock2',
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p(),
        ),
      );
      editorView.destroy();
    });
  });

  describe('when selections is inside panel', () => {
    it('should append media below panel', () => {
      const panelDoc = doc(panel({})(p('{<>}')));
      const { editorView } = editor(panelDoc);
      insertMediaGroupNode(
        editorView,
        [{ id: temporaryFileId, fileId: Promise.resolve('id') }],
        testCollectionName,
      );
      expect(editorView.state.doc).toEqualDocument(
        doc(
          panel({})(p('')),
          mediaGroup(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
            })(),
          ),
          p(''),
        ),
      );
    });
  });
});

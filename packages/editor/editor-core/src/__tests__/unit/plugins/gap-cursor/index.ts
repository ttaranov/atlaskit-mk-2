import { TextSelection } from 'prosemirror-state';
import {
  doc,
  createEditor,
  p,
  blockquote,
  code_block,
  panel,
  table,
  tr,
  td,
  tdCursor,
  decisionList,
  decisionItem,
  taskList,
  taskItem,
  bodiedExtension,
  hr,
  extension,
  mediaSingle,
  media,
  mediaGroup,
  randomId,
  bodiedExtensionData,
  sendKeyToPm,
  h1,
} from '@atlaskit/editor-test-helpers';

import { setTextSelection } from '../../../../index';
import { setGapCursorSelection } from '../../../../utils';
import gapCursorPlugin, {
  GapCursorSelection,
  Side,
} from '../../../../plugins/gap-cursor';
import { pluginKey } from '../../../../plugins/gap-cursor/pm-plugins/main';
import codeBlockPlugin from '../../../../plugins/code-block';
import rulePlugin from '../../../../plugins/rule';
import panelPlugin from '../../../../plugins/panel';
import tasksAndDecisionsPlugin from '../../../../plugins/tasks-and-decisions';
import tablesPlugin from '../../../../plugins/table';
import extensionPlugin from '../../../../plugins/extension';
import mediaPlugin from '../../../../plugins/media';

const extensionAttrs = bodiedExtensionData[0].attrs;

describe('gap-cursor', () => {
  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorPlugins: [
        gapCursorPlugin,
        mediaPlugin({ allowMediaSingle: true }),
        extensionPlugin,
        tablesPlugin(),
        tasksAndDecisionsPlugin,
        codeBlockPlugin(),
        rulePlugin,
        panelPlugin,
      ],
      editorProps: {
        analyticsHandler: trackEvent,
      },
      pluginKey,
    });

  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;

  const blockNodes = {
    code_block: code_block({ language: 'java' })('{<>}'),
    panel: panel()(p('{<>}')),
    table: table()(tr(tdCursor)),
    decisionList: decisionList({ localId: 'test' })(
      decisionItem({ localId: 'test' })('{<>}'),
    ),
    taskList: taskList({ localId: 'test' })(
      taskItem({ localId: 'test' })('{<>}'),
    ),
    bodiedExtension: bodiedExtension(extensionAttrs)(p('{<>}')),
  };

  const leafBlockNodes = {
    hr: hr(),
    extension: extension(extensionAttrs)(),
    mediaSingle: mediaSingle({ layout: 'center' })(
      media({
        id: temporaryFileId,
        __key: temporaryFileId,
        type: 'file',
        collection: testCollectionName,
        width: 100,
        height: 200,
      })(),
    ),
    mediaGroup: mediaGroup(
      media({
        id: temporaryFileId,
        type: 'link',
        collection: testCollectionName,
      })(),
    ),
  };

  describe('when block nodes do not allow gap cursor', () => {
    it('should not create a GapCursor selection for paragraph', () => {
      const { editorView } = editor(doc(p('{<>}')));
      sendKeyToPm(editorView, 'ArrowLeft');
      expect(editorView.state.selection instanceof TextSelection).toBe(true);
      editorView.destroy();
    });
    it('should not create a GapCursor selection for heading', () => {
      const { editorView } = editor(doc(h1('{<>}')));
      sendKeyToPm(editorView, 'ArrowLeft');
      expect(editorView.state.selection instanceof TextSelection).toBe(true);
      editorView.destroy();
    });
    it('should not create a GapCursor selection for blockquote', () => {
      const { editorView } = editor(doc(blockquote(p('{<>}'))));
      sendKeyToPm(editorView, 'ArrowLeft');
      expect(editorView.state.selection instanceof TextSelection).toBe(true);
      editorView.destroy();
    });
  });

  describe('when block nodes allow gap cursor', () => {
    ['ArrowLeft', 'ArrowRight'].forEach(direction => {
      describe(`when pressing ${direction}`, () => {
        describe('when cursor is inside of a content block node', () => {
          Object.keys(blockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView } = editor(doc(blockNodes[nodeName]));
                sendKeyToPm(editorView, direction);
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);

                const expectedSide =
                  direction === 'ArrowLeft' ? Side.LEFT : Side.RIGHT;
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(expectedSide);
                editorView.destroy();
              });
            });
          });
        });

        describe('when cursor is before or after a leaf block node', () => {
          Object.keys(leafBlockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const content =
                  direction === 'ArrowLeft'
                    ? doc(leafBlockNodes[nodeName], p('{<>}'))
                    : doc(p('{<>}'), leafBlockNodes[nodeName]);

                const { editorView } = editor(content);
                sendKeyToPm(editorView, direction);
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);

                const expectedSide =
                  direction === 'ArrowLeft' ? Side.RIGHT : Side.LEFT;
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(expectedSide);
                editorView.destroy();
              });
            });
          });
        });
      });
      describe('when cursor is after a block node', () => {
        describe(`when pressing Backspace`, () => {
          Object.keys(blockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc(blockNodes[nodeName], '{pos}'),
                );
                setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
                sendKeyToPm(editorView, 'Backspace');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
                editorView.destroy();
              });
            });
          });
          Object.keys(leafBlockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc(leafBlockNodes[nodeName], '{pos}'),
                );
                setGapCursorSelection(editorView, refs.pos, Side.RIGHT);
                sendKeyToPm(editorView, 'Backspace');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
                editorView.destroy();
              });
            });
          });
        });
      });

      describe('when cursor is before a block node', () => {
        describe(`when pressing Delete`, () => {
          Object.keys(blockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc('{pos}', blockNodes[nodeName]),
                );
                setGapCursorSelection(editorView, refs.pos, Side.LEFT);
                sendKeyToPm(editorView, 'Delete');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
                editorView.destroy();
              });
            });
          });
          Object.keys(leafBlockNodes).forEach(nodeName => {
            describe(nodeName, () => {
              it(`should delete the ${nodeName}`, () => {
                const { editorView, refs } = editor(
                  doc('{pos}', leafBlockNodes[nodeName]),
                );
                setGapCursorSelection(editorView, refs.pos, Side.LEFT);
                sendKeyToPm(editorView, 'Delete');

                expect(editorView.state.doc).toEqualDocument(doc(p('')));
                expect(
                  editorView.state.selection instanceof TextSelection,
                ).toBe(true);
                editorView.destroy();
              });
            });
          });
        });
      });
    });
  });

  describe('when inside of a table', () => {
    describe('when cursor is at a cell to the right', () => {
      describe('when pressing ArrowLeft', () => {
        Object.keys(blockNodes).forEach(nodeName => {
          if (!/table|bodiedExtension/.test(nodeName)) {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView } = editor(
                  doc(table()(tr(td()(blockNodes[nodeName]), tdCursor))),
                );
                sendKeyToPm(editorView, 'ArrowLeft');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.RIGHT);
                editorView.destroy();
              });
            });
          }
        });

        Object.keys(leafBlockNodes).forEach(nodeName => {
          describe(nodeName, () => {
            it('should set GapCursorSelection', () => {
              const { editorView } = editor(
                doc(table()(tr(td()(leafBlockNodes[nodeName]), tdCursor))),
              );
              sendKeyToPm(editorView, 'ArrowLeft');
              expect(
                editorView.state.selection instanceof GapCursorSelection,
              ).toBe(true);
              expect(
                (editorView.state.selection as GapCursorSelection).side,
              ).toEqual(Side.RIGHT);
              editorView.destroy();
            });
          });
        });
      });
    });

    describe('when cursor is at a cell to the left', () => {
      describe('when pressing ArrowRight', () => {
        Object.keys(blockNodes).forEach(nodeName => {
          if (!/table|bodiedExtension/.test(nodeName)) {
            describe(nodeName, () => {
              it('should set GapCursorSelection', () => {
                const { editorView, refs } = editor(
                  doc(
                    table()(
                      tr(td()(p('{nextPos}')), td()(blockNodes[nodeName])),
                    ),
                  ),
                );
                const { nextPos } = refs;
                setTextSelection(editorView, nextPos);
                sendKeyToPm(editorView, 'ArrowRight');
                expect(
                  editorView.state.selection instanceof GapCursorSelection,
                ).toBe(true);
                expect(
                  (editorView.state.selection as GapCursorSelection).side,
                ).toEqual(Side.LEFT);
                editorView.destroy();
              });
            });
          }
        });

        Object.keys(leafBlockNodes).forEach(nodeName => {
          describe(nodeName, () => {
            it('should set GapCursorSelection', () => {
              const { editorView, refs } = editor(
                doc(
                  table()(
                    tr(td()(p('{nextPos}')), td()(leafBlockNodes[nodeName])),
                  ),
                ),
              );
              const { nextPos } = refs;
              setTextSelection(editorView, nextPos);
              sendKeyToPm(editorView, 'ArrowRight');
              expect(
                editorView.state.selection instanceof GapCursorSelection,
              ).toBe(true);
              expect(
                (editorView.state.selection as GapCursorSelection).side,
              ).toEqual(Side.LEFT);
              editorView.destroy();
            });
          });
        });
      });
    });
  });
});

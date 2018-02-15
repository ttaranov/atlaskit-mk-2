import { name } from '../../../package.json';
import { Schema } from 'prosemirror-model';
import { Selection, EditorState } from 'prosemirror-state';
import { doc, p, panelNote, createEditor } from '@atlaskit/editor-test-helpers';
import {
  sortByRank,
  fixExcludes,
  createPMPlugins,
  reconfigureState,
} from '../../../src/editor/create-editor/create-editor';
import { defaultSchema } from '@atlaskit/editor-common';

describe(name, () => {
  describe('create-editor', () => {
    describe('#sortByRank', () => {
      it('should correctly sort object with rank property', () => {
        const list = [
          { rank: 10 },
          { rank: 1 },
          { rank: 1000 },
          { rank: 30 },
          { rank: 100 },
          { rank: 40 },
        ];

        const result = [
          { rank: 1 },
          { rank: 10 },
          { rank: 30 },
          { rank: 40 },
          { rank: 100 },
          { rank: 1000 },
        ];

        list.sort(sortByRank);

        expect(list.sort(sortByRank)).toEqual(result);
      });
    });

    describe('#fixExcludes', () => {
      it('should remove all unused marks from exclude', () => {
        const marks = {
          code: {
            excludes: 'textStyle emojiQuery',
            group: 'code',
          },
          em: {
            excludes: 'code',
            group: 'textStyle',
          },
        };
        const result = {
          code: {
            excludes: 'textStyle',
            group: 'code',
          },
          em: {
            excludes: 'code',
            group: 'textStyle',
          },
        };

        expect(fixExcludes(marks)).toEqual(result);
      });
    });

    describe('#createPMPlugins', () => {
      it('should not add plugin if its factory returns falsy value', () => {
        const editorConfig = {
          pmPlugins: [
            { rank: 0, plugin: () => false },
            { rank: 100, plugin: () => true },
          ],
        };
        expect(
          createPMPlugins(
            editorConfig as any,
            {} as any,
            {} as any,
            () => {},
            {} as any,
            {} as any,
          ).length,
        ).toEqual(1);
      });
    });
  });

  describe('onChange', () => {
    it('should call onChange only when document changes', () => {
      const onChange = jest.fn();
      const editor = createEditor({ editorProps: { onChange } });
      const { editorView } = editor;
      editorView.dispatch(editorView.state.tr.insertText('hello'));
      expect(onChange).toHaveBeenCalledTimes(1);
      const { tr } = editorView.state;
      editorView.dispatch(tr.setSelection(Selection.near(tr.doc.resolve(1))));
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('reconfigureState', () => {
    const createSchema = () =>
      new Schema({
        nodes: {
          doc: { content: 'block+' },
          paragraph: { content: 'inline*', group: 'block' },
          text: { group: 'inline' },
        },
        marks: {},
      });

    it('should throw an error if the new schema is not compatible with the old editor state', () => {
      const oldState = EditorState.create({
        doc: doc(panelNote(p('hello world')))(defaultSchema),
      });
      expect(() => reconfigureState(oldState, createSchema())).toThrowError(
        'Unknown node type: panel',
      );
    });

    it('should convert the existing document to use the new schema', () => {
      const schema = createSchema();
      const document = {
        type: 'doc',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'hello!' }] },
        ],
      };
      const oldState = EditorState.create({
        doc: schema.nodeFromJSON(document),
        schema,
      });
      expect(reconfigureState(oldState, defaultSchema).doc).toEqualDocument(
        doc(p('hello!'))(defaultSchema),
      );
    });
  });
});

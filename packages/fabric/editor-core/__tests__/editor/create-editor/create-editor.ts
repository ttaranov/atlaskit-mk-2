import { name } from '../../../package.json';
import { Schema, Node } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import createEditor from '../../_helpers/create-editor';
import { sortByRank, fixExcludes, createPMPlugins, processDefaultDocument } from '../../../src/editor/create-editor/create-editor';

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
          { rank: 40 }
        ];

        const result = [
          { rank: 1 },
          { rank: 10 },
          { rank: 30 },
          { rank: 40 },
          { rank: 100 },
          { rank: 1000 }
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
            group: 'code'
          },
          em: {
            excludes: 'code',
            group: 'textStyle'
          }
        };
        const result  = {
          code: {
            excludes: 'textStyle',
            group: 'code'
          },
          em: {
            excludes: 'code',
            group: 'textStyle'
          }
        };

        expect(fixExcludes(marks)).toEqual(result);
      });
    });

    describe('#createPMPlugins', () => {
      it('should not add plugin if its factory returns falsy value', () => {
        const editorConfig = {
          pmPlugins: [
            { rank: 0, plugin: () => false },
            { rank: 100, plugin: () => true }
          ]
        };
        expect(createPMPlugins(editorConfig as any, {} as any, {} as any, () => {}, {} as any, {} as any).length).toEqual(1);
      });
    });
  });

  describe('#processDefaultDocument', () => {
    let schema: Schema;
    let consoleError: any;

    beforeEach(() => {
      const editor = createEditor();
      schema = editor.editorView.state.schema;
      consoleError = jest.spyOn(console, 'error');
      consoleError.mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it('should return undefined if no default document provided', () => {
      expect(processDefaultDocument(schema, undefined)).toBe(undefined);
    });

    it(`should return undefined if provided document isn't a vaild JSON`, () => {
      expect(processDefaultDocument(schema, '{1:2}')).toBe(undefined);
      expect(consoleError).toHaveBeenCalled();
    });

    it(`should return undefined if provided document is an array`, () => {
      expect(processDefaultDocument(schema, [{ type: 'paragraph' }])).toBe(undefined);
      expect(consoleError).toHaveBeenCalled();
    });

    it(`should return undefined if Node.fomJSON wasn't able to create a Node`, () => {
      expect(processDefaultDocument(schema, {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'taskList',
            content: [
              {
                type: 'taskItem',
                content: [{ type: 'text', text: '213123' }]
              }
            ]
          }
        ]
      })).toBe(undefined);
      expect(consoleError).toHaveBeenCalled();
    });

    it('should return PM Node if a default document is an instance of Node', () => {
      const node = Node.fromJSON(schema, {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'text' }]
          }
        ]
      });
      expect(processDefaultDocument(schema, node)).toEqual(node);
    });

    it('should return PM Node', () => {
      expect(processDefaultDocument(schema, {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'text' }]
          }
        ]
      }) instanceof Node).toBe(true);
    });
  });

  describe('onChange', () => {
    it('should call onChange only when document changes', () => {
      const onChange = jest.fn();
      const editor = createEditor([], { onChange });
      const { editorView } = editor;
      editorView.dispatch(
        editorView.state.tr.insertText('hello')
      );
      expect(onChange).toHaveBeenCalledTimes(1);
      const { tr } = editorView.state;
      editorView.dispatch(
        tr.setSelection(Selection.near(tr.doc.resolve(1)))
      );
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});

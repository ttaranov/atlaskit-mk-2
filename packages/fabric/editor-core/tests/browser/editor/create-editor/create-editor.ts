import { name } from '../../../../package.json';
import { expect } from 'chai';
import { Schema, Node } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';
import createEditor from '../../../helpers/create-editor';
import { sortByRank, fixExcludes, createPMPlugins, processDefaultDocument } from '../../../../src/editor/create-editor/create-editor';
import * as sinon from 'sinon';

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

        expect(list.sort(sortByRank)).to.deep.eq(result);
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

        expect(fixExcludes(marks)).to.deep.eq(result);
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
        expect(createPMPlugins(editorConfig as any, {} as any, {} as any, () => {}, {} as any, {} as any).length).to.eq(1);
      });
    });
  });

  describe('#processDefaultDocument', () => {
    let schema: Schema;
    beforeEach(() => {
      const editor = createEditor();
      schema = editor.editorView.state.schema;
    });

    it('should return undefined if no default document provided', () => {
      expect(processDefaultDocument(schema, undefined)).to.equal(undefined);
    });

    it(`should return undefined if provided document isn't a vaild JSON`, () => {
      expect(processDefaultDocument(schema, '{1:2}')).to.equal(undefined);
    });

    it(`should return undefined if provided document is an array`, () => {
      expect(processDefaultDocument(schema, [{ type: 'paragraph' }])).to.equal(undefined);
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
      })).to.equal(undefined);
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
      expect(processDefaultDocument(schema, node)).to.equal(node);
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
      })).to.be.an.instanceOf(Node);
    });
  });

  describe('onChange', () => {
    it('should call onChange only when document changes', () => {
      const onChange = sinon.spy();
      const editor = createEditor([], { onChange });
      const { editorView } = editor;
      editorView.dispatch(
        editorView.state.tr.insertText('hello')
      );
      expect(onChange.callCount).to.equal(1);
      const { tr } = editorView.state;
      editorView.dispatch(
        tr.setSelection(Selection.near(tr.doc.resolve(1)))
      );
      expect(onChange.callCount).to.equal(1);
    });
  });
});

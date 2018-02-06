import { name } from '../../../package.json';
import { Node } from 'prosemirror-model';
import {
  doc,
  p,
  hr,
  text,
  mention,
  code_block,
  decisionList,
  decisionItem,
  defaultSchema as schema,
} from '@atlaskit/editor-test-helpers';
import {
  isEmpty,
  isEmptyParagraph,
  isEmptyDocument,
  preprocessDoc,
  processRawValue,
} from '../../../src/editor/utils/document';

describe(name, () => {
  describe('Utils -> Document', () => {
    describe('#isEmptyParagraph', () => {
      it('should return true if paragraph is empty', () => {
        expect(isEmptyParagraph(p('')(schema))).toBe(true);
      });

      it('should return false if paragraph is not empty', () => {
        expect(isEmptyParagraph(p('some text')(schema))).toBe(false);
      });
    });

    describe('#isEmpty', () => {
      it('should return true if node is empty', () => {
        expect(isEmpty(p('')(schema))).toBe(true);
      });

      it('should return true if the only child of a node is an empty paragraph', () => {
        expect(isEmpty(doc(p(''))(schema))).toBe(true);
      });

      it('should return true if node only contains empty block nodes', () => {
        expect(isEmpty(doc(p(''), p(''), p(''))(schema))).toBe(true);
      });

      it('should return false if the only child of a node is not an empty paragraph', () => {
        expect(isEmpty(doc(p('some text'))(schema))).toBe(false);
      });

      it('should return false if node contains non-empty block nodes', () => {
        expect(isEmpty(doc(p(''), p('some text'), p(''))(schema))).toBe(false);
      });
    });

    describe('isEmptyDocument', () => {
      it('should return true if node looks like an empty document', () => {
        const node = doc(p(''))(schema);
        expect(isEmptyDocument(node)).toBe(true);
      });

      it('should return false if node has text content', () => {
        const node = doc(p('hello world'))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has multiple empty children', () => {
        const node = doc(p(''), p(''))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has block content', () => {
        const node = doc(decisionList({})(decisionItem({})()))(schema);
        expect(isEmptyDocument(node)).toBe(false);
      });

      it('should return false if node has hr', () => {
        expect(isEmpty(doc(p(), hr())(schema))).toBe(false);
      });
    });

    describe('preprocessDoc', () => {
      it('should return true if node is empty', () => {
        const editorContent = doc(
          p('some text'),
          decisionList({})(decisionItem({})()),
        )(schema);
        const processedContent = preprocessDoc(schema, editorContent);
        expect(processedContent).not.toBe(undefined);
        expect((processedContent as Node)!.content!.childCount).toEqual(1);
        expect(
          (processedContent as Node)!.content!.firstChild!.type.name,
        ).toEqual('paragraph');
      });

      it('should return new document', () => {
        const editorContent = doc(
          p('some text'),
          decisionList({})(decisionItem({})()),
        )(schema);
        const processedContent = preprocessDoc(schema, editorContent);
        expect(processedContent).not.toEqual(editorContent);
      });
    });
  });

  describe('processRawValue', () => {
    const successCases = [
      { name: 'doc', node: doc(p('some new content'))(schema) as any },
      { name: 'text', node: text('text', schema) as any },
      {
        name: 'block',
        node: code_block({ language: 'javascript' })('content')(schema) as any,
      },
      {
        name: 'inline',
        node: mention({ id: 'id', text: '@mention' })()(schema) as any,
      },
    ];

    successCases.forEach(({ name, node }) => {
      it(`Case: ${name} – should accept JSON version of a prosemirror node`, () => {
        const result = processRawValue(schema, node.toJSON());
        expect(result).toEqualDocument(node);
      });

      it(`Case: ${name} – should accept stringified JSON version of a prosemirror node`, () => {
        const result = processRawValue(schema, JSON.stringify(node.toJSON()));
        expect(result).toEqualDocument(node);
      });
    });

    describe('failure cases', () => {
      // Silence console.error
      const oldConsole = console.error;
      console.error = jest.fn();
      afterAll(() => {
        console.error = oldConsole;
      });

      it('should return undefined if value is empty', () => {
        expect(processRawValue(schema, '')).toBeUndefined();
      });

      it('should return undefined if value is not a valid json', () => {
        expect(processRawValue(schema, '{ broken }')).toBeUndefined();
      });

      it('should return undefined if value is an array', () => {
        expect(processRawValue(schema, [1, 2, 3, 4])).toBeUndefined();
      });

      it('should return undefined if json represents not valid PM Node', () => {
        expect(
          processRawValue(schema, {
            type: 'blockqoute',
            content: [{ type: 'text', text: 'text' }],
          }),
        ).toBeUndefined();
      });
    });
  });
});

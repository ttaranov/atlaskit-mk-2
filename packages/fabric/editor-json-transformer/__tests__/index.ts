import {
  makeEditor,
  doc,
  defaultSchema,
  // Node
  blockquote,
  ul,
  ol,
  li,
  code_block,
  emoji,
  br,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  mediaGroup,
  media,
  mention,
  panel,
  panelNote,
  p,
  hr,
  // Marks
  code,
  em,
  a,
  strike,
  strong,
  subsup,
  textColor,
  underline,
} from '@atlaskit/editor-test-helpers';

import { JSONTransformer } from '../src';

const transformer = new JSONTransformer();
const toJSON = node => transformer.encode(node);
const parseJSON = node => transformer.parse(node);

describe('JSONTransformer:', () => {
  describe('encode', () => {
    const editor = (doc: any, schema: any = defaultSchema) =>
      makeEditor({
        doc,
        schema: defaultSchema,
      });

    it('should serialize common nodes/marks as ProseMirror does', () => {
      const { editorView } = editor(
        doc(
          p(
            strong('>'),
            ' Atlassian: ',
            br,
            a({ href: 'https://atlassian.com' })('Atlassian'),
          ),
          p(
            em('hello'),
            underline('world'),
            code('!'),
            subsup({ type: 'sub' })('sub'),
            'plain text',
            strike('hey'),
            textColor({ color: 'red' })('Red :D'),
          ),
          ul(li('ichi'), li('ni'), li('san')),
          ol(li('ek'), li('dui'), li('tin')),
          blockquote(),
          h1('H1'),
          h2('H2'),
          h3('H3'),
          h4('H4'),
          h5('H5'),
          h6('H6'),
          emoji({ shortName: ':joy:' }),
          panel('hello from panel'),
          panelNote('hello from note panel'),
          hr,
        ),
      );
      const pmDoc = editorView.state.doc;
      expect(toJSON(pmDoc)).toEqual({
        version: 1,
        ...pmDoc.toJSON(),
      });
    });

    it('should strip optional attrs from media node', () => {
      const { editorView } = editor(
        doc(
          mediaGroup(
            media({
              id: 'foo',
              type: 'file',
              collection: '',
              __fileName: 'foo.png',
              __displayType: 'thumbnail',
              __fileMimeType: 'image/png',
              __fileSize: 1234,
            }),
          ),
        ),
      );
      expect(toJSON(editorView.state.doc)).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  id: 'foo',
                  type: 'file',
                  collection: '',
                },
              },
            ],
          },
        ],
      });
    });

    it('should strip unused optional attrs from mention node', () => {
      const { editorView } = editor(
        doc(
          p(
            mention({
              id: 'id-rick',
              text: '@Rick Sanchez',
            }),
          ),
        ),
      );

      expect(toJSON(editorView.state.doc)).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'mention',
                attrs: {
                  id: 'id-rick',
                  text: '@Rick Sanchez',
                  accessLevel: '',
                },
              },
            ],
          },
        ],
      });
    });

    it('should not strip accessLevel from mention node', () => {
      const { editorView } = editor(
        doc(
          p(
            mention({
              accessLevel: 'CONTAINER',
              id: 'foo',
              text: 'fallback',
              userType: 'APP',
            }),
          ),
        ),
      );

      expect(toJSON(editorView.state.doc)).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'mention',
                attrs: {
                  id: 'foo',
                  text: 'fallback',
                  userType: 'APP',
                  accessLevel: 'CONTAINER',
                },
              },
            ],
          },
        ],
      });
    });

    it('should strip uniqueId from codeBlock node', () => {
      const { editorView } = editor(
        doc(
          code_block({
            language: 'javascript',
            uniqueId: 'foo',
          })('var foo = 2;'),
        ),
      );

      expect(toJSON(editorView.state.doc)).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: {
              language: 'javascript',
            },
            content: [
              {
                type: 'text',
                text: 'var foo = 2;',
              },
            ],
          },
        ],
      });
    });

    it('should strip language=null from codeBlock node', () => {
      const { editorView } = editor(doc(code_block()('var foo = 2;')));

      expect(toJSON(editorView.state.doc)).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'codeBlock',
            attrs: {},
            content: [
              {
                type: 'text',
                text: 'var foo = 2;',
              },
            ],
          },
        ],
      });
    });
  });
  describe('parse', () => {
    it('should convert ADF to PM representation', () => {
      const adf = {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'hello',
              },
            ],
          },
        ],
      };
      expect(parseJSON(adf)).toEqualDocument(doc(p('hello')));
    });
  });

  it('should throw an error if not ADF-like', () => {
    const badADF = {
      type: 'paragraph',
      content: [{ type: 'text', content: 'hello' }],
    };
    expect(() => parseJSON(badADF)).toThrowError(
      'Expected content format to be ADF',
    );
  });

  it('should throw an error if not a valid PM document', () => {
    const badADF = {
      type: 'doc',
      content: [{ type: 'fakeNode', content: 'hello' }],
    };
    expect(() => parseJSON(badADF)).toThrowError(/Unknown node type: fakeNode/);
  });
});

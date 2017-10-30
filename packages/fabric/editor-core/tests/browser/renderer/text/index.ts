import { expect } from 'chai';
import TextSerializer from '../../../../src/renderer/text';
import schema from '../../../../src/test-helper/schema';

const serializer = TextSerializer.fromSchema(schema);

const render = (doc: any) => {
  const docFromSchema = schema.nodeFromJSON(doc);
  return serializer.serializeFragment(docFromSchema.content);
};

describe('Renderer - TextSerializer', () => {

  it('should render hardBreak as a new line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: 'foo' },
          { type: 'hardBreak' },
          { type: 'text', text: 'bar' },
        ],
      }],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should render multiple hardBreaks as one line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: 'foo' },
          { type: 'hardBreak' },
          { type: 'hardBreak' },
          { type: 'hardBreak' },
          { type: 'text', text: 'bar' },
        ],
      }],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should render unicode emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: '🦄' },
          { type: 'text', text: 'is a unicorn' },
        ],
      }],
    };

    expect(render(doc)).to.equal('🦄is a unicorn');
  });

  it('should render colon key for emoticon emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          { type: 'text', text: 'My favourite emoji are' },
          {
            type: 'emoji',
            attrs: {
              shortName: ':grin:',
              id: '1f601',
              text: '😁',
            }
          },
          {
            type: 'emoji',
            attrs: {
              shortName: ':evilburns:',
              id: 'atlassian-evilburns',
              text: ':evilburns:',
            }
          },
        ],
      }],
    };

    expect(render(doc)).to.equal('My favourite emoji are😁:evilburns:');
  });

  it('should render mention user with at-symbol', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          {
            type: 'mention',
            attrs: {
              id: '1',
              accessLevel: 'CONTAINER',
              text: '@user'
            },
          },
          { type: 'text', text: ' is awesome' },
        ],
      }],
    };

    expect(render(doc)).to.equal('@user is awesome');
  });

  it('should render media items prefixed with attachment unicode emoji', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'mediaGroup',
        content: [{
          type: 'media',
          attrs: {
            type: 'file',
            id: 'id',
            collection: 'collection',
          },
        }],
      }],
    };

    expect(render(doc).indexOf('📎 ')).to.equal(0);
  });

  it('should render media items as NUMBER files (one file)', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'mediaGroup',
        content: [{
          type: 'media',
          attrs: {
            type: 'file',
            id: 'id',
            collection: 'collection',
          },
        }],
      }],
    };

    expect(render(doc)).to.contain('1 File');
  });

  it('should render media items as NUMBER files (multiple files)', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              type: 'file',
              id: 'id1',
              collection: 'collection',
            },
          },
          {
            type: 'media',
            attrs: {
              type: 'file',
              id: 'id2',
              collection: 'collection',
            },
          },
        ],
      }],
    };

    expect(render(doc)).to.contain('2 Files');
  });

  it('should render media items as NUMBER files + ignore media card links', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              type: 'file',
              id: 'id1',
              collection: 'collection',
            },
          },
          {
            type: 'media',
            attrs: {
              type: 'link',
              id: 'id1',
              collection: 'collection',
            },
          },
          {
            type: 'media',
            attrs: {
              type: 'file',
              id: 'id2',
              collection: 'collection',
            },
          },
        ],
      }],
    };

    expect(render(doc)).to.contain('2 Files');
  });

  it('should render URL if it is the same as text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'https://www.atlassian.com',
            marks: [{
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            }],
          },
          {
            type: 'text',
            text: ' is for TEAM'
          },
        ],
      }],
    };

    expect(render(doc)).to.equal('https://www.atlassian.com is for TEAM');
  });

  it('should render text if URL is different from text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Atlassian',
            marks: [{
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            }],
          },
          {
            type: 'text',
            text: ' is for TEAM'
          },
        ],
      }],
    };

    expect(render(doc)).to.equal('Atlassian is for TEAM');
  });

  it('should render application card text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'applicationCard',
        attrs: {
          text: 'applicationCard text',
        },
      }],
    };

    expect(render(doc)).to.equal('applicationCard text');
  });

  it('should render blockquote text prefixed with "> "', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'blockquote',
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: 'some quote' }],
        }],
      }],
    };

    expect(render(doc)).to.equal('> some quote');
  });

  it('should render codeBlock contents as a simple text', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [{
        type: 'codeBlock',
        content: [
          {
            type: 'text',
            text: 'foo',
          },
          {
            type: 'text',
            text: 'bar',
          }
        ],
      }],
    };

    expect(render(doc)).to.equal('foobar');
  });

  it('should divide block elements with a new line', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should ignore card links', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'mediaGroup',
          content: [{
            type: 'media',
            attrs: {
              type: 'link',
              id: '1',
              collection: '2',
            },
          }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        },
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should ignore bullet lists', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'bulletList',
          content: [{
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: 'ignore me' }],
            }],
          }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should ignore ordered lists', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'orderedList',
          content: [{
            type: 'listItem',
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: 'ignore me' }],
            }],
          }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  [1, 2, 3, 4, 5, 6].forEach(level => {
    it(`should ignore heading level ${level}`, () => {
      const doc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'foo' }],
          },
          {
            type: 'heading',
            attrs: { level },
            content: [{ type: 'text', text: 'ignore me' }],
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'bar' }],
          }
        ],
      };

      expect(render(doc)).to.equal('foo\nbar');
    });
  });

  it('should ignore horizontal lines', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'rule',
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should ignore panels', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'panel',
          attrs: {
            panelType: 'info',
          },
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: 'ignore me' }],
          }],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });

  it('should ignore tables', () => {
    const doc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'foo' }],
        },
        {
          type: 'table',
          content: [],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'bar' }],
        }
      ],
    };

    expect(render(doc)).to.equal('foo\nbar');
  });
});

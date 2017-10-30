import * as assert from 'assert';
import * as chai from 'chai';
import { expect } from 'chai';
import { createJIRASchema } from '@atlaskit/editor-core';
import { chaiPlugin } from '@atlaskit/editor-core/dist/es5/test-helper';
import { parseIntoAtlassianDocument } from '../../src';

chai.use(chaiPlugin);

describe('parseIntoAtlassianDocument', () => {
  it('should parse HTML', () => {
    const schema = createJIRASchema({});
    const json = parseIntoAtlassianDocument('<p>text</p>', schema);

    expect(json).to.deep.equal({
      type: 'doc',
      version: 1,
      content: [{
        type: 'paragraph',
        content: [{
          type: 'text',
          text: 'text',
        }],
      }],
    });
  });

  it('should throw if HTML is not a string', () => {
    const schema = createJIRASchema({});
    const parse: any = parseIntoAtlassianDocument;

    assert.throws(
      () => parse(undefined, schema),
      'parseIntoAtlassianDocument should throw if first argument is not a string'
    );

    assert.throws(
      () => parse(null, schema),
      'parseIntoAtlassianDocument should throw if first argument is not a string'
    );
  });

  it('should parse HTML according to schema', () => {
    const schema = createJIRASchema({ allowMedia: false, allowLinks: true });
    const json = parseIntoAtlassianDocument('<p><a href="http://www.atlassian.com">Atlassian</a></p><p>This is a list: <ul><li>element</li></ul></p>', schema);

    expect(json).to.deep.equal({
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [{
            type: 'text',
            text: 'Atlassian',
            marks: [{
              type: 'link',
              attrs: {
                href: 'http://www.atlassian.com',
              },
            }],
          }],
        },
        {
          type: 'paragraph',
          content: [{
            type: 'text',
            text: 'This is a list:'
          }]
        },
        {
          type: 'paragraph',
          content: [],
        },
      ],
    });
  });
});

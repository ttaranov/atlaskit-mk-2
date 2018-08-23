import { name } from '../../../../package.json';
import { bitbucketSchema } from '../../../..';

describe(`${name}/schema Bitbucket schema`, () => {
  it('contains expected nodes and marks', () => {
    // Nodes
    expect(bitbucketSchema.nodes).toHaveProperty('doc');
    expect(bitbucketSchema.nodes).toHaveProperty('paragraph');
    expect(bitbucketSchema.nodes).toHaveProperty('text');
    expect(bitbucketSchema.nodes).toHaveProperty('bulletList');
    expect(bitbucketSchema.nodes).toHaveProperty('orderedList');
    expect(bitbucketSchema.nodes).toHaveProperty('listItem');
    expect(bitbucketSchema.nodes).toHaveProperty('heading');
    expect(bitbucketSchema.nodes).toHaveProperty('blockquote');
    expect(bitbucketSchema.nodes).toHaveProperty('codeBlock');
    expect(bitbucketSchema.nodes).toHaveProperty('hardBreak');
    expect(bitbucketSchema.nodes).toHaveProperty('rule');
    expect(bitbucketSchema.nodes).toHaveProperty('image');
    expect(bitbucketSchema.nodes).toHaveProperty('mention');
    expect(bitbucketSchema.nodes).toHaveProperty('emoji');

    // Marks
    expect(bitbucketSchema.marks).toHaveProperty('em');
    expect(bitbucketSchema.marks).toHaveProperty('strong');
    expect(bitbucketSchema.marks).toHaveProperty('strike');
    expect(bitbucketSchema.marks).toHaveProperty('link');
    expect(bitbucketSchema.marks).toHaveProperty('mentionQuery');
    expect(bitbucketSchema.marks).toHaveProperty('emojiQuery');
    expect(bitbucketSchema.marks).toHaveProperty('code');
  });
});

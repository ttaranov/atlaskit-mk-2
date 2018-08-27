import { name } from '../../../../package.json';
import { confluenceSchema } from '../../../..';

describe(`${name}/schema Confluence schema`, () => {
  it('has all expects nodes and marks', () => {
    // Nodes
    expect(confluenceSchema.nodes).toHaveProperty('doc');
    expect(confluenceSchema.nodes).toHaveProperty('paragraph');
    expect(confluenceSchema.nodes).toHaveProperty('blockquote');
    expect(confluenceSchema.nodes).toHaveProperty('codeBlock');
    expect(confluenceSchema.nodes).toHaveProperty('panel');
    expect(confluenceSchema.nodes).toHaveProperty('hardBreak');
    expect(confluenceSchema.nodes).toHaveProperty('orderedList');
    expect(confluenceSchema.nodes).toHaveProperty('bulletList');
    expect(confluenceSchema.nodes).toHaveProperty('heading');
    expect(confluenceSchema.nodes).toHaveProperty('mediaGroup');
    expect(confluenceSchema.nodes).toHaveProperty('media');
    expect(confluenceSchema.nodes).toHaveProperty('confluenceUnsupportedBlock');
    expect(confluenceSchema.nodes).toHaveProperty('confluenceJiraIssue');
    expect(confluenceSchema.nodes).toHaveProperty('listItem');
    expect(confluenceSchema.nodes).toHaveProperty('mention');
    expect(confluenceSchema.nodes).toHaveProperty(
      'confluenceUnsupportedInline',
    );
    expect(confluenceSchema.nodes).toHaveProperty('unsupportedBlock');
    expect(confluenceSchema.nodes).toHaveProperty('unsupportedInline');
    expect(confluenceSchema.nodes).toHaveProperty('media');
    expect(confluenceSchema.nodes).toHaveProperty('rule');
    // Marks
    expect(confluenceSchema.marks).toHaveProperty('link');
    expect(confluenceSchema.marks).toHaveProperty('em');
    expect(confluenceSchema.marks).toHaveProperty('strong');
    expect(confluenceSchema.marks).toHaveProperty('strike');
    expect(confluenceSchema.marks).toHaveProperty('subsup');
    expect(confluenceSchema.marks).toHaveProperty('underline');
    expect(confluenceSchema.marks).toHaveProperty('mentionQuery');
    expect(confluenceSchema.marks).toHaveProperty('code');
  });
});

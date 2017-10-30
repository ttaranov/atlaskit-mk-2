import * as chai from 'chai';
import { expect } from 'chai';
import { chaiPlugin } from '../../../../src/test-helper';
import { markFactory, nodeFactory } from '../../../../src/test-helper';
import { createJIRASchema } from '@atlaskit/editor-common';
import { parseWithSchema, encode } from './_test-helpers';

chai.use(chaiPlugin);

const schema = createJIRASchema({ allowLinks: true });

// Nodes
const doc = nodeFactory(schema.nodes.doc);
const p = nodeFactory(schema.nodes.paragraph);

// Marks
const linkMark = (attrs) => markFactory(schema.marks.link!, attrs);

describe('JIRATransformer', () => {
  describe('JIRA issue keys', () => {

    it('parses HTML', () => {
      const actual = parseWithSchema(
        `<span class="jira-issue-macro" data-jira-key="ED-1">
          <a href="https://product-fabric.atlassian.net/browse/ED-1" class="jira-issue-macro-key issue-link">
            <img class="icon" src="./epic.svg" />
                ED-1
            </a>
            <span class="aui-lozenge aui-lozenge-subtle aui-lozenge-current jira-macro-single-issue-export-pdf">
              In Progress
            </span>
        </span>`, schema);

      const node = doc(p(linkMark({ href: 'https://product-fabric.atlassian.net/browse/ED-1' })('ED-1')));
      expect(actual).to.deep.equal(node);
    });

    it('encodes HTML', () => {
      const node = doc(p(linkMark({ href: 'https://product-fabric.atlassian.net/browse/ED-1' })('ED-1')));
      const encoded = encode(node, schema);
      expect(encoded).to.deep.equal('<p><a class="external-link" href="https://product-fabric.atlassian.net/browse/ED-1" rel="nofollow">ED-1</a></p>');
    });
  });
});

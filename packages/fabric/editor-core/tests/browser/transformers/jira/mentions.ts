import { markFactory, nodeFactory } from '../../../../src/test-helper';
import { checkParseEncodeRoundTrips, encode } from './_test-helpers';
import { expect } from 'chai';
import { createJIRASchema } from '@atlaskit/editor-common';

const schema = createJIRASchema({ allowMentions: true });

// Nodes
const mention = (attrs: { id: string, text?: string }) => schema.nodes.mention!.createChecked(attrs);
const doc = nodeFactory(schema.nodes.doc);
const p = nodeFactory(schema.nodes.paragraph);

// Marks
const mentionQuery = markFactory(schema.marks.mentionQuery!);

const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

describe('JIRATransformer', () => {
  describe('mentions', () => {
    it(`encodes HTML: mention_query mark`, () => {
      const encoded = encode(doc(p(mentionQuery('@star'))), schema, { mention: mentionEncoder });
      expect('<p>@star</p>').to.equal(encoded);
    });

    checkParseEncodeRoundTrips('mention node',
      schema,
      `<p>Text <a class="user-hover" href="/secure/ViewProfile?name=Starr" rel="Starr">@Cheryll Maust</a> text</p>`,
      doc(p('Text ', mention({ id: 'Starr', text: '@Cheryll Maust' }), ' text')),
      { mention: mentionEncoder }
    );
  });
});

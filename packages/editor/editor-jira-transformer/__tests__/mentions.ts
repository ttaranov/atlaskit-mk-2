import { doc, p, mentionQuery, mention } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips, encode } from './_test-helpers';
import { createJIRASchema } from '@atlaskit/editor-common';

const schema = createJIRASchema({ allowMentions: true });
const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

describe('JIRATransformer', () => {
  describe('mentions', () => {
    it(`encodes HTML: mention_query mark`, () => {
      const encoded = encode(doc(p(mentionQuery()('@star'))), schema, {
        mention: mentionEncoder,
      });
      expect('<p>@star</p>').toEqual(encoded);
    });

    checkParseEncodeRoundTrips(
      'mention node',
      schema,
      `<p>Text <a class="user-hover" href="/secure/ViewProfile?name=Starr" rel="Starr">@Cheryll Maust</a> text</p>`,
      doc(
        p('Text ', mention({ id: 'Starr', text: '@Cheryll Maust' })(), ' text'),
      ),
      { mention: mentionEncoder },
    );
  });
});

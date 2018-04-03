import { doc, p, blockquote } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

xdescribe('WikiMarkup Transformer', () => {
  describe('blockquote', () => {
    const WIKI_NOTATION = `bq. some texts here`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(blockquote(p('some texts here'))),
    );
    //
    // checkParse(
    //   'empty node',
    //   defaultSchema,
    //   ['bq. '],
    //   doc(blockquote(p(''))),
    // );
    //
    // checkParseEncodeRoundTrips(
    //   'no content',
    //   defaultSchema,
    //   'bq. ',
    //   doc(blockquote(p(''))),
    // );
  });
});

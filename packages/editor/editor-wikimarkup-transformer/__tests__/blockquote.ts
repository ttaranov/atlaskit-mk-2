import { doc, p, blockquote } from '@atlaskit/editor-test-helpers';
import { checkParse, checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe('WikiMarkup Transformer', () => {
  describe('blockquote', () => {
    checkParseEncodeRoundTrips(
      'bq. some texts here',
      defaultSchema,
      'bq. some texts here',
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

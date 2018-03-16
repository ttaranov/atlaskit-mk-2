import { doc, code_block } from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('camelcase code macro', () => {
    const WIKI_NOTATION = `{code}package com.atlassian.confluence;\\n\\n\\
public class CamelCaseLikeClassName\\n\\
{\\n\\
private String sampleAttr;\\n\\
}{code}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        code_block({ language: 'Java' })(
          'package com.atlassian.confluence;\n' +
            'public class CamelCaseLikeClassName\n' +
            '{\n' +
            'private String sampleAttr;\n' +
            '}',
        ),
      ),
    );
  });

  describe('code macro XSS', () => {
    const WIKI_NOTATION = `{code:lang=java"</pre><script>alert('not good')</script>}some code{code}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        code_block({ language: 'Java' })(
          // @TODO Does it need the error?
          // https://stash.atlassian.com/projects/JIRACLOUD/repos/jira/browse/jira-components/jira-renderer/src/test/resources/render-tests/code-macro-render-tests.properties
          'some code',
        ),
      ),
    );
  });
});

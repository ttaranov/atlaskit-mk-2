import { code_block, doc } from '@atlaskit/editor-test-helpers';
import {
  checkParseEncodeRoundTrips,
  checkEncode,
  checkParse,
} from './_test-helpers';
import { createJIRASchema } from '@atlaskit/editor-common';

const schema = createJIRASchema({ allowCodeBlock: true });

// Nodes

describe('JIRATransformer', () => {
  describe('code block', () => {
    checkParseEncodeRoundTrips(
      'code_block node',
      schema,
      `<div class="code panel"><div class="codeContent panelContent"><pre class="code-javascript">var foo = "bar";</pre></div></div>`,
      doc(code_block({ language: 'javascript' })('var foo = "bar";')),
    );

    checkParseEncodeRoundTrips(
      'multiline code_block node',
      schema,
      `<div class="code panel"><div class="codeContent panelContent"><pre class="code-javascript">var foo = "bar";\nfoo += "baz";</pre></div></div>`,
      doc(
        code_block({ language: 'javascript' })(
          `var foo = "bar";\nfoo += "baz";`,
        ),
      ),
    );

    checkEncode(
      'default language is plain',
      schema,
      doc(code_block({})('var foo = "bar";')),
      `<div class="code panel"><div class="codeContent panelContent"><pre class="code-plain">var foo = "bar";</pre></div></div>`,
    );

    checkEncode(
      'lowercase language',
      schema,
      doc(code_block({ language: 'JavaScript' })('var foo = "bar";')),
      `<div class="code panel"><div class="codeContent panelContent"><pre class="code-javascript">var foo = "bar";</pre></div></div>`,
    );

    checkParse(
      'JIRA preformatted macros',
      schema,
      [
        `<div class="preformatted panel"><div class="preformattedContent panelContent"><pre>*no* further _formatting_</pre></div></div>`,
      ],
      doc(code_block({ language: 'plain' })('*no* further _formatting_')),
    );

    checkParse(
      'strip spans',
      schema,
      [
        `<div class="code panel"><div class="codeContent panelContent"><pre class="code-java"><span class="code-comment">// Some comments here
</span><span class="code-keyword">public</span> <span class="code-object">String</span> getFoo()
{
    <span class="code-keyword">return</span> foo;
}</pre></div></div>`,
      ],
      doc(
        code_block({ language: 'java' })(`// Some comments here
public String getFoo()
{
    return foo;
}`),
      ),
    );

    checkParse(
      'empty content',
      schema,
      [
        '<div class="code panel"><div class="codeContent panelContent"><pre class="code-plain"></pre></div></div>',
      ],
      doc(code_block({ language: 'plain' })()),
    );
  });
});

import * as chai from 'chai';
import { expect } from 'chai';
import * as assert from 'assert';
import { Node as PMNode } from 'prosemirror-model';
import { chaiPlugin } from '../../../../src/test-helper';
import {
  ConfluenceTransformer,
  CONFlUENCE_LANGUAGE_MAP as LANGUAGE_MAP
} from '../../../../src';
import {
  blockquote, br, doc, em, h1, h2, h3, h4, h5, h6, hr, li,
  code, ol, p, strike, strong, sub, sup, u, ul, codeblock, panel, mention, link, textColor,
  confluenceUnsupportedInline, confluenceUnsupportedBlock, confluenceJiraIssue, confluenceInlineComment,
  mediaGroup, media,
  table, tr, td, th,
  inlineMacro,
  emoji,
} from './_schema-builder';
chai.use(chaiPlugin);
import { confluenceSchema as schema } from '@atlaskit/editor-common';

const transformer = new ConfluenceTransformer(schema);
const parse = (html: string) => transformer.parse(html);
const encode = (node: PMNode) => transformer.encode(node);

const checkBuilder = (fn: any, description: string, cxhtml: string, doc: PMNode) => {
  fn(`parses CXHTML: ${description}`, () => {
    const actual = parse(cxhtml);
    expect(actual).to.deep.equal(doc);
  });

  fn(`round-trips CXHTML: ${description}`, () => {
    const roundTripped = parse(encode(doc));
    expect(roundTripped).to.deep.equal(doc);
  });
};

const check = (description: string, cxhtml: string, doc: PMNode) =>
  checkBuilder(it, description, cxhtml, doc);

describe('ConfluenceTransformer: encode - parse:', () => {
  describe('empty', () => {
    check('empty',
      '',
      doc(p('')));
  });

  describe('basic formatting:', () => {

    describe('doc:', () => {
      check('it should generate a valid document',
        '<p>a</p>',
        doc(p('a'))
      );

      check('if doc content is not valid, it will be converted to UnsupportedBlock',
        '<li>a</li>',
        doc(
          confluenceUnsupportedBlock('<li>a</li>')
        )
      );
    });

    describe('text:', () => {
      check('basic text',
        'War and peace',
        doc(p('War and peace')));

      check('<span> with no attributes',
        '<span>War and peace</span>',
        doc(p('War and peace')));
    });

    describe('paragraphs:', () => {
      check('a paragraph with text',
        '<p>Text here.</p>',
        doc(p('Text here.')));

      check('an empty paragraph',
        '<p></p>',
        doc(p('')));

      check('two adjacent paragraphs',
        '<p>Text here.</p>\n<p>And more here.</p>',
        doc(
          p('Text here.'),
          p('And more here.'),
        ));

      check('a paragraph with a hard break in it',
        '<p>Text on two<br />lines.</p>',
        doc(
          p('Text on two', br, 'lines.'),
        ));

      check('a paragraph with unsupported content',
        '<p><li>a</li></p>',
        doc(
          p(confluenceUnsupportedInline('<li>a</li>'))
        )
      );
    });

    describe('breaks:', () => {
      check('a self-closing break',
        '<br />',
        doc(p(br)));

      check('a self-closing break in a paragraph',
        '<p><br /></p>',
        doc(p(br)));
    });

    describe('marks formatting:', () => {
      check('<u> tag',
        '<p>Text with <u>underline words</u>.</p>',
        doc(p(
          'Text with ',
          u('underline words'),
          '.'
        )));

      check('<strong> tag',
        '<p>Text with <strong>bold words</strong>.</p>',
        doc(p(
          'Text with ',
          strong('bold words'),
          '.'
        )));

      check('<b> tag',
        '<p>Text with <b>bold words</b>.</p>',
        doc(p(
          'Text with ',
          strong('bold words'),
          '.'
        )));

      check('<s> tag',
        '<p>Text with <s>strikethrough words</s>.</p>',
        doc(p(
          'Text with ',
          strike('strikethrough words'),
          '.'
        )));

      check('<em> tag',
        '<p>Text with <em>emphasised words</em>.</p>',
        doc(p(
          'Text with ',
          em('emphasised words'),
          '.'
        )));

      check('<i> tag',
        '<p>Text with <i>emphasised words</i>.</p>',
        doc(p(
          'Text with ',
          em('emphasised words'),
          '.'
        )));

      check('<strong><em> nesting',
        '<p>Text with <strong><em>strong emphasised words</em></strong>.</p>',
        doc(p(
          'Text with ',
          em(strong('strong emphasised words')),
          '.'
        )));

      check('<em><strong> nesting',
        '<p>Text with <em><strong>strong emphasised words</strong></em>.</p>',
        doc(p(
          'Text with ',
          em(strong('strong emphasised words')),
          '.'
        )));

      check('<a> tag',
        '<p>Text with <a href="http://www.atlassian.com">www.atlassian.com</a></p>',
        doc(p(
          'Text with ',
          link({ href: 'http://www.atlassian.com' })('www.atlassian.com')
        )));

      check('combination of strong and emphasis',
        '<p><b>Bold words,</b> and <i><strong>strongly emphasised words</strong></i>.</p>',
        doc(
          p(
            strong('Bold words,'),
            ' and ',
            em(strong('strongly emphasised words')),
            '.'
          )
        ));

      check('<del>',
        '<del>struck</del>',
        doc(p(strike('struck'))));

      check('<s>',
        '<s>struck</s>',
        doc(p(strike('struck'))));

      check('<code>',
        '<p>Text with <span style="font-family: monospace;">function bar() { return foo; }</span>.</p>',
        doc(p(
          'Text with ',
          code('function bar() { return foo; }'),
          '.'
        )));

      check('Colored text',
        '<p>Text with <span style="color: rgb(34, 34, 34)">some colour</span>.</p>',
        doc(p(
          'Text with ',
          textColor({ color: '#222222' })('some colour'),
          '.'
        )));

      describe('confluence inline comments', () => {
        check(
          'basic',
          `<p>
            <ac:inline-comment-marker ac:ref="2c469dac-f95f-4979-ba30-2a4cb705450a">
              inline comment
            </ac:inline-comment-marker>
          </p>`,
          doc(
            p(
              confluenceInlineComment({
                reference: '2c469dac-f95f-4979-ba30-2a4cb705450a',
              })('inline comment')
            )
          )
        );

        check(
          'marker without text',
          `<p>
            test
            <ac:inline-comment-marker ac:ref="2c469dac-f95f-4979-ba30-2a4cb705450a"></ac:inline-comment-marker>
            text
          </p>`,
          doc(p('test text'))
        );

        check(
          'tightly overlapping comments',
          `<p>
            <ac:inline-comment-marker ac:ref="foo">
              <ac:inline-comment-marker ac:ref="bar">
                <ac:inline-comment-marker ac:ref="baz">
                  inline comment
                </ac:inline-comment-marker>
              </ac:inline-comment-marker>
            </ac:inline-comment-marker>
          </p>`,
          doc(
            p(
              confluenceInlineComment({
                reference: 'foo',
              })(
                  confluenceInlineComment({
                    reference: 'bar',
                  })(
                    confluenceInlineComment({
                      reference: 'baz',
                    })('inline comment')
                  )
              )
            )
          )
        );

        check(
          'loosly overlapping comments',
          `<p>
            <ac:inline-comment-marker ac:ref="foo">
              lorem
              <ac:inline-comment-marker ac:ref="bar">
                ipsum
              </ac:inline-comment-marker>
              dolor
            </ac:inline-comment-marker>
          </p>`,
          doc(
            p(
              confluenceInlineComment({
                reference: 'foo',
              })('lorem '),
              confluenceInlineComment({
                reference: 'foo',
              })(confluenceInlineComment({
                reference: 'bar',
              })('ipsum ')),
              confluenceInlineComment({
                reference: 'foo',
              })('dolor'),
            )
          )
        );

        check(
          'partially overlapping comments',
          `<p>
            <ac:inline-comment-marker ac:ref="foo">
              lorem
              <ac:inline-comment-marker ac:ref="bar">
                ipsum
              </ac:inline-comment-marker>
            </ac:inline-comment-marker>
            <ac:inline-comment-marker ac:ref="bar">
              dolor
            </ac:inline-comment-marker>
          </p>`,
          doc(
            p(
              confluenceInlineComment({
                reference: 'foo',
              })('lorem '),
              confluenceInlineComment({
                reference: 'foo',
              })(confluenceInlineComment({
                reference: 'bar',
              })('ipsum ')),
              confluenceInlineComment({
                reference: 'bar',
              })('dolor'),
            )
          )
        );
      });

      it('parses text color in hex', () => {
        const actual = parse('<p>Text with <span style="color: #777777">some colour</span>.</p>');
        expect(actual).to.deep.equal(doc(p(
          'Text with ',
          textColor({ color: '#777777' })('some colour'),
          '.'
        )));
      });

      it('normalizes 3-hex colours to 6-hex when parsing', () => {
        const actual = parse('<p>Text with <span style="color: #777">some colour</span>.</p>');
        expect(actual).to.deep.equal(doc(p(
          'Text with ',
          textColor({ color: '#777777' })('some colour'),
          '.'
        )));
      });

      it('normalizes named HTML colours to hex when parsing', () => {
        const actual = parse('<p>Text with <span style="color: papayawhip">some colour</span>.</p>');
        expect(actual).to.deep.equal(doc(p(
          'Text with ',
          textColor({ color: '#ffefd5' })('some colour'),
          '.'
        )));
      });

      check('<i><sub> nesting',
        '<p>Text with <i><sub>subscript emphasised words</sub></i>.</p>',
        doc(p(
          'Text with ',
          em(sub('subscript emphasised words')),
          '.'
        )));

      check('<sub><i> nesting',
        '<p>Text with <sub><i>subscript emphasised words</i></sub>.</p>',
        doc(p(
          'Text with ',
          em(sub('subscript emphasised words')),
          '.'
        )));

      check('<i><sup> nesting',
        '<p>Text with <i><sup>subscript emphasised words</sup></i>.</p>',
        doc(p(
          'Text with ',
          em(sup('subscript emphasised words')),
          '.'
        )));

      check('<sup><i> nesting',
        '<p>Text with <sup><i>subscript emphasised words</i></sup>.</p>',
        doc(p(
          'Text with ',
          em(sup('subscript emphasised words')),
          '.'
        )));

      check('<i><code> nesting',
        '<p>Text <i>in italics <span style="font-family: monospace;">AND SOME CODE</span> and others italics</i> and plain.</p>',
        doc(p(
          'Text ',
          em(
            'in italics ',
            code('AND SOME CODE'),
            ' and others italics'
          ),
          ' and plain.'
        )));
    });

    describe('heading:', () => {
      check('<h1>',
        '<h1>Read all about it!</h1>',
        doc(h1('Read all about it!')));

      check('<h2>',
        '<h2>Read all about it!</h2>',
        doc(h2('Read all about it!')));

      check('<h3>',
        '<h3>Read all about it!</h3>',
        doc(h3('Read all about it!')));

      check('<h4>',
        '<h4>Read all about it!</h4>',
        doc(h4('Read all about it!')));

      check('<h5>',
        '<h5>Read all about it!</h5>',
        doc(h5('Read all about it!')));

      check('<h6>',
        '<h6>Read all about it!</h6>',
        doc(h6('Read all about it!')));

      it('should not parse any nested marks / <b>', () => {
        const actual = parse('<h1>Read all <b>about</b> it!</h1>');
        expect(actual).to.deep.equal(
          doc(h1('Read all about it!'))
        );
      });
      check('heading with invalid block content',
        '<h1><p>heading</p></h1>',
        doc(
          h1(
            confluenceUnsupportedInline('<p>heading</p>')
          )
        )
      );
    });

    describe('horizontal rule', () => {
      check('<hr />',
        '<hr />',
        doc(hr()));

      // The XHTML parser chokes parsing these, since technically <p> only permits
      // phrasing content, and <hr /> is not that (it's flow content). If we determine
      // that we want to support HTML-ish content (where a <hr /> would split a <p />)
      // we should uncomment these.

      // check('<p><hr /></p> nesting splits the paragraph',
      //   '<p><hr /></p>',
      //   doc(p(), hr(), p()));

      // check('<p><hr /><hr /></p> nesting splits the paragraph once',
      //   '<p><hr /><hr /></p>',
      //   doc(p(), hr(), hr(), p()));
    });

    describe('lists', () => {
      check('bullet list',
        '<ul><li>A piggy</li></ul>',
        doc(
          ul(
            li(p('A piggy'))
          )
        ));

      check('bullet list with strong',
        '<ul><li>A piggy</li><li><strong>Bigger</strong> piggy</li></ul>',
        doc(
          ul(
            li(p('A piggy')),
            li(p(strong('Bigger'), ' piggy'))
          )
        ));

      check('bullet list with direct paragraph',
        '<ul><p>a</p></ul>',
        doc(
          ul(
            li(p('a'))
          )
        ));

      check('bullet list with non listItem child, it will try to wrap it with listItem',
        '<ul>a</ul>',
        doc(
          ul(
            li(p('a'))
          )
        ));

      check('ordered list',
        '<ol><li>A piggy</li></ol>',
        doc(
          ol(
            li(p('A piggy'))
          )
        ));

      check('ordered list with strong',
        '<ol><li>A piggy</li><li><strong>Bigger</strong> piggy</li></ol>',
        doc(
          ol(
            li(p('A piggy')),
            li(p(strong('Bigger'), ' piggy'))
          )
        ));

      check('ordered list with direct paragraph',
        '<ol><p>a</p></ol>',
        doc(
          ol(
            li(p('a'))
          )
        ));

      check('ordered list with non listItem child, it will try to wrap it with listItem',
        '<ol>a</ol>',
        doc(
          ol(
            li(p('a'))
          )
        ));
    });

    describe('blockquote', () => {
      check('with text',
        '<blockquote>Elementary my dear Watson</blockquote>',
        doc(blockquote(p('Elementary my dear Watson'))));

      check('with partially strong text',
        '<blockquote>Elementary my <strong>dear</strong> Watson</blockquote>',
        doc(blockquote(p('Elementary my ', strong('dear'), ' Watson'))));

      check('with a paragraph',
        '<blockquote><p>Elementary my dear Watson</p></blockquote>',
        doc(blockquote(p('Elementary my dear Watson'))));
    });

    describe('table', () => {
      check('with header column',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><td><p>1</p></td><td><p>2</p></td></tr><tr><th><p>two</p></th><td><p>3</p></td><td><p>4</p></td></tr></tbody></table>',
        doc(table(
          tr(th({})(p('one')), td({})(p('1')), td({})(p('2'))),
          tr(th({})(p('two')), td({})(p('3')), td({})(p('4')))
        )));

      check('with header row',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><th><p>two</p></th><th><p>three</p></th></tr><tr><td><p>1</p></td><td><p>2</p></td><td><p>3</p></td></tr></tbody></table>',
        doc(table(
          tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
          tr(td({})(p('1')), td({})(p('2')), td({})(p('3')))
        )));

      check('with header row and header column',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><th><p>two</p></th><th><p>three</p></th></tr><tr><th><p>four</p></th><td><p>1</p></td><td><p>2</p></td></tr></tbody></table>',
        doc(table(
          tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
          tr(th({})(p('four')), td({})(p('1')), td({})(p('2')))
        )));
    });


    describe('code block', () => {
      check('with CDATA',
        '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
        doc(codeblock()('some code')));

      check('with multiline CDATA',
        `<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code
        on
        multiple
        lines]]></ac:plain-text-body></ac:structured-macro>`,
        doc(codeblock()(`some code
        on
        multiple
        lines`)));

      check('with title',
        '<ac:structured-macro ac:name="code"><ac:parameter ac:name="title">Code</ac:parameter><ac:parameter ac:name="language">js</ac:parameter><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
        doc(h5('Code'), codeblock({ language: 'js' })('some code')));

      context('when language is not set', () => {
        check(`has language attribute as null`,
          `<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>`,
          doc(codeblock({ language: null })('some code')));
      });

      context('when language is set', () => {
        Object.keys(LANGUAGE_MAP).forEach(languageName => {
          check(`with language "${languageName}"`,
            `<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">${LANGUAGE_MAP[languageName]}</ac:parameter><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>`,
            doc(codeblock({ language: LANGUAGE_MAP[languageName] })('some code')));
        });
      });

      context('when pasted from Editor', () => {
        check('with language',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-parameters="language=js" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN9&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(codeblock({ language: 'js' })('const speed = 350;')));

        check('with title',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-parameters="title=hello" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(h5('hello'), codeblock({ language: null })('const speed = 350;')));

        check('with language and title',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="80adec37-7fd5-4533-88a6-5f958c9957ba" data-macro-parameters="language=js|title=hello" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-mce-style="background-image: url(\'https://pm-temp-201701.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2\'); background-repeat: no-repeat;" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(h5('hello'), codeblock({ language: 'js' })('const speed = 350;')));

        check('with no parameters',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="80adec37-7fd5-4533-88a6-5f958c9957ba" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-mce-style="background-image: url(\'https://pm-temp-201701.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2\'); background-repeat: no-repeat;" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(codeblock({ language: null })('const speed = 350;')));
      });

      context('when pasted from View', () => {
        check('with language and title',
          '<div class="codeHeader panelHeader pdl" style="margin: 0px; padding: 5px 15px; border-bottom: 1px solid rgb(204, 204, 204); background: rgb(245, 245, 245); text-align: left; overflow: hidden; position: relative; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><b style="color: rgb(51, 51, 51);">hello</b></div><div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(h5('hello'), codeblock({ language: 'js' })('const speed = 350;')));

        check('with language',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(codeblock({ language: 'js' })('const speed = 350;')));

        check('with no parameters (java language by default)',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  java" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(codeblock({ language: 'java' })('const speed = 350;')));

        check('<pre>',
          '<pre style="margin: 0px; padding: 0px; font-family: ConfluenceInstalledFont, monospace; line-height: 1.3; color: rgb(51, 51, 51); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">const x = 13;</pre>',
          doc(codeblock({ language: null })('const x = 13;')));

        check('with whitespace',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_338782" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 957px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" resolved="" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 957px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 942px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const x = 111;</code></div><div class="line number2 index1 alt1" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">function hello () {}</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(codeblock({ language: 'js' })('const x = 111;\nfunction hello () {}')));
      });
    });

    describe('panel', () => {
      context('when panels are nested', () => {
        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(`${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><ac:structured-macro ac:name="info" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p></p></ac:rich-text-body></ac:structured-macro></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType })(panel('info')(p()))));
        });
      });

      context('when panel does not have any content', () => {
        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(`${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p></p></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType })(p())));
        });
      });

      context('when panel does not have title', () => {
        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(`${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p>${panelType} panel</p></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType })(p(`${panelType} panel`))));
        });
      });
      context('when panel has title', () => {
        const title = 'Panel title';

        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(`${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">${title}</ac:parameter><ac:rich-text-body><p>${panelType} panel</p></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType })(h3(title), p(`${panelType} panel`))));
        });
      });
      context('when panel has multiple top-level nodes', () => {
        const title = 'Panel title';

        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(`${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">${title}</ac:parameter><ac:rich-text-body><p>p1</p><p>p2</p><h5>h5</h5></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType })(h3(title), p('p1'), p('p2'), h5('h5'))));
        });
      });
    });

    describe('jira issue', () => {
      check(
        'basic',
        '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="a1a887df-a2dd-492b-8b5c-415d8eab22cf"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter><ac:parameter ac:name="key">ED-1068</ac:parameter></ac:structured-macro></p>',
        doc(
          p(
            confluenceJiraIssue({
              issueKey: 'ED-1068',
              macroId: 'a1a887df-a2dd-492b-8b5c-415d8eab22cf',
              schemaVersion: '1',
              server: 'JIRA (product-fabric.atlassian.net)',
              serverId: '70d83bc8-0aff-3fa5-8121-5ae90121f5fc',
            })
          )
        )
      );
    });

  });

  describe('inline-macro', () => {
    const macroId = '39f3436e-880e-4411-8494-869a59eb203f';
    const name = 'status';
    const placeholderUrl = 'www.google.com/placeholder.png';

    check(
      'basic',
      `<ac:structured-macro ac:name= "${name}" ac:schema-version= "1" ac:macro-id= "${macroId}"><ac:parameter ac:name= "subtle">true</ac:parameter><ac:parameter ac:name= "colour">Red</ac:parameter><fab:placeholder-url>${placeholderUrl}</fab:placeholder-url><fab:display-type>INLINE</fab:display-type></ac:structured-macro>`,
      doc(
        p(
          inlineMacro({
            macroId,
            name,
            placeholderUrl,
            params: {subtle: 'true', colour: 'Red'}
          })
        )
      )
    );
  });

  describe('unsupported content', () => {
    check('inline ac:structured-macro in p',
      '<p><ac:structured-macro name="foo"/></p>',
      doc(p(confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'))));

    check('inline ac:structured-macro with unknown ac:name key',
      '<p><ac:structured-macro ac:name="blabla"/></p>',
      doc(p(confluenceUnsupportedInline('<ac:structured-macro ac:name="blabla"/>'))));

    check('inline ac:structured-macro with JIRA issues list',
      '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro></p>',
      doc(p(confluenceUnsupportedInline('<ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro>'))));

    check('inline ac:structured-macro in p (multiple)',
      '<p><ac:structured-macro name="foo"/><ac:structured-macro name="bar"/></p>',
      doc(p(
        confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'),
        confluenceUnsupportedInline('<ac:structured-macro name="bar"/>'),
      )));

    check('inline ac:structured-macro in p with text',
      '<p>foo <ac:structured-macro name="foo"/></p>',
      doc(p('foo', confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'))));

    check('inline ac:structured-macro>ac:property in p',
      '<p><ac:structured-macro name="foo"><ac:property/></ac:structured-macro></p>',
      doc(p(confluenceUnsupportedInline('<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>'))));

    check('inline ac:structured-macro>ac:property in p (multiple)',
      '<p><ac:structured-macro name="foo"><ac:property/></ac:structured-macro><ac:structured-macro name="foo"><ac:property/></ac:structured-macro></p>',
      doc(p(
        confluenceUnsupportedInline('<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>'),
        confluenceUnsupportedInline('<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>'),
      )));

    check('block ac:structured-macro',
      '<ac:structured-macro name="foo"/>',
      doc(confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>')));

    check('block ac:structured-macro (multiple)',
      '<ac:structured-macro name="foo"/><ac:structured-macro name="bar"/>',
      doc(
        confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>'),
        confluenceUnsupportedBlock('<ac:structured-macro name="bar"/>'),
      ));

    check('block h2, ac:structured-macro',
      '<h2>foo</h2><ac:structured-macro name="foo"/>',
      doc(
        h2('foo'),
        confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>'),
      ));

    describe('noformat', () => {
      // NB: encoding should work into ac:structured-macro name="code"
      it('block ac:structured-macro noformat: parses CXHTML to codeBlock', () => {
        const actual = parse(`<ac:structured-macro ac:name="noformat" ac:schema-version="1" ac:macro-id="139765c9-74b9-4e21-8335-6844d10ce18b"><ac:plain-text-body><![CDATA[foo
  +// bar!]]></ac:plain-text-body></ac:structured-macro>`);
        expect(actual).to.deep.equal(doc(codeblock({ language: null })(`foo
  +// bar!`)));
      });

      context('when pasted from Editor', () => {
        it('block wysiwyg-macro noformat: parses CXHTML to codeBlock', () => {
          const actual = parse('<table class="wysiwyg-macro" data-macro-name="noformat" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-macro-id="d03bc664-56dd-4eb4-ac68-9eadfc3a9663" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 226px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e25vZm9ybWF0fQ&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; min-width: 200px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">No format content</pre></td></tr></tbody></table>');
          expect(actual).to.deep.equal(doc(codeblock({ language: null })('No format content')));
        });
      });

      context('when pasted from View', () => {
        it('<div class="preformatted panel">: parses CXHTML to codeBlock', () => {
          const actual = parse('<div class="preformatted panel" style="margin: 10px 0px; padding: 0px; color: rgb(51, 51, 51); border: 1px solid rgb(204, 204, 204); overflow: auto; border-radius: 3px; background-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div class="preformattedContent panelContent" style="margin: 0px; padding: 10px;"><pre style="margin: 0px; padding: 0px; font-family: ConfluenceInstalledFont, monospace; line-height: 1.3;">No format content</pre></div></div>');
          expect(actual).to.deep.equal(doc(codeblock({ language: null })('No format content')));
        });
      });
    });


    check('CDATA',
      '<![CDATA[some code]]>',
      doc(
        p('some code'),
      ));

    check('CDATA surrounded by whitespace',
      ' <![CDATA[some code]]> ',
      doc(
        p('some code'),
      ));

    check('h1 + macro with CDATA',
      '<h1>Code block</h1><ac:structured-macro ac:name="foo"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
      doc(
        h1('Code block'),
        confluenceUnsupportedBlock('<ac:structured-macro ac:name="foo"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>'),
      ));

    describe('ac:link', () => {
      check(
        'link to Confluence page',
        '<p><ac:link><ri:page ri:content-title="Questions test page"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline('<ac:link><ri:page ri:content-title="Questions test page"/></ac:link>')
          )
        )
      );

      check(
        'link to uploaded file',
        '<p><ac:link><ri:attachment ri:filename="Classic Minesweeper.pdf"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline('<ac:link><ri:attachment ri:filename="Classic Minesweeper.pdf"/></ac:link>')
          )
        )
      );

      check(
        'link to Confluence space',
        '<p><ac:link><ri:space ri:space-key="ZAA"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline('<ac:link><ri:space ri:space-key="ZAA"/></ac:link>')
          )
        )
      );
    });
  });

  describe('ac:emoticon', () => {
    check(
      'old emoticons are mapped to new emojis',
      '<p><ac:emoticon ac:name="smile" /></p>',
      doc(
        p(
          emoji({ id: '1f642', shortName: ':slight_smile:', text: '\uD83D\uDE42' })
        )
      )
    );

    check(
      'emoticons that will end up mapped to defaul fabric id emoji will preserve original ac:name',
      '<p><ac:emoticon ac:name="red-star"/></p>',
      doc(
        p(
          emoji({ id: '2b50', shortName: ':red-star:', text: '' })
        )
      )
    );

    check(
      'old HipChat emoticons are mapped to new',
      '<p><ac:hipchat-emoticon ac:shortcut="sadpanda" /></p>',
      doc(
        p(
          emoji({ id: 'atlassian-sadpanda', shortName: ':sadpanda:', text: '' })
        )
      )
    );

    check(
      'valid emoji with all fabric emoji attributes',
      '<p><ac:emoticon ac:name="blue-star" ac:emoji-id="1f61c" ac:emoji-shortname=":stuck_out_tongue_winking_eye:" ac:emoji-fallback="😜"/></p>',
      doc(
        p(
          emoji({ id: '1f61c', shortName: ':stuck_out_tongue_winking_eye:', text: '😜'})
        )
      )
    );

    it('valid emoji with all fabric emoji attributes encoded with ac:name="blue-star"', ()=>{
      const emoticon = encode(doc(p(emoji({ id: '1f61c', shortName: ':stuck_out_tongue_winking_eye:', text: '😜'}))));
      expect(emoticon).to.contain('ac:name="blue-star"');
    });

    it('hipchat-emoticons encoded with ac:name="blue-star" and preserve original ac:shortcut as ac:emoji-shortname', () => {
      const notMappedEmoticon = '<ac:hipchat-emoticon ac:shortcut="anything-not-supported" />';
      const encodedEmoticon = '<ac:emoticon ac:name="blue-star" ac:emoji-id="atlassian-anything-not-supported" ac:emoji-shortname=":anything-not-supported:"/>';
      expect(parse(notMappedEmoticon)).to.deep.equal(parse(encodedEmoticon));

      const notMappedEmoticonEncode = encode(parse(notMappedEmoticon));
      expect(notMappedEmoticonEncode).to.contain('ac:name="blue-star"');
      expect(notMappedEmoticonEncode).to.contain('ac:emoji-id="atlassian-anything-not-supported"');
      expect(notMappedEmoticonEncode).to.contain('ac:emoji-shortname=":anything-not-supported:"');
    });
  });

  describe('fabric mentions', () => {
    check(
      'with atlassian id and name',
      '<p>This is mention from <fab:link><fab:mention atlassian-id="557057:ff721128-093e-4357-8d8e-8caf869f577"><![CDATA[Artur Bodera]]></fab:mention></fab:link></p>',
      doc(
        p(
          'This is mention from ',
          mention({
            id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
            text: 'Artur Bodera'
          })
        )
      )
    );

    it('strips @ from mention text', () => {
      const docBefore = doc(p(
        '@ is stripped from this mention: ',
        mention({
          id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
          text: '@Artur Bodera'
        })
      ));

      const docAfter = doc(p(
        '@ is stripped from this mention: ',
        mention({
          id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
          text: 'Artur Bodera'
        })
      ));

      expect(parse(encode(docBefore))).to.deep.equal(docAfter);
    });
  });

  describe('media nodes', () => {
    check(
      'with minimal number of attributes',
      '<p><fab:media media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" media-type="file" media-collection="de7ae355-dcf3-4988-9785-bccb835830c4"></fab:media></p>',
      doc(
        mediaGroup(
          media({
            id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
            type: 'file',
            collection: 'de7ae355-dcf3-4988-9785-bccb835830c4'
          })
        )
      )
    );

    it('should encode/parse media nodes with own attributes', () => {
      const cxhtml = '<p><fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/></p>';
      const mediaNode = media({
        id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
        type: 'file',
        collection: 'de7ae355-dcf3-4988-9785-bccb835830c4',
        fileName: '2017-04-12 07.15.57.jpg',
        fileSize: 95316,
        fileMimeType: 'image/jpeg'
      });
      const docNode = doc(mediaGroup(mediaNode));

      // check that parsing/encoding is working as expected
      // plus takes node own attributes into account
      const parsed = parse(cxhtml);
      expect(parsed).to.deep.equal(docNode);
      expect(parse(encode(docNode))).to.deep.equal(docNode);

      // check that node attributes are set during parsing
      const parsedMediaNode = parsed.firstChild!.firstChild;
      expect(parsedMediaNode!.attrs.__fileName).to.equal('2017-04-12 07.15.57.jpg');
      expect(parsedMediaNode!.attrs.__fileSize).to.equal(95316);
      expect(parsedMediaNode!.attrs.__fileMimeType).to.equal('image/jpeg');
    });

    it('should put media and paragraph text into different block nodes (simple case)', () => {
      const cxhtml = `<p>
        my answer with attachment
        <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
        <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
        my answer with attachment 2
        <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
        my answer with attachment 3
        <fab:link><fab:mention atlassian-id="557057:ff721128-093e-4357-8d8e-8caf869f577"><![CDATA[Artur Bodera]]></fab:mention></fab:link>
      </p>`;

      const parseWrap = () => parse(cxhtml);
      assert.doesNotThrow(parseWrap, 'Parsing should not throw exception');

      const mediaNode = media({
        id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
        type: 'file',
        collection: 'de7ae355-dcf3-4988-9785-bccb835830c4',
        fileName: '2017-04-12 07.15.57.jpg',
        fileSize: 95316,
        fileMimeType: 'image/jpeg'
      });

      const docNode = doc(
        p('my answer with attachment '),
        mediaGroup(mediaNode, mediaNode),
        p('my answer with attachment 2 '),
        mediaGroup(mediaNode),
        p(
          'my answer with attachment 3 ',
          mention({
            id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
            text: 'Artur Bodera'
          })
        ),
      );

      expect(docNode).to.deep.equal(parseWrap());
    });
  });
});

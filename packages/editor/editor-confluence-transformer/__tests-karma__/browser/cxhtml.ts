import * as chai from 'chai';
import { expect } from 'chai';
import * as assert from 'assert';
import { Node as PMNode, Schema } from 'prosemirror-model';
import { confluenceSchemaWithMediaSingle as schema } from '@atlaskit/editor-common';
import { chaiPlugin } from '@atlaskit/editor-test-helpers';
import {
  blockquote,
  br,
  doc,
  em,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  li,
  code,
  ol,
  p,
  strike,
  strong,
  subsup,
  underline,
  ul,
  code_block,
  panel,
  mention,
  a,
  textColor,
  confluenceUnsupportedInline,
  confluenceUnsupportedBlock,
  confluenceJiraIssue,
  confluenceInlineComment,
  mediaGroup,
  mediaSingle,
  media,
  table,
  tr,
  td,
  th,
  inlineExtension,
  extension,
  bodiedExtension,
  emoji,
  taskList,
  taskItem,
  date,
  placeholder,
  decisionList,
  decisionItem,
  hardBreak,
} from '@atlaskit/editor-test-helpers';

import {
  ConfluenceTransformer,
  CONFLUENCE_LANGUAGE_MAP as LANGUAGE_MAP,
} from '../../src';
import { mapPanelTypeToPm } from '../../src/utils';
import { colors } from '@atlaskit/theme';

chai.use(chaiPlugin);

const transformer = new ConfluenceTransformer(schema);
const parse = (html: string) => transformer.parse(html);
const encode = (node: PMNode) => transformer.encode(node);

const checkFromCxhtmlToADF = (
  description: string,
  cxhtml: string,
  doc: (schema: Schema) => PMNode,
) =>
  it(`parses CXHTML: ${description}`, () => {
    const docNode = doc(schema);
    const actual = parse(cxhtml);
    expect(actual).to.deep.equal(docNode);
  });

const checkFromADFtoADF = (
  description: string,
  doc: (schema: Schema) => PMNode,
) =>
  it(`round-trips ADF: ${description}`, () => {
    const docNode = doc(schema);
    const roundTripped = parse(encode(docNode));
    expect(roundTripped).to.deep.equal(docNode);
  });

const checkFromADFtoCxhtml = (
  description: string,
  doc: (schema: Schema) => PMNode,
  cxhtml: string,
) =>
  it(`converts ADF to CXHTML: ${description}`, () => {
    const docNode = doc(schema);
    const roundTripped = encode(docNode);
    expect(roundTripped).to.deep.equal(cxhtml);
  });

const check = (
  description: string,
  cxhtml: string,
  doc: (schema: Schema) => PMNode,
) => {
  checkFromCxhtmlToADF(description, cxhtml, doc);
  checkFromADFtoADF(description, doc);
};

describe('ConfluenceTransformer: encode - parse:', () => {
  describe('empty', () => {
    check('empty', '', doc(p('')));
  });

  describe('basic formatting:', () => {
    describe('doc:', () => {
      check('it should generate a valid document', '<p>a</p>', doc(p('a')));

      check(
        'if doc content is not valid, it will be converted to UnsupportedBlock',
        '<li>a</li>',
        doc(confluenceUnsupportedBlock('<li>a</li>')),
      );
    });

    describe('text:', () => {
      check('basic text', 'War and peace', doc(p('War and peace')));

      check(
        '<span> with no attributes',
        '<span>War and peace</span>',
        doc(p('War and peace')),
      );
    });

    describe('paragraphs:', () => {
      check('a paragraph with text', '<p>Text here.</p>', doc(p('Text here.')));

      check('an empty paragraph', '<p></p>', doc(p('')));

      check(
        'two adjacent paragraphs',
        '<p>Text here.</p>\n<p>And more here.</p>',
        doc(p('Text here.'), p('And more here.')),
      );

      check(
        'a paragraph with a hard break in it',
        '<p>Text on two<br />lines.</p>',
        doc(p('Text on two', br(), 'lines.')),
      );

      check(
        'a paragraph with unsupported content',
        '<p><li>a</li></p>',
        doc(p(confluenceUnsupportedInline('<li>a</li>'))),
      );
    });

    describe('breaks:', () => {
      check('a self-closing break', '<br />', doc(p(br())));

      check(
        'a self-closing break in a paragraph',
        '<p><br /></p>',
        doc(p(br())),
      );
    });

    describe('marks formatting:', () => {
      check(
        '<u> tag',
        '<p>Text with <u>underline words</u>.</p>',
        doc(p('Text with ', underline('underline words'), '.')),
      );

      check(
        '<strong> tag',
        '<p>Text with <strong>bold words</strong>.</p>',
        doc(p('Text with ', strong('bold words'), '.')),
      );

      check(
        '<b> tag',
        '<p>Text with <b>bold words</b>.</p>',
        doc(p('Text with ', strong('bold words'), '.')),
      );

      check(
        '<s> tag',
        '<p>Text with <s>strikethrough words</s>.</p>',
        doc(p('Text with ', strike('strikethrough words'), '.')),
      );

      check(
        '<em> tag',
        '<p>Text with <em>emphasised words</em>.</p>',
        doc(p('Text with ', em('emphasised words'), '.')),
      );

      check(
        '<i> tag',
        '<p>Text with <i>emphasised words</i>.</p>',
        doc(p('Text with ', em('emphasised words'), '.')),
      );

      check(
        '<strong><em> nesting',
        '<p>Text with <strong><em>strong emphasised words</em></strong>.</p>',
        doc(p('Text with ', em(strong('strong emphasised words')), '.')),
      );

      check(
        '<em><strong> nesting',
        '<p>Text with <em><strong>strong emphasised words</strong></em>.</p>',
        doc(p('Text with ', em(strong('strong emphasised words')), '.')),
      );

      check(
        '<a> tag',
        '<p>Text with <a href="http://www.atlassian.com">www.atlassian.com</a></p>',
        doc(
          p(
            'Text with ',
            a({ href: 'http://www.atlassian.com' })('www.atlassian.com'),
          ),
        ),
      );

      check(
        'combination of strong and emphasis',
        '<p><b>Bold words,</b> and <i><strong>strongly emphasised words</strong></i>.</p>',
        doc(
          p(
            strong('Bold words,'),
            ' and ',
            em(strong('strongly emphasised words')),
            '.',
          ),
        ),
      );

      check('<del>', '<del>struck</del>', doc(p(strike('struck'))));

      check('<s>', '<s>struck</s>', doc(p(strike('struck'))));

      check(
        '<code>',
        '<p>Text with <span style="font-family: monospace;">function bar() { return foo; }</span>.</p>',
        doc(p('Text with ', code('function bar() { return foo; }'), '.')),
      );

      check(
        'Colored text',
        '<p>Text with <span style="color: rgb(34, 34, 34)">some colour</span>.</p>',
        doc(
          p('Text with ', textColor({ color: '#222222' })('some colour'), '.'),
        ),
      );

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
              })('inline comment'),
            ),
          ),
        );

        check(
          'marker without text',
          `<p>
            test
            <ac:inline-comment-marker ac:ref="2c469dac-f95f-4979-ba30-2a4cb705450a"></ac:inline-comment-marker>
            text
          </p>`,
          doc(p('test text')),
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
                  })('inline comment'),
                ),
              ),
            ),
          ),
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
              })(
                confluenceInlineComment({
                  reference: 'bar',
                })('ipsum '),
              ),
              confluenceInlineComment({
                reference: 'foo',
              })('dolor'),
            ),
          ),
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
              })(
                confluenceInlineComment({
                  reference: 'bar',
                })('ipsum '),
              ),
              confluenceInlineComment({
                reference: 'bar',
              })('dolor'),
            ),
          ),
        );
      });

      it('parses text color in hex', () => {
        const actual = parse(
          '<p>Text with <span style="color: #777777">some colour</span>.</p>',
        );
        expect(actual).to.deep.equal(
          doc(
            p(
              'Text with ',
              textColor({ color: '#777777' })('some colour'),
              '.',
            ),
          ),
        );
      });

      it('normalizes 3-hex colours to 6-hex when parsing', () => {
        const actual = parse(
          '<p>Text with <span style="color: #777">some colour</span>.</p>',
        );
        expect(actual).to.deep.equal(
          doc(
            p(
              'Text with ',
              textColor({ color: '#777777' })('some colour'),
              '.',
            ),
          ),
        );
      });

      check(
        '<i><sub> nesting',
        '<p>Text with <i><sub>subscript emphasised words</sub></i>.</p>',
        doc(
          p(
            'Text with ',
            em(subsup({ type: 'sub' })('subscript emphasised words')),
            '.',
          ),
        ),
      );

      check(
        '<sub><i> nesting',
        '<p>Text with <sub><i>subscript emphasised words</i></sub>.</p>',
        doc(
          p(
            'Text with ',
            em(subsup({ type: 'sub' })('subscript emphasised words')),
            '.',
          ),
        ),
      );

      check(
        '<i><sup> nesting',
        '<p>Text with <i><sup>subscript emphasised words</sup></i>.</p>',
        doc(
          p(
            'Text with ',
            em(subsup({ type: 'sup' })('subscript emphasised words')),
            '.',
          ),
        ),
      );

      check(
        '<sup><i> nesting',
        '<p>Text with <sup><i>subscript emphasised words</i></sup>.</p>',
        doc(
          p(
            'Text with ',
            em(subsup({ type: 'sup' })('subscript emphasised words')),
            '.',
          ),
        ),
      );

      check(
        '<i><code> nesting',
        '<p>Text <i>in italics <span style="font-family: monospace;">AND SOME CODE</span> and others italics</i> and plain.</p>',
        doc(
          p(
            'Text ',
            em('in italics ', code('AND SOME CODE'), ' and others italics'),
            ' and plain.',
          ),
        ),
      );
    });

    describe('heading:', () => {
      check(
        '<h1>',
        '<h1>Read all about it!</h1>',
        doc(h1('Read all about it!')),
      );

      check(
        '<h2>',
        '<h2>Read all about it!</h2>',
        doc(h2('Read all about it!')),
      );

      check(
        '<h3>',
        '<h3>Read all about it!</h3>',
        doc(h3('Read all about it!')),
      );

      check(
        '<h4>',
        '<h4>Read all about it!</h4>',
        doc(h4('Read all about it!')),
      );

      check(
        '<h5>',
        '<h5>Read all about it!</h5>',
        doc(h5('Read all about it!')),
      );

      check(
        '<h6>',
        '<h6>Read all about it!</h6>',
        doc(h6('Read all about it!')),
      );

      it('should not parse any nested marks / <b>', () => {
        const actual = parse('<h1>Read all <b>about</b> it!</h1>');
        expect(actual).to.deep.equal(
          doc(h1('Read all ', strong('about'), ' it!')),
        );
      });
      check(
        'heading with invalid block content',
        '<h1><p>heading</p></h1>',
        doc(h1(confluenceUnsupportedInline('<p>heading</p>'))),
      );
    });

    describe('horizontal rule', () => {
      check('<hr />', '<hr />', doc(hr()));

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
      check(
        'bullet list',
        '<ul><li>A piggy</li></ul>',
        doc(ul(li(p('A piggy')))),
      );

      check(
        'bullet list with strong',
        '<ul><li>A piggy</li><li><strong>Bigger</strong> piggy</li></ul>',
        doc(ul(li(p('A piggy')), li(p(strong('Bigger'), ' piggy')))),
      );

      check(
        'bullet list with direct paragraph',
        '<ul><p>a</p></ul>',
        doc(ul(li(p('a')))),
      );

      check(
        'bullet list with non listItem child, it will try to wrap it with listItem',
        '<ul>a</ul>',
        doc(ul(li(p('a')))),
      );

      check(
        'ordered list',
        '<ol><li>A piggy</li></ol>',
        doc(ol(li(p('A piggy')))),
      );

      check(
        'ordered list with strong',
        '<ol><li>A piggy</li><li><strong>Bigger</strong> piggy</li></ol>',
        doc(ol(li(p('A piggy')), li(p(strong('Bigger'), ' piggy')))),
      );

      check(
        'ordered list with direct paragraph',
        '<ol><p>a</p></ol>',
        doc(ol(li(p('a')))),
      );

      check(
        'ordered list with non listItem child, it will try to wrap it with listItem',
        '<ol>a</ol>',
        doc(ol(li(p('a')))),
      );
    });

    describe('blockquote', () => {
      check(
        'with text',
        '<blockquote>Elementary my dear Watson</blockquote>',
        doc(blockquote(p('Elementary my dear Watson'))),
      );

      check(
        'with partially strong text',
        '<blockquote>Elementary my <strong>dear</strong> Watson</blockquote>',
        doc(blockquote(p('Elementary my ', strong('dear'), ' Watson'))),
      );

      check(
        'with a paragraph',
        '<blockquote><p>Elementary my dear Watson</p></blockquote>',
        doc(blockquote(p('Elementary my dear Watson'))),
      );
    });

    describe('table', () => {
      check(
        'with header column',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><td><p>1</p></td><td><p>2</p></td></tr><tr><th><p>two</p></th><td><p>3</p></td><td><p>4</p></td></tr></tbody></table>',
        doc(
          table({ __autoSize: true })(
            tr(th({})(p('one')), td({})(p('1')), td({})(p('2'))),
            tr(th({})(p('two')), td({})(p('3')), td({})(p('4'))),
          ),
        ),
      );

      check(
        'with header row',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><th><p>two</p></th><th><p>three</p></th></tr><tr><td><p>1</p></td><td><p>2</p></td><td><p>3</p></td></tr></tbody></table>',
        doc(
          table({ __autoSize: true })(
            tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
            tr(td({})(p('1')), td({})(p('2')), td({})(p('3'))),
          ),
        ),
      );

      check(
        'with header row and header column',
        '<table class="confluenceTable"><tbody><tr><th><p>one</p></th><th><p>two</p></th><th><p>three</p></th></tr><tr><th><p>four</p></th><td><p>1</p></td><td><p>2</p></td></tr></tbody></table>',
        doc(
          table({ __autoSize: true })(
            tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
            tr(th({})(p('four')), td({})(p('1')), td({})(p('2'))),
          ),
        ),
      );

      let col1 = 340;
      check(
        'with fixed table and rowspan but missing col2',
        `<table class="wrapped"><colgroup><col style="width: ${col1}px;" /><col /></colgroup><tbody><tr><th>1</th><th>2</th></tr><tr><td>a</td><td>fdfdfddfdffdfdfdfdfdf</td></tr><tr><td>c</td><td rowspan="2">dkjlkjlklkjlkj</td></tr><tr><td colspan="1"></td></tr></tbody></table>`,
        doc(
          table()(
            tr(th({ colwidth: [col1] })(p('1')), th()(p('2'))),
            tr(
              td({ colwidth: [col1] })(p('a')),
              td()(p('fdfdfddfdffdfdfdfdfdf')),
            ),
            tr(
              td({ colwidth: [col1] })(p('c')),
              td({ rowspan: 2 })(p('dkjlkjlklkjlkj')),
            ),
            tr(td({ colwidth: [col1] })(p(''))),
          ),
        ),
      );

      let col2 = 977;
      check(
        'with fixed table and rowspan',
        `<table class="fixed-table wrapped"><colgroup><col style="width: ${col1}px;" /><col style="width: ${col2}px;" /></colgroup><tbody><tr><th>1</th><th>2</th></tr><tr><td>a</td><td>fdfdfddfdffdfdfdfdfdf</td></tr><tr><td>c</td><td rowspan="2">dkjlkjlklkjlkj</td></tr><tr><td colspan="1"></td></tr></tbody></table>`,
        doc(
          table()(
            tr(
              th({ colwidth: [col1] })(p('1')),
              th({ colwidth: [col2] })(p('2')),
            ),
            tr(
              td({ colwidth: [col1] })(p('a')),
              td({ colwidth: [col2] })(p('fdfdfddfdffdfdfdfdfdf')),
            ),
            tr(
              td({ colwidth: [col1] })(p('c')),
              td({ colwidth: [col2], rowspan: 2 })(p('dkjlkjlklkjlkj')),
            ),
            tr(td({ colwidth: [col1] })(p(''))),
          ),
        ),
      );

      function calcColumnWidths(
        editorWidthPx: number,
        tableWidthPct: number,
        columns: number[],
      ): number[] {
        const relativeTableWidthPx = Math.round(
          tableWidthPct * (editorWidthPx / 100),
        );
        return columns.map(relativeColumnPct =>
          Math.round(relativeTableWidthPx * (relativeColumnPct / 100)),
        );
      }

      // for relative tables we translate them to pixels, which is relative to the editor viewport
      const EDITOR_WIDTH = 680;

      const table1WidthPct = 46;
      const table1ColumnPct = [21, 4, 74];
      const table1ColumnPx = calcColumnWidths(
        EDITOR_WIDTH,
        table1WidthPct,
        table1ColumnPct,
      );

      check(
        'with relative table and colspan',
        `<table class="relative-table wrapped" style="width: ${table1WidthPct}%;"><colgroup><col style="width: ${
          table1ColumnPct[0]
        }%;" /><col style="width: ${
          table1ColumnPct[1]
        }%;" /><col style="width: ${
          table1ColumnPct[2]
        }%;" /></colgroup><tbody><tr><th>1</th><th>2</th><th>3</th></tr><tr><td colspan="2"><br />asd</td><td>asd</td></tr><tr><td>d</td><td colspan="2">asd</td></tr></tbody></table>`,
        doc(
          table()(
            tr(
              th({ colwidth: [table1ColumnPx[0]] })(p('1')),
              th({ colwidth: [table1ColumnPx[1]] })(p('2')),
              th({ colwidth: [table1ColumnPx[2]] })(p('3')),
            ),
            tr(
              td({
                colwidth: [table1ColumnPx[0], table1ColumnPx[1]],
                colspan: 2,
              })(p(hardBreak(), 'asd')),
              td({ colwidth: [table1ColumnPx[2]] })(p('asd')),
            ),
            tr(
              td({ colwidth: [table1ColumnPx[0]] })(p('d')),
              td({
                colwidth: [table1ColumnPx[1], table1ColumnPx[2]],
                colspan: 2,
              })(p('asd')),
            ),
          ),
        ),
      );

      const table2WidthPct = 31;
      const table2ColumnPct = [23, 46, 22];
      const table2ColumnPx = calcColumnWidths(
        EDITOR_WIDTH,
        table2WidthPct,
        table2ColumnPct,
      );

      check(
        'with numbering column and background colors',
        `<table class="relative-table wrapped" style="width: ${table2WidthPct}%;"><colgroup><col /><col style="width: ${
          table2ColumnPct[0]
        }%;" /><col style="width: ${
          table2ColumnPct[1]
        }%;" /><col style="width: ${
          table2ColumnPct[2]
        }%;" /></colgroup><tbody><tr><th class="numberingColumn"><br /></th><th>one</th><th>two</th><th>three</th></tr><tr><td class="numberingColumn">1</td><td>14</td><td>2</td><td>3</td></tr><tr><td class="numberingColumn">2</td><td><br /></td><td class="highlight-green" data-highlight-colour="green">5</td><td class="highlight-green" data-highlight-colour="green"><p>6</p></td></tr><tr><td class="numberingColumn" colspan="1">3</td><td colspan="1"><br /></td><td class="highlight-blue" colspan="1" data-highlight-colour="blue"><br /></td><td class="highlight-blue" colspan="1" data-highlight-colour="blue"><br /></td></tr><tr><th class="numberingColumn">123</th><th colspan="1">qwe</th><th colspan="1"><br /></th><th colspan="1"><p><br /></p></th></tr><tr><td class="numberingColumn" colspan="1">4</td><td colspan="1"><br /></td><td colspan="1"><br /></td><td colspan="1"><br /></td></tr><tr><td class="numberingColumn" colspan="1">5</td><td colspan="1"><br /></td><td colspan="1"><br /></td><td colspan="1"><br /></td></tr><tr><td class="numberingColumn highlight-red" colspan="1" data-highlight-colour="red">6</td><td colspan="1"><br /></td><td colspan="1"><br /></td><td colspan="1"><br /></td></tr><tr><td class="numberingColumn highlight-red" colspan="1" data-highlight-colour="red">7</td><td colspan="1"><br /></td><td colspan="1"><br /></td><td colspan="1"><br /></td></tr></tbody></table>`,
        doc(
          table({ isNumberColumnEnabled: true })(
            tr(
              th({ colwidth: [42] })(p(hardBreak())),
              th({ colwidth: [table2ColumnPx[0]] })(p('one')),
              th({ colwidth: [table2ColumnPx[1]] })(p('two')),
              th({ colwidth: [table2ColumnPx[2]] })(p('three')),
            ),
            tr(
              td({ colwidth: [42] })(p('1')),
              td({ colwidth: [table2ColumnPx[0]] })(p('14')),
              td({ colwidth: [table2ColumnPx[1]] })(p('2')),
              td({ colwidth: [table2ColumnPx[2]] })(p('3')),
            ),
            tr(
              td({ colwidth: [42] })(p('2')),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({
                colwidth: [table2ColumnPx[1]],
                background: colors.G50.toLowerCase(),
              })(p('5')),
              td({
                colwidth: [table2ColumnPx[2]],
                background: colors.G50.toLowerCase(),
              })(p('6')),
            ),
            tr(
              td({ colwidth: [42] })(p('3')),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({
                colwidth: [table2ColumnPx[1]],
                background: colors.B50.toLowerCase(),
              })(p(hardBreak())),
              td({
                colwidth: [table2ColumnPx[2]],
                background: colors.B50.toLowerCase(),
              })(p(hardBreak())),
            ),
            tr(
              th({ colwidth: [42] })(p('123')),
              th({ colwidth: [table2ColumnPx[0]] })(p('qwe')),
              th({ colwidth: [table2ColumnPx[1]] })(p(hardBreak())),
              th({ colwidth: [table2ColumnPx[2]] })(p(hardBreak())),
            ),
            tr(
              td({ colwidth: [42] })(p('4')),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[1]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[2]] })(p(hardBreak())),
            ),
            tr(
              td({ colwidth: [42] })(p('5')),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[1]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[2]] })(p(hardBreak())),
            ),
            tr(
              td({ colwidth: [42], background: colors.R50.toLowerCase() })(
                p('6'),
              ),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[1]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[2]] })(p(hardBreak())),
            ),
            tr(
              td({ colwidth: [42], background: colors.R50.toLowerCase() })(
                p('7'),
              ),
              td({ colwidth: [table2ColumnPx[0]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[1]] })(p(hardBreak())),
              td({ colwidth: [table2ColumnPx[2]] })(p(hardBreak())),
            ),
          ),
        ),
      );
    });

    describe('code block', () => {
      check(
        'with CDATA',
        '<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
        doc(code_block()('some code')),
      );

      check(
        'with multiline CDATA',
        `<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code
        on
        multiple
        lines]]></ac:plain-text-body></ac:structured-macro>`,
        doc(
          code_block()(`some code
        on
        multiple
        lines`),
        ),
      );

      check(
        'with title',
        '<ac:structured-macro ac:name="code"><ac:parameter ac:name="title">Code</ac:parameter><ac:parameter ac:name="language">js</ac:parameter><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
        doc(h5('Code'), code_block({ language: 'js' })('some code')),
      );

      describe('when language is not set', () => {
        check(
          `has language attribute as null`,
          `<ac:structured-macro ac:name="code"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>`,
          doc(code_block({ language: null })('some code')),
        );
      });

      describe('when language is set', () => {
        Object.keys(LANGUAGE_MAP).forEach(languageName => {
          check(
            `with language "${languageName}"`,
            `<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">${
              LANGUAGE_MAP[languageName]
            }</ac:parameter><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>`,
            doc(
              code_block({ language: LANGUAGE_MAP[languageName] })('some code'),
            ),
          );
        });
      });

      describe('when pasted from Editor', () => {
        check(
          'with language',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-parameters="language=js" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN9&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(code_block({ language: 'js' })('const speed = 350;')),
        );

        check(
          'with title',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-parameters="title=hello" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(
            h5('hello'),
            code_block({ language: null })('const speed = 350;'),
          ),
        );

        check(
          'with language and title',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="80adec37-7fd5-4533-88a6-5f958c9957ba" data-macro-parameters="language=js|title=hello" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-mce-style="background-image: url(\'https://pm-temp-201701.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2\'); background-repeat: no-repeat;" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(
            h5('hello'),
            code_block({ language: 'js' })('const speed = 350;'),
          ),
        );

        check(
          'with no parameters',
          '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="80adec37-7fd5-4533-88a6-5f958c9957ba" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-mce-style="background-image: url(\'https://pm-temp-201701.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2\'); background-repeat: no-repeat;" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 637px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9anN8dGl0bGU9aGVsbG99&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">const speed = 350;</pre></td></tr></tbody></table>',
          doc(code_block({ language: null })('const speed = 350;')),
        );
      });

      describe('when pasted from View', () => {
        check(
          'with language and title',
          '<div class="codeHeader panelHeader pdl" style="margin: 0px; padding: 5px 15px; border-bottom: 1px solid rgb(204, 204, 204); background: rgb(245, 245, 245); text-align: left; overflow: hidden; position: relative; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><b style="color: rgb(51, 51, 51);">hello</b></div><div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(
            h5('hello'),
            code_block({ language: 'js' })('const speed = 350;'),
          ),
        );

        check(
          'with language',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(code_block({ language: 'js' })('const speed = 350;')),
        );

        check(
          'with no parameters (java language by default)',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; width: 656.359px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_427012" class="syntaxhighlighter sh-confluence nogutter  java" style="margin: 0px; padding: 0px; width: 656.359px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 656px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 641px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const speed = 350;</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(code_block({ language: 'java' })('const speed = 350;')),
        );

        check(
          '<pre>',
          '<pre style="margin: 0px; padding: 0px; font-family: ConfluenceInstalledFont, monospace; line-height: 1.3; color: rgb(51, 51, 51); font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-style: initial; text-decoration-color: initial;">const x = 13;</pre>',
          doc(code_block({ language: null })('const x = 13;')),
        );

        check(
          'with whitespace',
          '<div class="codeContent panelContent pdl" style="margin: 0px; padding: 0px; background: rgb(255, 255, 255); color: rgb(51, 51, 51); text-align: left; font-size: 14px; line-height: 20px; overflow: hidden; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px; font-family: Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div style="margin: 0px; padding: 0px;"><div id="highlighter_338782" class="syntaxhighlighter sh-confluence nogutter  js" style="margin: 0px; padding: 0px; width: 957px; position: relative; overflow: auto; font-size: 1em; background-color: rgb(255, 255, 255) !important;"><table border="0" cellpadding="0" cellspacing="0" resolved="" style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 957px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tbody style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><tr style="border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><td class="code" style="border: 0px; background: 0px center; overflow: visible; border-radius: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; padding: 0px 0px 0px 15px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: 942px; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit;"><div class="container" title="Hint: double-click to select code" style="margin: 15px 0px 0px; padding: 0px 0px 15px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: relative; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: pre-wrap;"><div class="line number1 index0 alt2" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">const x = 111;</code></div><div class="line number2 index1 alt1" style="margin: 0px; padding: 0px 1em 0px 0px; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; outline: 0px; overflow: visible; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; white-space: nowrap;"><code class="js plain" style="font-family: Consolas, &quot;Bitstream Vera Sans Mono&quot;, &quot;Courier New&quot;, Courier, monospace; border-radius: 0px; background: 0px center; border: 0px; bottom: auto; float: none; height: auto; left: auto; line-height: 20px; margin: 0px; outline: 0px; overflow: visible; padding: 0px; position: static; right: auto; text-align: left; top: auto; vertical-align: baseline; width: auto; box-sizing: content-box; font-weight: normal; font-style: normal; font-size: 14px; min-height: inherit; color: rgb(0, 0, 0) !important;">function hello () {}</code></div></div></td></tr></tbody></table></div></div></div>',
          doc(
            code_block({ language: 'js' })(
              'const x = 111;\nfunction hello () {}',
            ),
          ),
        );
      });
    });

    describe('panel', () => {
      describe('when panel does not have any content', () => {
        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(
            `${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p></p></ac:rich-text-body></ac:structured-macro>`,
            doc(panel({ panelType: mapPanelTypeToPm(panelType) })(p(''))),
          );
        });
      });

      describe('when panel does not have title', () => {
        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(
            `${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p>${panelType} panel</p></ac:rich-text-body></ac:structured-macro>`,
            doc(
              panel({ panelType: mapPanelTypeToPm(panelType) })(
                p(`${panelType} panel`),
              ),
            ),
          );
        });
      });
      describe('when panel has title', () => {
        const title = 'Panel title';

        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(
            `${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">${title}</ac:parameter><ac:rich-text-body><p>${panelType} panel</p></ac:rich-text-body></ac:structured-macro>`,
            doc(
              panel({ panelType: mapPanelTypeToPm(panelType) })(
                h3(title),
                p(`${panelType} panel`),
              ),
            ),
          );
        });
      });
      describe('when panel has multiple top-level nodes', () => {
        const title = 'Panel title';

        ['warning', 'tip', 'info', 'note'].forEach(panelType => {
          check(
            `${panelType} panel`,
            `<ac:structured-macro ac:name="${panelType}" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">${title}</ac:parameter><ac:rich-text-body><p>p1</p><p>p2</p><h5>h5</h5></ac:rich-text-body></ac:structured-macro>`,
            doc(
              panel({ panelType: mapPanelTypeToPm(panelType) })(
                h3(title),
                p('p1'),
                p('p2'),
                h5('h5'),
              ),
            ),
          );
        });
      });

      describe('panel macro', () => {
        check(
          `panel macro = "note" (purple) panel`,
          `<ac:structured-macro ac:name="panel" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:rich-text-body><p>note panel</p></ac:rich-text-body><ac:parameter ac:name="borderColor">#998DD9</ac:parameter><ac:parameter ac:name="bgColor">#EAE6FF</ac:parameter></ac:structured-macro>`,
          doc(panel({ panelType: 'note' })(p('note panel'))),
        );
      });
    });

    describe('jira issue', () => {
      check(
        'basic',
        '<p><ac:structured-macro ac:name="jira" ac:schema-version="3" ac:macro-id="a1a887df-a2dd-492b-8b5c-415d8eab22cf"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter><ac:parameter ac:name="key">ED-1068</ac:parameter></ac:structured-macro></p>',
        doc(
          p(
            confluenceJiraIssue({
              issueKey: 'ED-1068',
              macroId: 'a1a887df-a2dd-492b-8b5c-415d8eab22cf',
              schemaVersion: '3',
              server: 'JIRA (product-fabric.atlassian.net)',
              serverId: '70d83bc8-0aff-3fa5-8121-5ae90121f5fc',
            })(),
          ),
        ),
      );
    });
  });

  describe('extension', () => {
    const macroParams = {
      color: { value: 'Green' },
      title: { value: 'OK' },
    };
    const macroMetadata = {
      macroId: { value: String(new Date().valueOf()) },
      placeholder: [
        {
          data: { url: 'www.google.com/placeholder.png' },
          type: 'image',
        },
      ],
      schemaVersion: { value: '2' },
    };
    const attrs = {
      extensionType: 'com.atlassian.confluence.macro.core',
      extensionKey: 'status',
      parameters: {
        macroParams,
        macroMetadata,
      },
    };
    const paramsAsCXHTML = Object.keys(macroParams).map(
      key =>
        `<ac:parameter ac:name="${key}">${
          macroParams[key].value
        }</ac:parameter>`,
    );

    describe('inlineExtension', () => {
      checkFromCxhtmlToADF(
        'basic',
        `<ac:structured-macro ac:name="${
          attrs.extensionKey
        }" ac:schema-version="2" ac:macro-id="${
          macroMetadata.macroId.value
        }">${paramsAsCXHTML}<fab:placeholder-url>${
          macroMetadata.placeholder[0].data.url
        }</fab:placeholder-url><fab:display-type>INLINE</fab:display-type></ac:structured-macro>`,
        doc(p(inlineExtension(attrs)())),
      );

      checkFromADFtoCxhtml(
        'basic',
        doc(p(inlineExtension(attrs)())),
        `<p><fab:adf><![CDATA[${JSON.stringify(
          inlineExtension(attrs)()(schema).toJSON(),
        )}]]></fab:adf></p>`,
      );
    });

    describe('bodyless', () => {
      checkFromCxhtmlToADF(
        'basic',
        `<ac:structured-macro ac:name="${
          attrs.extensionKey
        }" ac:schema-version="2" ac:macro-id="${
          macroMetadata.macroId.value
        }">${paramsAsCXHTML}<fab:placeholder-url>${
          macroMetadata.placeholder[0].data.url
        }</fab:placeholder-url><fab:display-type>BLOCK</fab:display-type></ac:structured-macro>`,
        doc(extension(attrs)()),
      );
    });

    describe('bodiedExtension', () => {
      checkFromCxhtmlToADF(
        'basic',
        `<ac:structured-macro ac:name="${
          attrs.extensionKey
        }" ac:schema-version="2" ac:macro-id="${
          macroMetadata.macroId.value
        }">${paramsAsCXHTML}<fab:placeholder-url>${
          macroMetadata.placeholder[0].data.url
        }</fab:placeholder-url>
          <fab:display-type>BLOCK</fab:display-type>
          <ac:rich-text-body><p>little<strong>piggy</strong></p></ac:rich-text-body>
        </ac:structured-macro>`,
        doc(bodiedExtension(attrs)(p('little', strong('piggy')))),
      );
    });
  });

  describe('date', () => {
    const iso = '2018-03-23';
    check(
      'date node',
      `<time datetime="${iso}"></time>`,
      doc(p(date({ timestamp: Date.parse(iso) }))),
    );
  });

  describe('placeholder', () => {
    const text = 'Write something...';
    check(
      'placeholder node',
      `<ac:placeholder>${text}</ac:placeholder>`,
      doc(p(placeholder({ text }))),
    );
  });

  describe('taskList', () => {
    check(
      'taskList with incomplete task items',
      '<ac:task-list><ac:task><ac:task-id>1</ac:task-id><ac:task-status>incomplete</ac:task-status><ac:task-body><span class="placeholder-inline-tasks">hello</span></ac:task-body></ac:task><ac:task><ac:task-id>2</ac:task-id><ac:task-status>incomplete</ac:task-status><ac:task-body><span class="placeholder-inline-tasks">there</span></ac:task-body></ac:task></ac:task-list>',
      doc(
        taskList({})(
          taskItem({ localId: '1' })('hello'),
          taskItem({ localId: '2' })('there'),
        ),
      ),
    );

    check(
      'taskList with complete task items',
      '<ac:task-list><ac:task><ac:task-id>1</ac:task-id><ac:task-status>incomplete</ac:task-status><ac:task-body><span class="placeholder-inline-tasks">hello</span></ac:task-body></ac:task><ac:task><ac:task-id>2</ac:task-id><ac:task-status>complete</ac:task-status></ac:task></ac:task-list>',
      doc(
        taskList({})(
          taskItem({ localId: '1' })('hello'),
          taskItem({ localId: '2', state: 'DONE' })(''),
        ),
      ),
    );
  });

  describe('fab:adf', () => {
    check(
      'p encoded in fab:adf tag between two p',
      String.raw`<p>hello</p><fab:adf><![CDATA[{"type":"paragraph","content":[{"type":"text","text":"storage"}]}]]></fab:adf><p>world</p>`,
      doc(p('hello'), p('storage'), p('world')),
    );

    describe('decisionList', () => {
      check(
        'decisionList with single decided item between p',
        String.raw`<p>hello</p><fab:adf><![CDATA[{"type":"decisionList","attrs":{"localId":"test-list-id"},"content":[{"type":"decisionItem","attrs":{"localId":"test-id","state":"DECIDED"},"content":[{"type":"text","text":"Heading"}]}]}]]></fab:adf><p>world</p>`,
        doc(
          p('hello'),
          decisionList({ localId: 'test-list-id' })(
            decisionItem({ localId: 'test-id', state: 'DECIDED' })('Heading'),
          ),
          p('world'),
        ),
      );
    });

    describe('link', () => {
      check(
        'renamed link to a confluence space, between p',
        String.raw`<p>hello</p><p><fab:adf><![CDATA[{"type":"text","marks":[{"type":"link","attrs":{"href":"www.atlassian.com","__confluenceMetadata":{"linkType":"page","versionAtSave":"1","fileName":null,"spaceKey":"TESTSPACE","contentTitle":"Actual page title","isRenamedTitle":true,"anchorName":null}}}],"text":"This is a renamed link"}]]></fab:adf></p><p>world</p>`,
        doc(
          p('hello'),
          p(
            a({
              href: 'www.atlassian.com',
              __confluenceMetadata: {
                linkType: 'page',
                versionAtSave: '1',
                fileName: null,
                spaceKey: 'TESTSPACE',
                contentTitle: 'Actual page title',
                isRenamedTitle: true,
                anchorName: null,
              },
            })('This is a renamed link'),
          ),
          p('world'),
        ),
      );
    });
  });

  describe('<div class="content-wrapper">...</div>', () => {
    it('should ignore div wrapper and parse only its content', () => {
      const actual = parse(
        '<table class="confluenceTable"><tbody><tr><td><div class="content-wrapper"><p>hello</p></div></td></tr></tbody></table>',
      );
      expect(actual).to.deep.equal(
        doc(table({ __autoSize: true })(tr(td({})(p('hello'))))),
      );
    });
  });

  describe('unsupported content', () => {
    check(
      'inline ac:structured-macro in p',
      '<p><ac:structured-macro name="foo"/></p>',
      doc(p(confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'))),
    );

    check(
      'inline ac:structured-macro with unknown ac:name key',
      '<p><ac:structured-macro ac:name="blabla"/></p>',
      doc(
        p(
          confluenceUnsupportedInline(
            '<ac:structured-macro ac:name="blabla"/>',
          ),
        ),
      ),
    );

    check(
      'inline ac:structured-macro with JIRA issues list',
      '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro></p>',
      doc(
        p(
          confluenceUnsupportedInline(
            '<ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro>',
          ),
        ),
      ),
    );

    check(
      'inline ac:structured-macro in p (multiple)',
      '<p><ac:structured-macro name="foo"/><ac:structured-macro name="bar"/></p>',
      doc(
        p(
          confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'),
          confluenceUnsupportedInline('<ac:structured-macro name="bar"/>'),
        ),
      ),
    );

    check(
      'inline ac:structured-macro in p with text',
      '<p>foo <ac:structured-macro name="foo"/></p>',
      doc(
        p(
          'foo',
          confluenceUnsupportedInline('<ac:structured-macro name="foo"/>'),
        ),
      ),
    );

    check(
      'inline ac:structured-macro>ac:property in p',
      '<p><ac:structured-macro name="foo"><ac:property/></ac:structured-macro></p>',
      doc(
        p(
          confluenceUnsupportedInline(
            '<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>',
          ),
        ),
      ),
    );

    check(
      'inline ac:structured-macro>ac:property in p (multiple)',
      '<p><ac:structured-macro name="foo"><ac:property/></ac:structured-macro><ac:structured-macro name="foo"><ac:property/></ac:structured-macro></p>',
      doc(
        p(
          confluenceUnsupportedInline(
            '<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>',
          ),
          confluenceUnsupportedInline(
            '<ac:structured-macro name="foo"><ac:property/></ac:structured-macro>',
          ),
        ),
      ),
    );

    check(
      'block ac:structured-macro',
      '<ac:structured-macro name="foo"/>',
      doc(confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>')),
    );

    check(
      'block ac:structured-macro (multiple)',
      '<ac:structured-macro name="foo"/><ac:structured-macro name="bar"/>',
      doc(
        confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>'),
        confluenceUnsupportedBlock('<ac:structured-macro name="bar"/>'),
      ),
    );

    check(
      'block h2, ac:structured-macro',
      '<h2>foo</h2><ac:structured-macro name="foo"/>',
      doc(
        h2('foo'),
        confluenceUnsupportedBlock('<ac:structured-macro name="foo"/>'),
      ),
    );

    describe('noformat', () => {
      // NB: encoding should work into ac:structured-macro name="code"
      it('block ac:structured-macro noformat: parses CXHTML to codeBlock', () => {
        const actual = parse(`<ac:structured-macro ac:name="noformat" ac:schema-version="1" ac:macro-id="139765c9-74b9-4e21-8335-6844d10ce18b"><ac:plain-text-body><![CDATA[foo
  +// bar!]]></ac:plain-text-body></ac:structured-macro>`);
        expect(actual).to.deep.equal(
          doc(
            code_block({ language: null })(`foo
  +// bar!`),
          ),
        );
      });

      describe('when pasted from Editor', () => {
        it('block wysiwyg-macro noformat: parses CXHTML to codeBlock', () => {
          const actual = parse(
            '<table class="wysiwyg-macro" data-macro-name="noformat" data-macro-schema-version="1" data-macro-body-type="PLAIN_TEXT" data-macro-id="d03bc664-56dd-4eb4-ac68-9eadfc3a9663" style="background-color: rgb(240, 240, 240); background-position: 0px 0px; background-repeat: no-repeat; border: 1px solid rgb(221, 221, 221); margin-top: 10px; padding: 24px 2px 2px; width: 226px; border-collapse: separate; cursor: move; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial; background-image: url(&quot;/wiki/plugins/servlet/confluence/placeholder/macro-heading?definition=e25vZm9ybWF0fQ&amp;locale=en_GB&amp;version=2&quot;);"><tbody><tr><td class="wysiwyg-macro-body" style="white-space: pre-wrap; background-color: rgb(255, 255, 255); border: 1px solid rgb(221, 221, 221); margin: 0px; padding: 10px; min-width: 200px; cursor: text;"><pre style="margin: 0px; tab-size: 4; white-space: pre-wrap;">No format content</pre></td></tr></tbody></table>',
          );
          expect(actual).to.deep.equal(
            doc(code_block({ language: null })('No format content')),
          );
        });
      });

      describe('when pasted from View', () => {
        it('<div class="preformatted panel">: parses CXHTML to codeBlock', () => {
          const actual = parse(
            '<div class="preformatted panel" style="margin: 10px 0px; padding: 0px; color: rgb(51, 51, 51); border: 1px solid rgb(204, 204, 204); overflow: auto; border-radius: 3px; background-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 14px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-style: initial; text-decoration-color: initial;"><div class="preformattedContent panelContent" style="margin: 0px; padding: 10px;"><pre style="margin: 0px; padding: 0px; font-family: ConfluenceInstalledFont, monospace; line-height: 1.3;">No format content</pre></div></div>',
          );
          expect(actual).to.deep.equal(
            doc(code_block({ language: null })('No format content')),
          );
        });
      });
    });

    check('CDATA', '<![CDATA[some code]]>', doc(p('some code')));

    check(
      'CDATA surrounded by whitespace',
      ' <![CDATA[some code]]> ',
      doc(p('some code')),
    );

    check(
      'h1 + macro with CDATA',
      '<h1>Code block</h1><ac:structured-macro ac:name="foo"><ac:plain-text-body><![CDATA[some code]]></ac:plain-text-body></ac:structured-macro>',
      doc(h1('Code block'), code_block()('some code')),
    );

    describe('ac:link', () => {
      check(
        'link to Confluence page',
        '<p><ac:link><ri:page ri:content-title="Questions test page"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline(
              '<ac:link><ri:page ri:content-title="Questions test page"/></ac:link>',
            ),
          ),
        ),
      );

      check(
        'link to uploaded file',
        '<p><ac:link><ri:attachment ri:filename="Classic Minesweeper.pdf"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline(
              '<ac:link><ri:attachment ri:filename="Classic Minesweeper.pdf"/></ac:link>',
            ),
          ),
        ),
      );

      check(
        'link to Confluence space',
        '<p><ac:link><ri:space ri:space-key="ZAA"/></ac:link></p>',
        doc(
          p(
            confluenceUnsupportedInline(
              '<ac:link><ri:space ri:space-key="ZAA"/></ac:link>',
            ),
          ),
        ),
      );
    });
  });

  describe('ac:emoticon', () => {
    check(
      'old emoticons are mapped to new emojis',
      '<p><ac:emoticon ac:name="smile" /></p>',
      doc(
        p(
          emoji({
            id: '1f642',
            shortName: ':slight_smile:',
            text: '\uD83D\uDE42',
          })(),
        ),
      ),
    );

    check(
      'emoticons that will end up mapped to default fabric id emoji will preserve original ac:name',
      '<p><ac:emoticon ac:name="unknown"/></p>',
      doc(p(emoji({ id: '2b50', shortName: ':unknown:', text: '' })())),
    );

    check(
      'old HipChat emoticons are mapped to new',
      '<p><ac:hipchat-emoticon ac:shortcut="sadpanda" /></p>',
      doc(
        p(
          emoji({
            id: 'atlassian-sadpanda',
            shortName: ':sadpanda:',
            text: '',
          })(),
        ),
      ),
    );

    check(
      'valid emoji with all fabric emoji attributes',
      '<p><ac:emoticon ac:name="blue-star" ac:emoji-id="1f61c" ac:emoji-shortname=":stuck_out_tongue_winking_eye:" ac:emoji-fallback="😜"/></p>',
      doc(
        p(
          emoji({
            id: '1f61c',
            shortName: ':stuck_out_tongue_winking_eye:',
            text: '😜',
          })(),
        ),
      ),
    );

    it('valid emoji with all fabric emoji attributes encoded with ac:name="blue-star"', () => {
      const emoticon = encode(
        doc(
          p(
            emoji({
              id: '1f61c',
              shortName: ':stuck_out_tongue_winking_eye:',
              text: '😜',
            })(),
          ),
        )(schema),
      );
      expect(emoticon).to.contain('ac:name="blue-star"');
    });

    it('hipchat-emoticons encoded with ac:name="blue-star" and preserve original ac:shortcut as ac:emoji-shortname', () => {
      const notMappedEmoticon =
        '<ac:hipchat-emoticon ac:shortcut="anything-not-supported" />';
      const encodedEmoticon =
        '<ac:emoticon ac:name="blue-star" ac:emoji-id="atlassian-anything-not-supported" ac:emoji-shortname=":anything-not-supported:"/>';
      expect(parse(notMappedEmoticon)).to.deep.equal(parse(encodedEmoticon));

      const notMappedEmoticonEncode = encode(parse(notMappedEmoticon));
      expect(notMappedEmoticonEncode).to.contain('ac:name="blue-star"');
      expect(notMappedEmoticonEncode).to.contain(
        'ac:emoji-id="atlassian-anything-not-supported"',
      );
      expect(notMappedEmoticonEncode).to.contain(
        'ac:emoji-shortname=":anything-not-supported:"',
      );
    });
  });

  describe('fabric mentions', () => {
    it('shoult parse mention with atlassian id and name', () => {
      const cxhtml =
        '<p>This is mention from <fab:link><fab:mention atlassian-id="557057:ff721128-093e-4357-8d8e-8caf869f577"><![CDATA[Artur Bodera]]></fab:mention></fab:link></p>';

      expect(parse(cxhtml)).to.deep.equal(
        doc(
          p(
            'This is mention from ',
            mention({
              id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
              text: 'Artur Bodera',
            })(),
          ),
        ),
      );
    });

    // @see ED-3634
    it('shoult encode mention and preserve only atlassian id', () => {
      const encodedCxhtml = encode(
        doc(
          p(
            'This is mention from ',
            mention({
              id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
              text: 'Artur Bodera',
            })(),
          ),
        )(schema),
      );
      expect(encodedCxhtml).to.equal(
        '<p>This is mention from <fab:link><fab:mention atlassian-id="557057:ff721128-093e-4357-8d8e-8caf869f577"/></fab:link></p>',
      );
    });
  });

  describe('media nodes', () => {
    check(
      'with minimal number of attributes',
      '<fab:media-group><fab:media media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" media-type="file" media-collection="de7ae355-dcf3-4988-9785-bccb835830c4"/></fab:media-group>',
      doc(
        mediaGroup(
          media({
            id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
            type: 'file',
            collection: 'de7ae355-dcf3-4988-9785-bccb835830c4',
          })(),
        ),
      ),
    );

    it('should encode/parse media nodes with own attributes', () => {
      const cxhtml = `
        <fab:media-single>
          <fab:media
            media-id="f46de7c0-8b53-49b2-9788-5168361dda1d"
            media-type="file"
            media-collection="de7ae355-dcf3-4988-9785-bccb835830c4"
            file-name="2017-04-12 07.15.57.jpg"
            file-size="95316"
            file-mime-type="image/jpeg"
            width="600"
            height="400"
          />
        </fab:media-single>
      `;
      const mediaNode = media({
        id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
        type: 'file',
        collection: 'de7ae355-dcf3-4988-9785-bccb835830c4',
        __fileName: '2017-04-12 07.15.57.jpg',
        __fileSize: 95316,
        __fileMimeType: 'image/jpeg',
        width: 600,
        height: 400,
      });
      const docNode = doc(mediaSingle()(mediaNode()));

      // check that parsing/encoding is working as expected
      // plus takes node own attributes into account
      const parsed = parse(cxhtml);
      expect(parsed).to.deep.equal(docNode);
      expect(parse(encode(docNode(schema)))).to.deep.equal(docNode);

      // check that node attributes are set during parsing
      const parsedMediaNode = parsed.firstChild!.firstChild;
      expect(parsedMediaNode!.attrs.__fileName).to.equal(
        '2017-04-12 07.15.57.jpg',
      );
      expect(parsedMediaNode!.attrs.__fileSize).to.equal(95316);
      expect(parsedMediaNode!.attrs.__fileMimeType).to.equal('image/jpeg');
    });

    it('should handle media-group, media-single and paragraph (simple case)', () => {
      const cxhtml = `
        <p>my answer with attachment</p>
        <fab:media-group>
          <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
          <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
        </fab:media-group>
        <p>my answer with attachment 2</p>
        <fab:media-single layout="wrap-left">
          <fab:media media-collection="de7ae355-dcf3-4988-9785-bccb835830c4" media-type="file" media-id="f46de7c0-8b53-49b2-9788-5168361dda1d" file-mime-type="image/jpeg" file-size="95316" file-name="2017-04-12 07.15.57.jpg"/>
        </fab:media-single>
        <p>my answer with attachment 3 <fab:link><fab:mention atlassian-id="557057:ff721128-093e-4357-8d8e-8caf869f577"><![CDATA[Artur Bodera]]></fab:mention></fab:link>
        </p>
      `;

      const parseWrap = () => parse(cxhtml);
      assert.doesNotThrow(parseWrap, 'Parsing should not throw exception');

      const mediaNode = media({
        id: 'f46de7c0-8b53-49b2-9788-5168361dda1d',
        type: 'file',
        collection: 'de7ae355-dcf3-4988-9785-bccb835830c4',
        __fileName: '2017-04-12 07.15.57.jpg',
        __fileSize: 95316,
        __fileMimeType: 'image/jpeg',
      });

      const docNode = doc(
        p('my answer with attachment'),
        mediaGroup(mediaNode(), mediaNode()),
        p('my answer with attachment 2'),
        mediaSingle({ layout: 'wrap-left' })(mediaNode()),
        p(
          'my answer with attachment 3 ',
          mention({
            id: '557057:ff721128-093e-4357-8d8e-8caf869f577',
            text: 'Artur Bodera',
          })(),
        ),
      );

      expect(docNode(schema)).to.deep.equal(parseWrap());
    });
  });
});

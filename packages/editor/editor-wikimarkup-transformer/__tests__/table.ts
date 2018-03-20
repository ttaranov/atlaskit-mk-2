import {
  a as link,
  code,
  doc,
  em,
  h2,
  hardBreak,
  p,
  strong,
  table,
  td,
  th,
  tr,
} from '@atlaskit/editor-test-helpers';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { defaultSchema } from '@atlaskit/editor-common';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('table with content around it', () => {
    const WIKI_NOTATION = `before table
||colA||colB||colC||colD||
|cola|colb|colc|cold|

after table`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('before table'),
        table(
          tr(
            th({})(p('colA')),
            th({})(p('colB')),
            th({})(p('colC')),
            th({})(p('colD')),
          ),
          tr(
            td({})(p('cola')),
            td({})(p('colb')),
            td({})(p('colc')),
            td({})(p('cold')),
          ),
        ),
        p(),
        p('after table'),
      ),
    );
  });

  describe('table with open rows', () => {
    const WIKI_NOTATION = `||column||headings
|table|with
|more|cells`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(th({})(p('column')), th({})(p('headings'))),
          tr(td({})(p('table')), td({})(p('with'))),
          tr(td({})(p('more')), td({})(p('cells'))),
        ),
      ),
    );
  });

  describe('table with closed rows', () => {
    const WIKI_NOTATION = `||column||headings||
|table|with|
|more|cells|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(th({})(p('column')), th({})(p('headings'))),
          tr(td({})(p('table')), td({})(p('with'))),
          tr(td({})(p('more')), td({})(p('cells'))),
        ),
      ),
    );
  });

  describe('single row unclosed table', () => {
    const WIKI_NOTATION = `|simple|table`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(table(tr(td({})(p('simple')), td({})(p('table'))))),
    );
  });

  describe('unclosed table with other macros', () => {
    const WIKI_NOTATION = `|simple|table
|[a link|http://www.domain.com]|simple text
|more texts|[link to google|confluence@Google]`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(td({})(p('simple')), td({})(p('table'))),
          tr(
            td({})(p(link({ href: 'http://www.domain.com' })('a link'))),
            td({})(p('simple text')),
          ),
          tr(
            td({})(p('more texts')),
            td({})(p(link({ href: 'confluence@Google' })('link to google'))),
          ),
        ),
      ),
    );
  });

  describe('table header only', () => {
    const WIKI_NOTATION = `||header|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(table(tr(th({})(p('header'))))),
    );
  });

  describe('table with header column and header row', () => {
    const WIKI_NOTATION = `| ||col1||col2||
||row1|a |b|
||row2|a | |
||row3| |b|
||row4| | |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(td({})(p(' ')), th({})(p('col1')), th({})(p('col2'))),
          tr(th({})(p('row1')), td({})(p('a ')), td({})(p('b'))),
          tr(th({})(p('row2')), td({})(p('a ')), td({})(p(' '))),
          tr(th({})(p('row3')), td({})(p(' ')), td({})(p('b'))),
          tr(th({})(p('row4')), td({})(p(' ')), td({})(p(' '))),
        ),
      ),
    );
  });

  describe('table missing final end column', () => {
    const WIKI_NOTATION = `||table||header||here||
|and|a row|here|
|and|the|end`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(th({})(p('table')), th({})(p('header')), th({})(p('here'))),
          tr(td({})(p('and')), td({})(p('a row')), td({})(p('here'))),
          tr(td({})(p('and')), td({})(p('the')), td({})(p('end'))),
        ),
      ),
    );
  });

  describe('table with multiline cells', () => {
    const WIKI_NOTATION = `||table header||here||
|and|here
the *data* and
|even more|_and more_
data`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(
          tr(th({})(p('table header')), th({})(p('here'))),
          tr(
            td({})(p('and')),
            td({})(p('here', hardBreak(), 'the ', strong('data'), ' and')),
          ),
          tr(
            td({})(p('even more')),
            td({})(p(em('and more'), hardBreak(), 'data')),
          ),
        ),
      ),
    );
  });

  describe('table with noformat', () => {
    const WIKI_NOTATION = `The following example:
|| test | {noformat}foo{noformat} |`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('The following example:'),
        table(tr(th({})(p(' test ')), td({})(p(' ', code('foo'), ' ')))),
      ),
    );
  });

  describe('unclosed table with multiline cell', () => {
    const WIKI_NOTATION = `||aaa||bbb||ccc
|ddd|eee|fff
  gggg hhhh


h2. header`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('The following example:'),
        table(
          tr(th({})(p('aaa')), th({})(p('bbb')), th({})(p('ccc'))),
          tr(
            td({})(p('ddd')),
            td({})(p('eee')),
            td({})(p('fff', hardBreak(), '  gggg hhhh')),
          ),
        ),
        h2('header'),
      ),
    );
  });

  describe('single cell with link', () => {
    const WIKI_NOTATION = `|[foo|http://www.example.com]|`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        table(tr(td({})(p(link({ href: 'http://www.example.com' })('foo'))))),
      ),
    );
  });
});

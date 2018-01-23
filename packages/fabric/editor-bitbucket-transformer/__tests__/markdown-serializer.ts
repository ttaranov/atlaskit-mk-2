import { MarkdownSerializer, marks, nodes } from '../src/serializer';
import { stringRepeat } from '../src/util';
import {
  a,
  blockquote,
  br,
  code_block,
  doc,
  em,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  img,
  li,
  emoji,
  emojiQuery,
  mention,
  mentionQuery,
  code,
  ol,
  p,
  strike,
  strong,
  ul,
} from './_schema-builder';

const markdownSerializer = new MarkdownSerializer(nodes, marks);

describe('BitbucketTransformer: serializer', () => {
  const pre = code_block();

  it('should serialize paragraphs', () => {
    expect(markdownSerializer.serialize(doc(p('foo')))).toEqual('foo');
    expect(markdownSerializer.serialize(doc(p('foo'), p('bar')))).toEqual(
      'foo\n\nbar',
    );

    const longText = stringRepeat('foo ', 100);
    expect(markdownSerializer.serialize(doc(p(longText), p(longText)))).toEqual(
      `${longText}\n\n${longText}`,
    );
  });

  it('should preserve multiple blank lines using zero-non-width', () => {
    expect(markdownSerializer.serialize(doc(p('foo'), p(), p('bar')))).toEqual(
      'foo\n\n\u200c\n\nbar',
    );

    expect(
      markdownSerializer.serialize(doc(p('foo'), p(), p(), p('bar'))),
    ).toEqual('foo\n\n\u200c\n\n\u200c\n\nbar');
  });

  it('should escape 4 spaces at the beginning of the line with zero-width-non-joiner', () => {
    const fourSpaces = '    ';

    expect(markdownSerializer.serialize(doc(p(`${fourSpaces}hello`)))).toEqual(
      `\u200c${fourSpaces}hello`,
    );

    expect(
      markdownSerializer.serialize(doc(p(`hello${fourSpaces}there`))),
    ).toEqual(`hello${fourSpaces}there`);
  });

  it('should preserve leading and trailing blank lines using zero-non-width', () => {
    expect(markdownSerializer.serialize(doc(p(), p('bar')))).toEqual(
      '\u200c\n\nbar',
    );

    expect(markdownSerializer.serialize(doc(p(), p(), p('bar')))).toEqual(
      '\u200c\n\n\u200c\n\nbar',
    );

    expect(markdownSerializer.serialize(doc(p('foo'), p()))).toEqual(
      'foo\n\n\u200c',
    );

    expect(markdownSerializer.serialize(doc(p('foo'), p(), p()))).toEqual(
      'foo\n\n\u200c\n\n\u200c',
    );
  });

  describe('mentions', () => {
    it('should serialize mentions', () => {
      const node = doc(p(mention({ text: 'Oscar Wallhult', id: 'oscar' })));
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@oscar');
    });

    it('should divide serialized mentions and text with one blank space', () => {
      const node = doc(
        p(mention({ text: 'Oscar Wallhult', id: 'oscar' }), 'text'),
      );
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@oscar text');
    });

    it('should not add a blank space in the end of the string for mentions', () => {
      const node = doc(
        p('text ', mention({ text: 'Oscar Wallhult', id: 'oscar' })),
      );
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('text @oscar');
    });

    it('should not divide mention and text with additional space if text starts with the space', () => {
      const node = doc(
        p(mention({ text: 'Oscar Wallhult', id: 'oscar' }), ' text'),
      );
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@oscar text');
    });

    it('should divide mention and text with only one additional space if text starts with the spaces', () => {
      const node = doc(
        p(mention({ text: 'Oscar Wallhult', id: 'oscar' }), '  text'),
      );
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@oscar  text');
    });

    it('should not divide mention and italic text node with additional space if text starts with the space', () => {
      const node = doc(
        p(mention({ text: 'Oscar Wallhult', id: 'oscar' }), em(' text')),
      );
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual('@oscar *text*');
    });
  });

  describe('emoji', () => {
    it('should serialize emoji', () => {
      const node = doc(p(emoji({ shortName: ':grinning:' })));
      const test = markdownSerializer.serialize(node);
      expect(test).toEqual(':grinning:');
    });
  });

  it('should not skip [ & ]', () => {
    expect(markdownSerializer.serialize(doc(p('[hello]')))).toEqual(
      '\\[hello\\]',
    );
  });

  describe('code block', () => {
    it('with simple text should be serialized', () => {
      expect(markdownSerializer.serialize(doc(pre('foo')))).toEqual('    foo');
    });

    it('with newlines preserves newlines in markdown', () => {
      expect(markdownSerializer.serialize(doc(pre('foo\nbar')))).toEqual(
        '    foo\n    bar',
      );
    });

    it('with adjacent code block keeps empty space between', () => {
      expect(markdownSerializer.serialize(doc(pre('foo'), pre('bar')))).toEqual(
        '    foo\n\n    bar',
      );
    });

    it('with attributes uses backtick notation and preserves attributes', () => {
      const js = code_block({ language: 'js' });
      expect(markdownSerializer.serialize(doc(js('foo')))).toEqual(
        '```js\nfoo\n```',
      );

      expect(markdownSerializer.serialize(doc(js('foo\nbar')))).toEqual(
        '```js\nfoo\nbar\n```',
      );
    });

    it('with no text is preserved', () => {
      expect(markdownSerializer.serialize(doc(pre('')))).toEqual('    \u200c');

      expect(markdownSerializer.serialize(doc(pre()))).toEqual('    \u200c');

      expect(markdownSerializer.serialize(doc(pre()))).toEqual('    \u200c');
    });

    it('via indentation with backticks is not escaped', () => {
      expect(
        markdownSerializer.serialize(doc(pre('`foo`\n````bar\nbaz\n`````'))),
      ).toEqual('    `foo`\n    ````bar\n    baz\n    `````');
    });

    it('via backticks that includes backticks is properly fenced', () => {
      const css = code_block({ language: 'css' });

      // Balanced fencing
      expect(markdownSerializer.serialize(doc(css('```js\nfoo\n```')))).toEqual(
        '````css\n```js\nfoo\n```\n````',
      );

      // Unbalanced fencing in the code block
      expect(
        markdownSerializer.serialize(doc(css('````js\nfoo\n```'))),
      ).toEqual('`````css\n````js\nfoo\n```\n`````');

      // Unmatched backtick fence
      expect(markdownSerializer.serialize(doc(css('````')))).toEqual(
        '`````css\n````\n`````',
      );

      // Unmatched backtick fence with language definition
      expect(markdownSerializer.serialize(doc(css('````js')))).toEqual(
        '`````css\n````js\n`````',
      );
    });
  });

  it('should serialize headings (level 1 - 6)', () => {
    expect(markdownSerializer.serialize(doc(h1('level 1')))).toEqual(
      '# level 1',
    );
    expect(markdownSerializer.serialize(doc(h2('level 2')))).toEqual(
      '## level 2',
    );
    expect(markdownSerializer.serialize(doc(h3('level 3')))).toEqual(
      '### level 3',
    );
    expect(markdownSerializer.serialize(doc(h4('level 4')))).toEqual(
      '#### level 4',
    );
    expect(markdownSerializer.serialize(doc(h5('level 5')))).toEqual(
      '##### level 5',
    );
    expect(markdownSerializer.serialize(doc(h6('level 6')))).toEqual(
      '###### level 6',
    );

    expect(
      markdownSerializer.serialize(doc(h1('foo'), h2('bar'), p('baz'))),
    ).toEqual(`# foo\n\n## bar\n\nbaz`);
  });

  it('should serialize horizontal_rule', () => {
    expect(markdownSerializer.serialize(doc(hr))).toEqual('---');
    expect(markdownSerializer.serialize(doc(p('foo'), hr, p('bar')))).toEqual(
      'foo\n\n---\n\nbar',
    );
  });

  describe('bullet list', () => {
    it('with elements should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('foo')), li(p('bar')), li(p('baz')))),
        ),
      ).toEqual('* foo\n* bar\n* baz\n\n');
    });

    it('surrounded with other block elements keeps empty line between', () => {
      expect(
        markdownSerializer.serialize(
          doc(p('para'), ul(li(p('foo')), li(p('bar'))), p('baz')),
        ),
      ).toEqual('para\n\n* foo\n* bar\n\nbaz');
    });

    it('with one empty element is preserved', () => {
      expect(markdownSerializer.serialize(doc(ul(li(p('')))))).toEqual(
        '* \n\n',
      );
    });

    it('with nesting should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ul(
              li(
                p('foo 1'),
                ul(
                  li(p('bar 1'), ul(li(p('baz 1')), li(p('baz 2')))),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          ),
        ),
      ).toEqual(
        '* foo 1\n' +
          '\n' +
          '    * bar 1\n' +
          '    \n' +
          '        * baz 1\n' +
          '        * baz 2\n' +
          '        \n' +
          '    * bar 2\n' +
          '    \n' +
          '* foo 2\n' +
          '\n',
      );
    });

    it('with newline', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('item 1'), p('\n')), li(p('item 2')))),
        ),
      ).toEqual(
        '* item 1\n' +
          '\n' +
          '    \n' +
          '    \n' +
          '\n' +
          '\n' +
          '* item 2\n' +
          '\n',
      );
    });

    it('with list item containing two lines', () => {
      expect(
        markdownSerializer.serialize(
          doc(ul(li(p('item 1'), p('item 1 desc')), li(p('item 2')))),
        ),
      ).toEqual(
        '* item 1\n' +
          '\n' +
          '    item 1 desc\n' +
          '\n' +
          '\n' +
          '* item 2\n' +
          '\n',
      );
    });
  });

  describe('ordered list', () => {
    it('with elements should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(ol(li(p('foo')), li(p('bar')), li(p('baz')))),
        ),
      ).toEqual('1. foo\n2. bar\n3. baz\n\n');
    });

    it('surrounded with other block elements keeps empty line between', () => {
      expect(
        markdownSerializer.serialize(
          doc(p('para'), ol(li(p('foo')), li(p('bar'))), p('baz')),
        ),
      ).toEqual('para\n\n1. foo\n2. bar\n\nbaz');
    });

    it('with 10+ elements aligns numbers to right', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
              li(p('item')),
            ),
          ),
        ),
      ).toEqual(
        '1. item\n2. item\n3. item\n4. item\n5. item\n6. item\n7. item\n8. item\n9. item\n10. item\n\n',
      );
    });

    it('with one empty element is preserved', () => {
      expect(markdownSerializer.serialize(doc(ol(li(p('')))))).toEqual(
        '1. \n\n',
      );
    });

    it('with nesting should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(
                p('foo 1'),
                ol(
                  li(p('bar 1'), ol(li(p('baz 1')), li(p('baz 2')))),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          ),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '\n' +
          '    1. bar 1\n' +
          '    \n' +
          '        1. baz 1\n' +
          '        2. baz 2\n' +
          '        \n' +
          '    2. bar 2\n' +
          '    \n' +
          '2. foo 2\n' +
          '\n',
      );
    });
  });

  describe('mixed lists', () => {
    it('of nested ordered and unordered should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(
              li(
                p('foo 1'),
                ul(
                  li(
                    p('bar 1'),
                    ol(li(p('baz 1')), li(p('baz 2'), ul(li(p('banana'))))),
                  ),
                  li(p('bar 2')),
                ),
              ),
              li(p('foo 2')),
            ),
          ),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '\n' +
          '    * bar 1\n' +
          '    \n' +
          '        1. baz 1\n' +
          '        2. baz 2\n' +
          '        \n' +
          '            * banana\n' +
          '            \n' +
          '        \n' +
          '    * bar 2\n' +
          '    \n' +
          '2. foo 2\n' +
          '\n',
      );
    });

    it('of consecutive ordered and unordered should serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            ol(li(p('foo 1')), li(p('foo 2'))),
            ul(li(p('bar 1')), li(p('bar 2'))),
            ol(li(p('baz 1')), li(p('baz 2'))),
          ),
        ),
      ).toEqual(
        '1. foo 1\n' +
          '2. foo 2\n' +
          '\n' +
          '* bar 1\n' +
          '* bar 2\n' +
          '\n' +
          '1. baz 1\n' +
          '2. baz 2\n' +
          '\n',
      );
    });
  });

  describe('image', () => {
    it('with no alt to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com',
            }),
          ),
        ),
      ).toEqual('![](http://example.com)');
    });

    it('with alt and no title to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com',
              alt: 'an image',
            }),
          ),
        ),
      ).toEqual('![an image](http://example.com)');
    });

    it('with alt and title to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com',
              alt: 'an image',
              title: 'a title',
            }),
          ),
        ),
      ).toEqual("![an image](http://example.com 'a title')");
    });

    it('with title containing double-quote to serialize without escaping', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com',
              alt: 'an image',
              title: 'a " "title"',
            }),
          ),
        ),
      ).toEqual('![an image](http://example.com \'a " "title"\')');
    });

    it('with alt containing quotes to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com',
              alt: '\'an\' "image"',
            }),
          ),
        ),
      ).toEqual('![\'an\' "image"](http://example.com)');
    });

    it('inline with text to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            p(
              'foo ',
              img({
                src: 'http://example.com',
                alt: 'an image',
                title: 'a title',
              }),
              ' bar',
            ),
          ),
        ),
      ).toEqual("foo ![an image](http://example.com 'a title') bar");
    });

    it('in heading to serialize', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            h1(
              p(
                img({
                  src: 'http://example.com',
                  alt: 'an image',
                  title: 'a title',
                }),
                ' foo',
              ),
            ),
          ),
        ),
      ).toEqual("# ![an image](http://example.com 'a title') foo");

      expect(
        markdownSerializer.serialize(
          doc(
            h2(
              p(
                img({
                  src: 'http://example.com',
                  alt: 'an image',
                  title: 'a title',
                }),
                ' foo',
              ),
            ),
          ),
        ),
      ).toEqual("## ![an image](http://example.com 'a title') foo");
    });

    it('should escape the characters in image attributes', () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://exa()mple.com',
              alt: 'an ()example',
              title: 'An image ()example',
            }),
          ),
        ),
      ).toEqual(
        "![an \\(\\)example](http://exa()mple.com 'An image \\(\\)example')",
      );
    });

    it(`shouldn't escape src`, () => {
      expect(
        markdownSerializer.serialize(
          doc(
            img({
              src: 'http://example.com/a_test_image-*+_|([]{}.png',
              alt: 'test image',
              title: 'A Test Image',
            }),
          ),
        ),
      ).toEqual(
        "![test image](http://example.com/a_test_image-*+_|([]{}.png 'A Test Image')",
      );
    });
  });

  it('should serialize hardBreak to newline', () => {
    expect(markdownSerializer.serialize(doc(p('foo ', br, 'bar')))).toEqual(
      'foo   \nbar',
    );
  });

  describe('blockquotes', () => {
    it('should serialized', () => {
      expect(markdownSerializer.serialize(doc(blockquote(p('foo'))))).toEqual(
        '> foo',
      );
      expect(
        markdownSerializer.serialize(
          doc(blockquote(p('foo')), blockquote(p('bar'))),
        ),
      ).toEqual('> foo\n\n> bar');
    });
  });

  describe('marks -', () => {
    it('should ignore mentionQuery mark', () => {
      expect(
        markdownSerializer.serialize(doc(p(mentionQuery('@oscar')))),
      ).toEqual('@oscar');
    });

    it('should ignore emojiQuery mark', () => {
      expect(markdownSerializer.serialize(doc(p(emojiQuery(':grin'))))).toEqual(
        ':grin',
      );
    });

    it('should serialize em', () => {
      expect(markdownSerializer.serialize(doc(p(em('foo'))))).toEqual('*foo*');
      expect(
        markdownSerializer.serialize(doc(p('foo ', em('bar'), ' baz'))),
      ).toEqual('foo *bar* baz');
    });

    it('should serialize strong', () => {
      expect(markdownSerializer.serialize(doc(p(strong('foo'))))).toEqual(
        '**foo**',
      );
      expect(
        markdownSerializer.serialize(doc(p('foo ', strong('bar bar'), ' baz'))),
      ).toEqual('foo **bar bar** baz');
    });

    it('should serialize strikethrough', () => {
      expect(markdownSerializer.serialize(doc(p(strike('foo'))))).toEqual(
        '~~foo~~',
      );
      expect(
        markdownSerializer.serialize(doc(p('foo ', strike('bar bar'), ' baz'))),
      ).toEqual('foo ~~bar bar~~ baz');
    });

    it('should serialize code', () => {
      expect(markdownSerializer.serialize(doc(p(code('foo'))))).toEqual(
        '`foo`',
      );
      expect(
        markdownSerializer.serialize(doc(p('foo ', code('bar baz'), ' foo'))),
      ).toEqual('foo `bar baz` foo');
    });

    describe('code', () => {
      it('containing backticks should be fenced properly', () => {
        expect(
          markdownSerializer.serialize(
            doc(p('foo ', code('bar ` ` baz'), ' foo')),
          ),
        ).toEqual('foo ``bar ` ` baz`` foo');
      });

      it('containing backticks on the edges of a fence should be fenced properly', () => {
        expect(
          markdownSerializer.serialize(
            doc(p('foo ', code('`bar`  ``baz``'), ' foo')),
          ),
        ).toEqual('foo ``` `bar`  ``baz`` ``` foo');
      });
    });

    describe('links', () => {
      it('with no text to be ignored', () => {
        const link = a({ href: 'http://example.com' });

        expect(markdownSerializer.serialize(doc(p(link(''))))).toEqual('');
      });

      it('with no title to serialize', () => {
        const link = a({ href: 'http://example.com' });

        expect(markdownSerializer.serialize(doc(p(link('foo'))))).toEqual(
          '[foo](http://example.com)',
        );
      });

      it('with space in url to serialize', () => {
        const link = a({
          href: '/url with space',
        });

        expect(markdownSerializer.serialize(doc(p(link('foo'))))).toEqual(
          '[foo](/url with space)',
        );
      });

      it('with special characters, characters should not be escaped', () => {
        const link = a({ href: 'hr~ef' });
        expect(markdownSerializer.serialize(doc(p(link('foo'))))).toEqual(
          '[foo](hr~ef)',
        );
      });

      // Tests should pass when ED-3307 is fixed
      it.skip('should escape markdown characters in url', () => {
        const link = a({ href: 'http://google.com/)(][*_|' });
        expect(markdownSerializer.serialize(doc(p(link('foo'))))).toEqual(
          '[foo](http://google.com/\\)\\(\\]\\[\\*\\_\\|)',
        );
      });
      it.skip('should not escape ~ inside link', () => {
        const link = a({ href: 'http://google.com/~/' });
        expect(markdownSerializer.serialize(doc(p(link('foo'))))).toEqual(
          '[foo](http://google.com/~/',
        );
      });
    });

    describe('emphasis -', () => {
      it('asterisk within strings should be escaped', () => {
        expect(markdownSerializer.serialize(doc(p('*foo bar*')))).toEqual(
          '\\*foo bar\\*',
        );

        expect(markdownSerializer.serialize(doc(p('**foo bar**')))).toEqual(
          '\\*\\*foo bar\\*\\*',
        );

        expect(markdownSerializer.serialize(doc(p('***foo bar***')))).toEqual(
          '\\*\\*\\*foo bar\\*\\*\\*',
        );
      });

      it('underscore within strings should be escaped', () => {
        expect(markdownSerializer.serialize(doc(p('_foo bar_')))).toEqual(
          '\\_foo bar\\_',
        );

        expect(markdownSerializer.serialize(doc(p('__foo bar__')))).toEqual(
          '\\_\\_foo bar\\_\\_',
        );

        expect(markdownSerializer.serialize(doc(p('___foo bar___')))).toEqual(
          '\\_\\_\\_foo bar\\_\\_\\_',
        );
      });

      it('"strong em" should be escaped in its entirety', () => {
        expect(markdownSerializer.serialize(doc(p('***strong**em*')))).toEqual(
          '\\*\\*\\*strong\\*\\*em\\*',
        );
      });

      it('"smart em" should be escaped in its entirety', () => {
        expect(
          markdownSerializer.serialize(doc(p('_smart_emphasis_'))),
        ).toEqual('\\_smart\\_emphasis\\_');
      });

      it('combinations should be properly serialized', () => {
        expect(
          markdownSerializer.serialize(doc(p(em('hi'), '**there*'))),
        ).toEqual('*hi*\\*\\*there\\*');

        expect(
          markdownSerializer.serialize(doc(p(strike(strong('foo bar baz'))))),
        ).toEqual('**~~foo bar baz~~**');

        expect(
          markdownSerializer.serialize(
            doc(p(strong(strike('foo bar'), ' baz'))),
          ),
        ).toEqual('**~~foo bar~~ baz**');

        expect(
          markdownSerializer.serialize(doc(p(em(strike('foo bar'), ' baz')))),
        ).toEqual('*~~foo bar~~ baz*');

        expect(
          markdownSerializer.serialize(doc(p(code('**bar baz**')))),
        ).toEqual('`**bar baz**`');

        expect(
          markdownSerializer.serialize(doc(p(code('__bar_baz__')))),
        ).toEqual('`__bar_baz__`');
      });
    });

    describe('tilde ~', () => {
      it('should not escape tilde ~', () => {
        expect(markdownSerializer.serialize(doc(p('~')))).toEqual('~');
      });
    });
  });

  describe('New lines', () => {
    it('should serialize new line - 1', () => {
      expect(markdownSerializer.serialize(doc(p('foo\nbar')))).toEqual(
        'foo  \nbar',
      );
    });

    it('should serialize new line - 2', () => {
      expect(markdownSerializer.serialize(doc(p('foo\n\nbar')))).toEqual(
        'foo\n\nbar',
      );
    });

    it('should serialize new line - 3', () => {
      expect(
        markdownSerializer.serialize(
          doc(p('pagh\nwa’\ncha’\nwej\nloS\nvagh\njav\nSoch\nchorgh\nHut\n')),
        ),
      ).toEqual(
        'pagh  \nwa’  \ncha’  \nwej  \nloS  \nvagh  \njav  \nSoch  \nchorgh  \nHut\n',
      );
    });
  });
});

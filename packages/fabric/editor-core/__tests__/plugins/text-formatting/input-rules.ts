import {
  mention,
  em,
  strike,
  code,
  strong,
  insertText,
  doc,
  createEditor,
  a as link,
  p,
  code_block,
} from '@atlaskit/editor-test-helpers';

import textFormatting from '../../../src/editor/plugins/text-formatting';
import codeBlockPlugin from '../../../src/editor/plugins/code-block';
import hyperlinkPlugin from '../../../src/editor/plugins/hyperlink';
import mentionsPlugin from '../../../src/editor/plugins/mentions';
import {
  strongRegex1,
  strongRegex2,
  italicRegex1,
  italicRegex2,
  strikeRegex,
  codeRegex,
} from '../../../src/plugins/text-formatting/input-rule';

describe('text-formatting input rules', () => {
  let trackEvent;
  const editor = (doc: any, disableCode = false) =>
    createEditor({
      doc,
      editorPlugins: [
        textFormatting({ disableCode }),
        codeBlockPlugin,
        hyperlinkPlugin,
        mentionsPlugin,
      ],
      editorProps: {
        analyticsHandler: trackEvent,
      },
    });

  beforeEach(() => {
    trackEvent = jest.fn();
  });

  describe('strong rule', () => {
    it('should convert "**text**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '**text**', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strong('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });

    it('should convert text to strong for link also', () => {
      const { editorView, sel } = editor(
        doc(
          p(
            '**',
            link({ href: 'http://www.atlassian.com' })('Atlassian'),
            '{<>}',
          ),
        ),
      );

      insertText(editorView, '**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong(link({ href: 'http://www.atlassian.com' })('Atlassian')))),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });

    it('should not convert "** text**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '** text**', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('** text**')));
    });

    it('should convert "__text__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '__text__', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strong('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });

    it('should not convert "**text**" to strong inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '**text**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('**text**')),
      );
    });

    it('should not convert the surrounding text to strong', () => {
      const { editorView, sel } = editor(doc(p('hello{<>}there')));

      insertText(editorView, '**text**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello', strong('text'), 'there')),
      );
    });

    it('should not be inclusive right after autoformatting conversion', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '**text**', sel);
      insertText(editorView, 'text', editorView.state.selection.$from.pos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('text'), 'text')),
      );
    });

    it('should not convert "`**text**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`**text**', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`**text**')));
    });

    it('should not convert "`__text__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`__text__', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`__text__')));
    });

    it('should not convert "`some**variables**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`some**variables**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('`some**variables**')),
      );
    });

    it('should not convert "`some__variables__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`some__variables__', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('`some__variables__')),
      );
    });

    it('should convert "some**variables**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some**variables**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some', strong('variables'))),
      );
    });

    it('should not convert "some__variables__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some__variables__', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('some__variables__')));
    });

    it('should convert "hello __text__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'hello __text__', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello ', strong('text'))),
      );
    });

    it('should convert "**^hello**" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '**^hello**', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strong('^hello'))));
    });

    it('should convert "__^hello__" to strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '__^hello__', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strong('^hello'))));
    });

    it('should not convert "**text** to strong when node does not support text formatting', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '**text**', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('**text**')),
      );
      expect(trackEvent).not.toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });
  });

  describe('em rule', () => {
    it('should convert "*text*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '*text*', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.em.autoformatting',
      );
    });

    it('should not convert "* text*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '* text*', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('* text*')));
    });

    it('should not convert "**text*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '**text*', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('**text*')));
    });

    it('should convert "_text_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '_text_', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(em('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.em.autoformatting',
      );
    });

    it('should not be inclusive right after autoformatting conversion', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '*italic*', sel);
      insertText(editorView, 'text', editorView.state.selection.$from.pos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(em('italic'), 'text')),
      );
    });

    it('should keep current marks when converting from markdown', () => {
      const { editorView, sel } = editor(doc(p(strong('This is bold {<>}'))));

      insertText(editorView, '*italic*', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strong('This is bold '), em(strong('italic')))),
      );
    });

    it('should not convert "*text*" to em inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '*text*', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('*text*')));
    });

    it('should not convert "`*text*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`*text*', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`*text*')));
    });

    it('should not convert "`some*variables*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`some*variables*', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`some*variables*')));
    });

    it('should not convert "`_text_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`_text_', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`_text_')));
    });

    it('should not convert "`some_variables_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`some_variables_', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`some_variables_')));
    });

    it('should convert "some*variables*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some*variables*', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some', em('variables'))),
      );
    });

    it('should not convert "some_variables_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some_variables_', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('some_variables_')));
    });

    it('should convert "hello _text_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'hello _text_', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello ', em('text'))),
      );
    });

    it('should convert "_^hello_" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '_^hello_', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(em('^hello'))));
    });

    it('should convert "*^hello*" to em', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '*^hello*', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(em('^hello'))));
    });

    it('should not convert "_text_ to em when node does not support text formatting', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '_text_', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('_text_')));
      expect(trackEvent).not.toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });
  });

  describe('strike rule', () => {
    it('should convert "~~text~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '~~text~~', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(strike('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strike.autoformatting',
      );
    });

    it('should not convert "~~text~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '~~ text~~', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('~~ text~~')));
    });

    it('should not convert "~~text~~" to strike inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '~~text~~', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('~~text~~')),
      );
    });

    it('should not be inclusive right after autoformatting conversion', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '~~text~~', sel);
      insertText(editorView, 'text', editorView.state.selection.$from.pos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strike('text'), 'text')),
      );
    });

    it('should not convert "`~~text~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`~~text~~', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`~~text~~')));
    });

    it('should not convert "`some~~texts~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`some~~texts~~', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('`some~~texts~~')));
    });

    it('should convert "some~~texts~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some~~texts~~', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some', strike('texts'))),
      );
    });

    it('should convert "~~^hello~~" to strike', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '~~^hello~~', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strike('^hello'))));
    });

    it('should not convert "~~text~~ to strike when node does not support text formatting', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '~~text~~', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('~~text~~')),
      );
      expect(trackEvent).not.toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });
  });

  describe('code rule', () => {
    it('should convert "`t`" to code text', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`t`', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(code('t'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.code.autoformatting',
      );
    });

    it('should convert "`text`" to code text', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`text`', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p(code('text'))));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.code.autoformatting',
      );
    });

    it('should not convert "` text`" to code text', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '` text`', sel);
      expect(editorView.state.doc).toEqualDocument(doc(p('` text`')));
    });

    it('should convert "some`texts`" to code', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'some`texts`', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('some', code('texts'))),
      );
    });

    it('should convert mention to plaint text', () => {
      const mentionNode = mention({ id: '1234', text: '@helga' })();
      const { editorView, sel } = editor(
        doc(p('hey! `hello, ', mentionNode, ' there{<>}?')),
      );
      insertText(editorView, '`', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hey! ', code('hello, @helga there'), '?')),
      );
    });

    it('should cleanup other formatting', () => {
      const mentionNode = mention({ id: '1234', text: '@helga' })();
      const { editorView, sel } = editor(
        doc(
          p('`', strong('hello '), mentionNode, em(', '), strike('there?{<>}')),
        ),
      );
      insertText(editorView, '`', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('hello @helga, there?'))),
      );
    });

    it('should not convert "`text`" to code text inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '`text`', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('`text`')));
    });

    it('should not be inclusive right after autoformatting conversion', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '`text`', sel);
      insertText(editorView, 'text', editorView.state.selection.$from.pos);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(code('text'), 'text')),
      );
    });

    it('should convert "`^hello`" to code', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '`^hello`', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(code('^hello'))));
    });

    it('should not convert "`text`" to code when node does not support text formatting', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '`text`', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('`text`')));
      expect(trackEvent).not.toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
    });
  });

  describe('nested rules', () => {
    it('should work without code-mark in the schema', () => {
      const { editorView, sel } = editor(doc(p('{<>}')), true);

      insertText(editorView, '**text**', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(strong('text'))));
    });

    it('should convert "*`text`*" to italic code text', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '*`text`', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p('*', code('text'))));

      insertText(editorView, '*', editorView.state.selection.from);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('*', code('text'), '*')),
      );
    });

    it('should convert "___text___" to italic strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '___text__', sel);
      insertText(editorView, '_', editorView.state.selection.from);

      expect(editorView.state.doc).toEqualDocument(doc(p(em(strong('text')))));
    });

    it('should not convert " __world__" to strong if I insert a space afterwards', () => {
      const { editorView, sel } = editor(doc(p(' __world__{<>}')));

      insertText(editorView, ' ', sel);

      expect(editorView.state.doc).toEqualDocument(doc(p(' __world__ ')));
    });

    it('should convert "~~**text**~~" to strike strong', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, '~~**text**', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('~~', strong('text'))),
      );
      insertText(editorView, '~~', editorView.state.selection.from);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(strike(strong('text')))),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strong.autoformatting',
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.strike.autoformatting',
      );
    });

    describe('when there is code mark in the line', () => {
      let editorView;
      beforeEach(() => {
        editorView = editor(doc(p(code('abc'), ' {<>}'))).editorView;
      });
      it('should do autoformatting even for ** strong text', () => {
        insertText(editorView, '**abc**', editorView.state.selection.from);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('abc'), ' ', strong('abc'))),
        );
      });
      it('should do autoformatting even for __ strong text', () => {
        insertText(editorView, '__abc__', editorView.state.selection.from);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('abc'), ' ', strong('abc'))),
        );
      });
      it('should do autoformatting even for * italic text', () => {
        insertText(editorView, '*abc*', editorView.state.selection.from);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('abc'), ' ', em('abc'))),
        );
      });
      it('should do autoformatting even for _ italic text', () => {
        insertText(editorView, '_abc_', editorView.state.selection.from);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('abc'), ' ', em('abc'))),
        );
      });
      it('should do autoformatting even for ~~ strike text', () => {
        insertText(editorView, '~~abc~~', editorView.state.selection.from);
        expect(editorView.state.doc).toEqualDocument(
          doc(p(code('abc'), ' ', strike('abc'))),
        );
      });
    });
  });

  describe('regex', () => {
    const checkValidStrings = (regex, string, formatting) => {
      it(`should not return null for correct markdown style: ${formatting}, regex: ${regex}, string: ${string}`, () => {
        expect(regex.exec(string)).not.toEqual(null);
      });
    };
    const autoformats = string => {
      it(`should autoformat: ${string}`, () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, string, 1);
        expect(editorView.state.doc).not.toEqualDocument(doc(p(string)));
      });
    };
    const checkInvalidStrings = (regex, string, formatting) => {
      it(`should return null for incorrect markdown style: ${formatting}, regex: ${regex}, string: ${string}`, () => {
        expect(regex.exec(string)).toEqual(null);
      });
    };
    const notautoformats = string => {
      it(`should not autoformat: ${string}`, () => {
        const { editorView } = editor(doc(p('{<>}')));
        insertText(editorView, string, 1);
        expect(editorView.state.doc).toEqualDocument(doc(p(string)));
      });
    };
    describe('valid strings', () => {
      // simple single word
      checkValidStrings(strongRegex1, '__test__', 'strong');
      checkValidStrings(strongRegex2, '**test**', 'strong');
      checkValidStrings(italicRegex1, '_test_', 'italic');
      checkValidStrings(italicRegex2, '*test*', 'italic');
      checkValidStrings(strikeRegex, '~~test~~', 'strike');
      checkValidStrings(codeRegex, '`test`', 'code');
      // single character
      checkValidStrings(strongRegex1, '__a__', 'strong');
      checkValidStrings(strongRegex2, '**a**', 'strong');
      checkValidStrings(italicRegex1, '_a_', 'italic');
      checkValidStrings(italicRegex2, '*a*', 'italic');
      checkValidStrings(strikeRegex, '~~a~~', 'strike');
      checkValidStrings(codeRegex, '`a`', 'code');
      // at end of line
      checkValidStrings(strongRegex1, 'abc abc abc __test__', 'strong');
      checkValidStrings(strongRegex2, 'abc abc abc **test**', 'strong');
      checkValidStrings(italicRegex1, 'abc abc abc _test_', 'italic');
      checkValidStrings(italicRegex2, 'abc abc abc *test*', 'italic');
      checkValidStrings(strikeRegex, 'abc abc abc ~~test~~', 'strike');
      checkValidStrings(codeRegex, 'abc abc abc `test`', 'code');
      // 2 characters
      checkValidStrings(strongRegex1, '__ab__', 'strong');
      checkValidStrings(strongRegex2, '**ab**', 'strong');
      checkValidStrings(italicRegex1, '_ab_', 'italic');
      checkValidStrings(italicRegex2, '*ab*', 'italic');
      checkValidStrings(strikeRegex, '~~ab~~', 'strike');
      checkValidStrings(codeRegex, '`ab`', 'code');
      // without space before
      checkValidStrings(strongRegex2, 'abc**test**', 'strong');
      checkValidStrings(italicRegex2, 'abc*test*', 'italic');
      checkValidStrings(strikeRegex, 'abc~~test~~', 'strike');
      checkValidStrings(codeRegex, 'abc`test`', 'code');
      // conbining autoformatting
      checkValidStrings(strongRegex2, '~~**test**', 'strong');
      checkValidStrings(strongRegex2, '***test**', 'string');
      checkValidStrings(strongRegex1, '___test__', 'strong');
      checkValidStrings(italicRegex2, '~~*test*', 'italic');
      checkValidStrings(strikeRegex, '**~~test~~', 'strike');
      checkValidStrings(strongRegex1, '~~__test__', 'strong');
      checkValidStrings(strongRegex1, '**__test__', 'strong');
      checkValidStrings(italicRegex1, '~~_test_', 'italic');
      checkValidStrings(italicRegex1, '**_test_', 'italic');
      // ` not in beginning of word
      autoformats('`test __test__');
      autoformats('`test **test**');
      autoformats('`test _test_');
      autoformats('`test *test*');
      autoformats('`test ~~test~~');
      // more complex string combination with `
      autoformats('`test_test_ __test__');
      autoformats('`test*test* **test**');
      autoformats('`test__test__ _test_');
      autoformats('`test**test** *test*');
      autoformats('`test**test**  ~~test~~');
      autoformats('te`st __test__');
      autoformats('te`st **test**');
      autoformats('te`st _test_');
      autoformats('te`st *test*');
      autoformats('te`st ~~test~~');
      autoformats('` __test__');
      autoformats('` **test**');
      autoformats('` _test_');
      autoformats('` *test*');
      autoformats('` ~~test~~');
    });

    describe('invalid strings', () => {
      // space after
      checkInvalidStrings(strongRegex1, '__test__ ', 'strong');
      checkInvalidStrings(strongRegex2, '**test** ', 'strong');
      checkInvalidStrings(italicRegex1, '_test_ ', 'italic');
      checkInvalidStrings(italicRegex2, '*test* ', 'italic');
      checkInvalidStrings(strikeRegex, '~~test~~ ', 'strike');
      checkInvalidStrings(codeRegex, '`test` ', 'code');
      // not last word in the line
      checkInvalidStrings(strongRegex1, '__test__ abc', 'strong');
      checkInvalidStrings(strongRegex2, '**test** abc', 'strong');
      checkInvalidStrings(italicRegex1, '_test_ abc', 'italic');
      checkInvalidStrings(italicRegex2, '*test* abc', 'italic');
      checkInvalidStrings(strikeRegex, '~~test~~ abc', 'strike');
      checkInvalidStrings(codeRegex, '`test` abc', 'code');
      // no space before
      checkInvalidStrings(strongRegex1, 'abc__test__', 'strong');
      checkInvalidStrings(italicRegex1, 'abc_test_', 'italic');
      // ` in beginning
      notautoformats('`__test__');
      notautoformats('`**test**');
      notautoformats('`_test_');
      notautoformats('`*test*');
      notautoformats('`~~test~~');
      notautoformats('___test_');
      notautoformats('__test_');
      notautoformats('**test*');
    });
  });
});

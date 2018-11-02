import { NodeSpec, Node as PMNode, Schema, Fragment } from 'prosemirror-model';
import { browser } from '../../utils';
import { TextDefinition as Text } from './text';
import { NoMark } from './doc';

/**
 * @name codeBlock_node
 */
export interface CodeBlockDefinition {
  type: 'codeBlock';
  content?: Array<Text & NoMark>;
  attrs?: {
    language?:
      | 'abap'
      | 'actionscript'
      | 'ada'
      | 'arduino'
      | 'autoit'
      | 'c'
      | 'c++'
      | 'clojure'
      | 'coffeescript'
      | 'csharp'
      | 'css'
      | 'cuda'
      | 'd'
      | 'dart'
      | 'delphi'
      | 'elixir'
      | 'erlang'
      | 'fortran'
      | 'foxpro'
      | 'go'
      | 'groovy'
      | 'haskell'
      | 'haxe'
      | 'html'
      | 'java'
      | 'javascript'
      | 'json'
      | 'julia'
      | 'kotlin'
      | 'latex'
      | 'livescript'
      | 'lua'
      | 'mathematica'
      | 'matlab'
      | 'objective-c'
      | 'objective-j'
      | 'objectpascal'
      | 'ocaml'
      | 'octave'
      | 'perl'
      | 'php'
      | 'powershell'
      | 'prolog'
      | 'puppet'
      | 'python'
      | 'qml'
      | 'r'
      | 'racket'
      | 'restructuredtext'
      | 'ruby'
      | 'rust'
      | 'sass'
      | 'scala'
      | 'scheme'
      | 'shell'
      | 'smalltalk'
      | 'sql'
      | 'standardml'
      | 'swift'
      | 'tcl'
      | 'tex'
      | 'typescript'
      | 'vala'
      | 'vbnet'
      | 'verilog'
      | 'vhdl'
      | 'xml'
      | 'xquery';
  };
}

const getLanguageFromEditorStyle = (dom: HTMLElement): string | undefined => {
  return dom.getAttribute('data-language') || undefined;
};

// example of BB style:
// <div class="codehilite language-javascript"><pre><span>hello world</span><span>\n</span></pre></div>
const getLanguageFromBitbucketStyle = (
  dom: HTMLElement,
): string | undefined => {
  if (dom && dom.classList.contains('codehilite')) {
    // code block html from Bitbucket always contains an extra new line
    return extractLanguageFromClass(dom.className);
  }
};

const extractLanguageFromClass = (className: string): string | undefined => {
  const languageRegex = /(?:^|\s)language-([^\s]+)/;
  const result = languageRegex.exec(className);
  if (result && result[1]) {
    return result[1];
  }
};

const removeLastNewLine = (dom: HTMLElement): HTMLElement => {
  const parent = dom && dom.parentElement;
  if (parent && parent.classList.contains('codehilite')) {
    dom.textContent = dom.textContent!.replace(/\n$/, '');
  }
  return dom;
};

export const codeBlock: NodeSpec = {
  attrs: { language: { default: null }, uniqueId: { default: null } },
  content: 'text*',
  marks: '',
  group: 'block',
  code: true,
  defining: true,
  parseDOM: [
    {
      tag: 'pre > code',
      preserveWhitespace: 'full',
      getAttrs: (dom: HTMLElement) => {
        const language = dom.getAttribute('data-language')!;
        return { language };
      },
    },
    {
      tag: 'pre',
      preserveWhitespace: 'full',
      getAttrs: (dom: HTMLElement) => {
        const language =
          getLanguageFromBitbucketStyle(dom.parentElement!) ||
          getLanguageFromEditorStyle(dom.parentElement!) ||
          dom.getAttribute('data-language')!;
        dom = removeLastNewLine(dom);
        return { language };
      },
    },
    // Handle VSCode paste
    // Checking `white-space: pre-wrap` is too aggressive @see ED-2627
    {
      tag: 'div[style]',
      preserveWhitespace: 'full',
      getAttrs: (dom: HTMLElement) => {
        if (
          dom.style.whiteSpace === 'pre' ||
          (dom.style.fontFamily &&
            dom.style.fontFamily.toLowerCase().indexOf('monospace') > -1)
        ) {
          return {};
        }
        return false;
      },
      // @see ED-5682
      getContent: (dom: HTMLElement, schema: Schema) => {
        const code = Array.from(dom.children)
          .map(child => child.textContent)
          // tslint:disable-next-line:triple-equals
          .filter(x => x != undefined)
          .join('\n');
        return code ? Fragment.from(schema.text(code)) : Fragment.empty;
      },
    },
    // Handle GitHub/Gist paste
    {
      tag: 'table[style]',
      preserveWhitespace: 'full',
      getAttrs: (dom: HTMLElement) => {
        if (dom.querySelector('td[class*="blob-code"]')) {
          return {};
        }
        return false;
      },
    },
    {
      tag: 'div.CodeBlock',
      preserveWhitespace: 'full',
      getAttrs: (dom: HTMLElement) => {
        // TODO: ED-5604 Fix it inside `react-syntax-highlighter`
        // Remove line numbers
        const linesCode = dom.querySelector('code');
        if (
          linesCode &&
          linesCode.querySelector('.react-syntax-highlighter-line-number')
        ) {
          // It's possible to copy without the line numbers too hence this
          // `react-syntax-highlighter-line-number` check, so that we don't remove real code
          linesCode.remove();
        }
        return {};
      },
    },
  ],
  toDOM(node) {
    const className = browser.ie && browser.ie_version <= 11 ? 'ie11' : '';
    return [
      'pre',
      ['code', { 'data-language': node.attrs.language, class: className }, 0],
    ];
  },
};

export const toJSON = (node: PMNode) => ({
  attrs: Object.keys(node.attrs).reduce((memo, key) => {
    if (key === 'uniqueId') {
      return memo;
    }

    if (key === 'language' && node.attrs.language === null) {
      return memo;
    }

    memo[key] = node.attrs[key];
    return memo;
  }, {}),
});

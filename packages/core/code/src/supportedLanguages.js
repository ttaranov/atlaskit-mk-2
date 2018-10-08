// @flow
/* eslint import/no-dynamic-require: 0, global-require: 0 */
import SyntaxHighlighter from 'react-syntax-highlighter/prism-async-light';
import memoizeOne from 'memoize-one';

/*
 * These are those languages which will be pre-loaded to auto-detect
 * the language for syntax highlighting. This list is based on the top 20
 * languages on github by number of PR, as of May 2018
 * https://madnight.github.io/githut/#/pull_requests/2018/1
 */
import coffeescript from 'react-syntax-highlighter/languages/prism/coffeescript';
import markup from 'react-syntax-highlighter/languages/prism/markup';
import markupTemplating from 'react-syntax-highlighter/languages/prism/markup-templating';
import cpp from 'react-syntax-highlighter/languages/prism/cpp';
import clike from 'react-syntax-highlighter/languages/prism/clike';
import csharp from 'react-syntax-highlighter/languages/prism/csharp';
import css from 'react-syntax-highlighter/languages/prism/css';
import d from 'react-syntax-highlighter/languages/prism/d';
import go from 'react-syntax-highlighter/languages/prism/go';
import groovy from 'react-syntax-highlighter/languages/prism/groovy';
import java from 'react-syntax-highlighter/languages/prism/java';
import javascript from 'react-syntax-highlighter/languages/prism/javascript';
import kotlin from 'react-syntax-highlighter/languages/prism/kotlin';
import lua from 'react-syntax-highlighter/languages/prism/lua';
import objectivec from 'react-syntax-highlighter/languages/prism/objectivec';
import php from 'react-syntax-highlighter/languages/prism/php';
import python from 'react-syntax-highlighter/languages/prism/python';
import ruby from 'react-syntax-highlighter/languages/prism/ruby';
import rust from 'react-syntax-highlighter/languages/prism/rust';
import scala from 'react-syntax-highlighter/languages/prism/scala';
import shell from 'react-syntax-highlighter/languages/prism/bash';
import sql from 'react-syntax-highlighter/languages/prism/sql';
import swift from 'react-syntax-highlighter/languages/prism/swift';
import typescript from 'react-syntax-highlighter/languages/prism/typescript';

SyntaxHighlighter.registerLanguage('coffeescript', coffeescript);
SyntaxHighlighter.registerLanguage('markup', markup);
SyntaxHighlighter.registerLanguage('markup-templating', markupTemplating);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('clike', clike);
SyntaxHighlighter.registerLanguage('cs', csharp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('d', d);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('groovy', groovy);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('lua', lua);
SyntaxHighlighter.registerLanguage('objectivec', objectivec);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('scala', scala);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('typescript', typescript);

/*
 * These values all those are supported by ADF.
 * The comments show mappings of these values to the corresponding
 * language definition file, or to that of the most
 * syntactically similar language supported by highlightjs
 */
export type ADFSupportedLanguages =
  | 'abap' // → sql
  | 'actionscript'
  | 'ada'
  | 'arduino'
  | 'autoit'
  | 'c' // → cpp
  | 'c++' // → cpp
  | 'coffeescript'
  | 'csharp' // → cs
  | 'css'
  | 'cuda' // → cpp
  | 'd'
  | 'dart'
  | 'delphi'
  | 'elixir'
  | 'erlang'
  | 'fortran'
  | 'foxpro' // → purebasic
  | 'go'
  | 'groovy'
  | 'haskell'
  | 'haxe'
  | 'html' // → xml
  | 'java'
  | 'javascript'
  | 'json'
  | 'julia'
  | 'kotlin'
  | 'latex' // → tex
  | 'livescript'
  | 'lua'
  | 'mathematica'
  | 'matlab'
  | 'objective-c' // → objectivec
  | 'objective-j' // → objectivec
  | 'objectpascal' // → delphi
  | 'ocaml'
  | 'octave' // → matlab
  | 'perl'
  | 'php'
  | 'powershell'
  | 'prolog'
  | 'puppet'
  | 'python'
  | 'qml'
  | 'r'
  | 'racket' // → lisp
  | 'restructuredtext' // → rest
  | 'ruby'
  | 'rust'
  | 'sass' // → less
  | 'scala'
  | 'scheme'
  | 'shell'
  | 'smalltalk'
  | 'sql'
  | 'standardml' // → sml
  | 'swift'
  | 'tcl'
  | 'tex'
  | 'text'
  | 'typescript'
  | 'vala'
  | 'vbnet'
  | 'verilog'
  | 'vhdl'
  | 'xml'
  | 'xquery';

export const SUPPORTED_LANGUAGES = Object.freeze([
  {
    name: 'PHP',
    alias: ['php', 'php3', 'php4', 'php5'],
    value: 'php',
  },
  {
    name: 'Java',
    alias: ['java'],
    value: 'java',
  },
  {
    name: 'CSharp',
    alias: ['csharp', 'c#'],
    value: 'cs',
  },
  {
    name: 'Python',
    alias: ['python', 'py'],
    value: 'python',
  },
  {
    name: 'JavaScript',
    alias: ['javascript', 'js'],
    value: 'javascript',
  },
  {
    name: 'Html',
    alias: ['html'],
    value: 'xml',
  },
  {
    name: 'C++',
    alias: ['c++', 'cpp', 'clike'],
    value: 'cpp',
  },
  {
    name: 'Ruby',
    alias: ['ruby', 'rb', 'duby'],
    value: 'ruby',
  },
  {
    name: 'Objective-C',
    alias: ['objective-c', 'objectivec', 'obj-c', 'objc'],
    value: 'objectivec',
  },
  {
    name: 'C',
    alias: ['c'],
    value: 'cpp',
  },
  {
    name: 'Swift',
    alias: ['swift'],
    value: 'swift',
  },
  {
    name: 'TeX',
    alias: ['tex', 'latex'],
    value: 'tex',
  },
  {
    name: 'Shell',
    alias: ['shell', 'bash', 'sh', 'ksh', 'zsh'],
    value: 'shell',
  },
  {
    name: 'Scala',
    alias: ['scala'],
    value: 'scala',
  },
  {
    name: 'Go',
    alias: ['go'],
    value: 'go',
  },
  {
    name: 'ActionScript',
    alias: ['actionscript', 'actionscript3', 'as'],
    value: 'actionscript',
  },
  {
    name: 'ColdFusion',
    alias: ['coldfusion'],
    value: 'xml',
  },
  {
    name: 'JavaFX',
    alias: ['javafx', 'jfx'],
    value: 'java',
  },
  {
    name: 'VbNet',
    alias: ['vbnet', 'vb.net'],
    value: 'vbnet',
  },
  {
    name: 'JSON',
    alias: ['json'],
    value: 'json',
  },
  {
    name: 'MATLAB',
    alias: ['matlab'],
    value: 'matlab',
  },
  {
    name: 'Groovy',
    alias: ['groovy'],
    value: 'groovy',
  },
  {
    name: 'SQL',
    alias: [
      'sql',
      'postgresql',
      'postgres',
      'plpgsql',
      'psql',
      'postgresql-console',
      'postgres-console',
      'tsql',
      't-sql',
      'mysql',
      'sqlite',
    ],
    value: 'sql',
  },
  {
    name: 'R',
    alias: ['r'],
    value: 'r',
  },
  {
    name: 'Perl',
    alias: ['perl', 'pl'],
    value: 'perl',
  },
  {
    name: 'Lua',
    alias: ['lua'],
    value: 'lua',
  },
  {
    name: 'Delphi',
    alias: ['delphi', 'pas', 'pascal', 'objectpascal'],
    value: 'delphi',
  },
  {
    name: 'XML',
    alias: ['xml'],
    value: 'xml',
  },
  {
    name: 'TypeScript',
    alias: ['typescript', 'ts'],
    value: 'typescript',
  },
  {
    name: 'CoffeeScript',
    alias: ['coffeescript', 'coffee-script', 'coffee'],
    value: 'coffeescript',
  },
  {
    name: 'Haskell',
    alias: ['haskell', 'hs'],
    value: 'haskell',
  },
  {
    name: 'Puppet',
    alias: ['puppet'],
    value: 'puppet',
  },
  {
    name: 'Arduino',
    alias: ['arduino'],
    value: 'arduino',
  },
  {
    name: 'Fortran',
    alias: ['fortran'],
    value: 'fortran',
  },
  {
    name: 'Erlang',
    alias: ['erlang', 'erl'],
    value: 'erlang',
  },
  {
    name: 'PowerShell',
    alias: ['powershell', 'posh', 'ps1', 'psm1'],
    value: 'powershell',
  },
  {
    name: 'Haxe',
    alias: ['haxe', 'hx', 'hxsl'],
    value: 'haxe',
  },
  {
    name: 'Elixir',
    alias: ['elixir', 'ex', 'exs'],
    value: 'elixir',
  },
  {
    name: 'Verilog',
    alias: ['verilog', 'v'],
    value: 'verilog',
  },
  {
    name: 'Rust',
    alias: ['rust'],
    value: 'rust',
  },
  {
    name: 'VHDL',
    alias: ['vhdl'],
    value: 'vhdl',
  },
  {
    name: 'Sass',
    alias: ['sass'],
    value: 'less',
  },
  {
    name: 'OCaml',
    alias: ['ocaml'],
    value: 'ocaml',
  },
  {
    name: 'Dart',
    alias: ['dart'],
    value: 'dart',
  },
  {
    name: 'CSS',
    alias: ['css'],
    value: 'css',
  },
  {
    name: 'reStructuredText',
    alias: ['restructuredtext', 'rst', 'rest'],
    value: 'rest',
  },
  {
    name: 'ObjectPascal',
    alias: ['objectpascal'],
    value: 'delphi',
  },
  {
    name: 'Kotlin',
    alias: ['kotlin'],
    value: 'kotlin',
  },
  {
    name: 'D',
    alias: ['d'],
    value: 'd',
  },
  {
    name: 'Octave',
    alias: ['octave'],
    value: 'matlab',
  },
  {
    name: 'QML',
    alias: ['qbs', 'qml'],
    value: 'qml',
  },
  {
    name: 'Prolog',
    alias: ['prolog'],
    value: 'prolog',
  },
  {
    name: 'FoxPro',
    alias: ['foxpro', 'vfp', 'clipper', 'xbase'],
    value: 'vbnet',
  },
  {
    name: 'Scheme',
    alias: ['scheme', 'scm'],
    value: 'scheme',
  },
  {
    name: 'CUDA',
    alias: ['cuda', 'cu'],
    value: 'cpp',
  },
  {
    name: 'Julia',
    alias: ['julia', 'jl'],
    value: 'julia',
  },
  {
    name: 'Racket',
    alias: ['racket', 'rkt'],
    value: 'lisp',
  },
  {
    name: 'Ada',
    alias: ['ada', 'ada95', 'ada2005'],
    value: 'ada',
  },
  {
    name: 'Tcl',
    alias: ['tcl'],
    value: 'tcl',
  },
  {
    name: 'Mathematica',
    alias: ['mathematica', 'mma', 'nb'],
    value: 'mathematica',
  },
  {
    name: 'Autoit',
    alias: ['autoit'],
    value: 'autoit',
  },
  {
    name: 'StandardML',
    alias: ['standardmL', 'sml', 'standardml'],
    value: 'sml',
  },
  {
    name: 'Objective-J',
    alias: ['objective-j', 'objectivej', 'obj-j', 'objj'],
    value: 'objectivec',
  },
  {
    name: 'Smalltalk',
    alias: ['smalltalk', 'squeak', 'st'],
    value: 'smalltalk',
  },
  {
    name: 'Vala',
    alias: ['vala', 'vapi'],
    value: 'vala',
  },
  {
    name: 'ABAP',
    alias: ['abap'],
    value: 'sql',
  },
  {
    name: 'LiveScript',
    alias: ['livescript', 'live-script'],
    value: 'livescript',
  },
  {
    name: 'XQuery',
    alias: ['xquery', 'xqy', 'xq', 'xql', 'xqm'],
    value: 'xquery',
  },
  {
    name: 'PlainText',
    alias: ['text', 'plaintext'],
    value: 'text',
  },
]);

export const normalizeLanguage = memoizeOne((language?: string): string => {
  if (!language) {
    return '';
  }
  const match = SUPPORTED_LANGUAGES.find(val => {
    return val.name === language || val.alias.includes(language);
  });
  // Fallback to plain monospaced text if language passed but not supported
  return match ? match.value : 'text';
});

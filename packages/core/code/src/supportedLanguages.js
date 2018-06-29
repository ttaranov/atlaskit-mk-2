// @flow
/* eslint import/no-dynamic-require: 0, global-require: 0 */
import { registerLanguage } from 'react-syntax-highlighter/light';
import memoizeOne from 'memoize-one';

/*
 * These are those languages which will be pre-loaded to auto-detect
 * the language for syntax highlighting. This list is based on the top 20
 * languages on github by number of PR, as of May 2018
 * https://madnight.github.io/githut/#/pull_requests/2018/1
 */
import clojure from 'react-syntax-highlighter/languages/hljs/clojure';
import coffeescript from 'react-syntax-highlighter/languages/hljs/coffeescript';
import cpp from 'react-syntax-highlighter/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/languages/hljs/cs';
import css from 'react-syntax-highlighter/languages/hljs/css';
import d from 'react-syntax-highlighter/languages/hljs/d';
import go from 'react-syntax-highlighter/languages/hljs/go';
import groovy from 'react-syntax-highlighter/languages/hljs/groovy';
import java from 'react-syntax-highlighter/languages/hljs/java';
import javascript from 'react-syntax-highlighter/languages/hljs/javascript';
import kotlin from 'react-syntax-highlighter/languages/hljs/kotlin';
import lua from 'react-syntax-highlighter/languages/hljs/lua';
import objectivec from 'react-syntax-highlighter/languages/hljs/objectivec';
import php from 'react-syntax-highlighter/languages/hljs/php';
import python from 'react-syntax-highlighter/languages/hljs/python';
import ruby from 'react-syntax-highlighter/languages/hljs/ruby';
import rust from 'react-syntax-highlighter/languages/hljs/rust';
import scala from 'react-syntax-highlighter/languages/hljs/scala';
import shell from 'react-syntax-highlighter/languages/hljs/shell';
import sql from 'react-syntax-highlighter/languages/hljs/sql';
import swift from 'react-syntax-highlighter/languages/hljs/swift';
import typescript from 'react-syntax-highlighter/languages/hljs/typescript';

registerLanguage('clojure', clojure);
registerLanguage('coffeescript', coffeescript);
registerLanguage('cpp', cpp);
registerLanguage('cs', csharp);
registerLanguage('css', css);
registerLanguage('d', d);
registerLanguage('go', go);
registerLanguage('groovy', groovy);
registerLanguage('java', java);
registerLanguage('javascript', javascript);
registerLanguage('kotlin', kotlin);
registerLanguage('lua', lua);
registerLanguage('objectivec', objectivec);
registerLanguage('php', php);
registerLanguage('python', python);
registerLanguage('ruby', ruby);
registerLanguage('rust', rust);
registerLanguage('scala', scala);
registerLanguage('shell', shell);
registerLanguage('sql', sql);
registerLanguage('swift', swift);
registerLanguage('typescript', typescript);

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
  | 'clojure'
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
    alias: ['c++', 'cpp'],
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
    name: 'Clojure',
    alias: ['clojure', 'clj'],
    value: 'clojure',
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

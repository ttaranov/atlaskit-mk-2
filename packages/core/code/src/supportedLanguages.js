// @flow
import { registerLanguage } from 'react-syntax-highlighter/light';

export const SUPPORTED_LANGUAGES = [
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
    name: 'Shell',
    alias: ['shell', 'bash', 'sh', 'ksh', 'zsh'],
    value: 'bash',
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
    name: 'Diff',
    alias: ['diff'],
    value: 'diff',
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
    name: 'Rust',
    alias: ['rust'],
    value: 'rust',
  },
  {
    name: 'Sass',
    alias: ['sass'],
    value: 'less',
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
    name: 'Kotlin',
    alias: ['kotlin'],
    value: 'kotlin',
  },
  {
    name: 'QML',
    alias: ['qbs'],
    value: 'qml',
  },
  {
    name: 'Markdown',
    alias: ['mkdown', 'md', 'markdown'],
    value: 'markdown',
  },
  {
    name: 'StandardML',
    alias: ['standardmL', 'sml'],
    value: 'sml',
  },
];

// import and register only those language definitions that we care about
new Set(SUPPORTED_LANGUAGES.map(lang => lang.value)).forEach(lang => {
  const langDef = require(`react-syntax-highlighter/languages/hljs/${lang}`)
    .default;
  registerLanguage(lang, langDef);
});

export const languageList: string[] = SUPPORTED_LANGUAGES.reduce(
  (acc: string[], val: any) => {
    return acc.concat(val.name, val.alias);
  },
  [],
);

export function normalizeLanguage(language?: string): string {
  if (name === 'PlainText' || ['plaintext', 'text'].includes(language)) {
    return 'text';
  }
  const match = SUPPORTED_LANGUAGES.filter(val => {
    return val.name === language || val.alias.includes(language);
  }).shift();
  return match ? match.value : ''; // default to empty string to enable language auto-detect
}

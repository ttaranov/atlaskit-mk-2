export const LANGUAGE_MAP = {
  actionscript: 'actionscript3',
  applescript: 'applescript',
  'c++': 'cpp',
  coldfusion: 'coldfusion',
  csharp: 'c#',
  css: 'css',
  delphi: 'delphi',
  diff: 'diff',
  erlang: 'erl',
  groovy: 'groovy',
  java: 'java',
  javafx: 'javafx',
  javascript: 'js',
  perl: 'perl',
  php: 'php',
  plaintext: 'text',
  powershell: 'powershell',
  python: 'py',
  ruby: 'ruby',
  sass: 'sass',
  scala: 'scala',
  shell: 'bash',
  sql: 'sql',
  visualbasic: 'vb',
  xml: 'xml',
};

export const supportedLanguages = Object.keys(LANGUAGE_MAP).map(
  name => LANGUAGE_MAP[name],
);

export function mapCodeLanguage(language: string): string {
  return LANGUAGE_MAP[language] || language.toLowerCase();
}

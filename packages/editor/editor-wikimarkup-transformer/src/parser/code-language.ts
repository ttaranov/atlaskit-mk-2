const SUPPORTED_CODEBOCK_LANGUAGES = [
  'actionscript',
  'ada',
  'c',
  'c++',
  'css',
  'erlang',
  'go',
  'groovy',
  'haskell',
  'html',
  'javascript',
  'json',
  'lua',
  'perl',
  'php',
  'python',
  'r',
  'ruby',
  'scala',
  'sql',
  'swift',
  'xml',
];

export function getCodeLanguage(attrs: { [key: string]: string }): string {
  const keys = Object.keys(attrs).map(key => key.toLowerCase());

  for (const language of SUPPORTED_CODEBOCK_LANGUAGES) {
    if (keys.indexOf(language) !== -1) {
      return language;
    }
  }

  if (keys.indexOf('objc') !== -1) {
    return 'objective-c';
  }

  return 'java';
}

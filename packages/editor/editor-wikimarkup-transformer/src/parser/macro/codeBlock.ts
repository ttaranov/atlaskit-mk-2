import { Node as PMNode, Schema } from 'prosemirror-model';
import { title } from '../utils/title';

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

export function codeBlockMacro(
  attrs: { [key: string]: string },
  rawContent: string,
  schema: Schema,
): PMNode[] {
  const output: PMNode[] = [];
  const { codeBlock } = schema.nodes;

  const trimedContent = rawContent.replace(/^\s+|\s+$/g, '');
  const textNode = trimedContent.length
    ? schema.text(trimedContent)
    : undefined;
  if (attrs.title) {
    output.push(title(attrs.title, schema));
  }

  const nodeAttrs = {
    ...attrs,
    language: getCodeLanguage(attrs),
  };

  output.push(codeBlock.createChecked(nodeAttrs, textNode));
  return output;
}

function getCodeLanguage(attrs: { [key: string]: string }): string {
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

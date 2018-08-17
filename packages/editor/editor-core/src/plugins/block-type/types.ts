// The names of the blocks don't map precisely to schema nodes, because
// of concepts like "paragraph" <-> "Normal text" and "Unknown".
//
// Rather than half-match half-not, this plugin introduces its own
// nomenclature for what 'block type' is active.
export const NORMAL_TEXT: BlockType = {
  name: 'normal',
  title: 'Normal text',
  nodeName: 'paragraph',
  tagName: 'p',
};
export const HEADING_1: BlockType = {
  name: 'heading1',
  title: 'Heading 1',
  nodeName: 'heading',
  tagName: 'h1',
  level: 1,
};
export const HEADING_2: BlockType = {
  name: 'heading2',
  title: 'Heading 2',
  nodeName: 'heading',
  tagName: 'h2',
  level: 2,
};
export const HEADING_3: BlockType = {
  name: 'heading3',
  title: 'Heading 3',
  nodeName: 'heading',
  tagName: 'h3',
  level: 3,
};
export const HEADING_4: BlockType = {
  name: 'heading4',
  title: 'Heading 4',
  nodeName: 'heading',
  tagName: 'h4',
  level: 4,
};
export const HEADING_5: BlockType = {
  name: 'heading5',
  title: 'Heading 5',
  nodeName: 'heading',
  tagName: 'h5',
  level: 5,
};
export const HEADING_6: BlockType = {
  name: 'heading6',
  title: 'Heading 6',
  nodeName: 'heading',
  tagName: 'h6',
  level: 6,
};
export const BLOCK_QUOTE: BlockType = {
  name: 'blockquote',
  title: 'Block quote',
  nodeName: 'blockquote',
};
export const CODE_BLOCK: BlockType = {
  name: 'codeblock',
  title: 'Code block',
  nodeName: 'codeBlock',
  shortcut: '```',
};
export const PANEL: BlockType = {
  name: 'panel',
  title: 'Panel',
  nodeName: 'panel',
};
export const OTHER: BlockType = {
  name: 'other',
  title: 'Other…',
  nodeName: '',
};

export const TEXT_BLOCK_TYPES = [
  NORMAL_TEXT,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
];

export const WRAPPER_BLOCK_TYPES = [BLOCK_QUOTE, CODE_BLOCK, PANEL];
export const ALL_BLOCK_TYPES = TEXT_BLOCK_TYPES.concat(WRAPPER_BLOCK_TYPES);

export const HEADINGS_BY_LEVEL = TEXT_BLOCK_TYPES.reduce((acc, blockType) => {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.level] = blockType;
  }

  return acc;
}, {});

export const HEADINGS_BY_NAME = TEXT_BLOCK_TYPES.reduce((acc, blockType) => {
  if (blockType.level && blockType.nodeName === 'heading') {
    acc[blockType.name] = blockType;
  }

  return acc;
}, {});

export type BlockTypeName =
  | 'normal'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'heading4'
  | 'heading5'
  | 'blockquote'
  | 'codeblock'
  | 'panel'
  | 'other';

export interface BlockType {
  name: string;
  title: string;
  nodeName: string;
  tagName?: string;
  level?: number;
  shortcut?: string;
}

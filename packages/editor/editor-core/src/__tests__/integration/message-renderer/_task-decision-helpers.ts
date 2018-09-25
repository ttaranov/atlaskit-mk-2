import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';

export const messageEditor = getExampleUrl(
  'editor',
  'editor-core',
  'message-renderer',
);
export const editable = `.ProseMirror`;

export const loadActionButton = 'span=Load Action';
export const loadDecisionButton = 'span=Load Decision';

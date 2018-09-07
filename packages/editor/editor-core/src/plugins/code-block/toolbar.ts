import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { removeCodeBlock, changeLanguage } from './actions';

import {
  createLanguageList,
  DEFAULT_LANGUAGES,
  getLanguageIdentifier,
} from '@atlaskit/editor-common';

import { pluginKey, CodeBlockState } from './pm-plugins/main';
export const getToolbarConfig: FloatingToolbarHandler = state => {
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  if (
    codeBlockState &&
    codeBlockState.toolbarVisible &&
    codeBlockState.element
  ) {
    const { language } = codeBlockState;
    return {
      title: 'CodeBlock floating controls',
      getDomRef: () => codeBlockState.element,
      nodeType: state.schema.nodes.codeBlock,
      items: [
        {
          type: 'select',
          title: 'language',
          onChange: changeLanguage,
          defaultValue: language,
          placeholder: 'Select language',
          options: createLanguageList(DEFAULT_LANGUAGES).map(lang => ({
            label: lang.name,
            value: getLanguageIdentifier(lang),
          })),
        },
        {
          type: 'separator',
        },
        {
          type: 'button',
          appearance: 'danger',
          spacing: 'default',
          icon: RemoveIcon,
          onClick: removeCodeBlock(),
          title: 'Remove table',
        },
      ],
    };
  }
};

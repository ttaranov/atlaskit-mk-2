import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { removeCodeBlock, changeLanguage } from './actions';

import {
  createLanguageList,
  DEFAULT_LANGUAGES,
  getLanguageIdentifier,
} from '@atlaskit/editor-common';

import { pluginKey, CodeBlockState } from './pm-plugins/main';
import {
  SelectToolbarItem,
  FloatingToolbarHandler,
} from '../floating-toolbar/types';
import { Command } from '../../commands';
// export const getToolbarConfig = state => {
// export const getToolbarConfig = state => {
export const getToolbarConfig: FloatingToolbarHandler = state => {
  const codeBlockState: CodeBlockState | undefined = pluginKey.getState(state);
  if (
    codeBlockState &&
    codeBlockState.toolbarVisible &&
    codeBlockState.element
  ) {
    const { language } = codeBlockState;

    const selectItem: SelectToolbarItem<Command> = {
      type: 'select',
      title: 'language',
      onChange: changeLanguage,
      defaultValue: language,
      placeholder: 'Select language',
      options: createLanguageList(DEFAULT_LANGUAGES).map(lang => ({
        label: lang.name,
        value: getLanguageIdentifier(lang),
      })),
    };

    return {
      title: 'CodeBlock floating controls',
      getDomRef: () => codeBlockState.element,
      nodeType: state.schema.nodes.codeBlock,
      items: [
        selectItem,
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

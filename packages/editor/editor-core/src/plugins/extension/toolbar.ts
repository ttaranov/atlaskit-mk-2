import { defineMessages } from 'react-intl';
import { hasParentNodeOfType } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';

import { Command } from '../../types';
import commonMessages from '../../messages';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import {
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import {
  updateExtensionLayout,
  editExtension,
  removeExtension,
} from './actions';
import { pluginKey, ExtensionState } from './plugin';

export const messages = defineMessages({
  edit: {
    id: 'fabric.editor.edit',
    defaultMessage: 'Edit',
    description: 'Edit the properties for this extension.',
  },
});

const isLayoutSupported = (state, selectedExtNode) => {
  const {
    schema: {
      nodes: { bodiedExtension, extension, layoutSection, table },
    },
    selection,
  } = state;

  if (!selectedExtNode) {
    return false;
  }

  return !!(
    (selectedExtNode.node.type === bodiedExtension ||
      (selectedExtNode.node.type === extension &&
        !hasParentNodeOfType([bodiedExtension, table])(selection))) &&
    !hasParentNodeOfType([layoutSection])(selection)
  );
};

const breakoutOptions = (
  state,
  formatMessage,
  extensionState,
): Array<FloatingToolbarItem<Command>> => {
  const { layout, allowBreakout, node } = extensionState;
  return allowBreakout && isLayoutSupported(state, node)
    ? [
        {
          type: 'button',
          icon: CenterIcon,
          onClick: updateExtensionLayout('default'),
          selected: layout === 'default',
          title: formatMessage(commonMessages.layoutFixedWidth),
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: updateExtensionLayout('wide'),
          selected: layout === 'wide',
          title: formatMessage(commonMessages.layoutWide),
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: updateExtensionLayout('full-width'),
          selected: layout === 'full-width',
          title: formatMessage(commonMessages.layoutFullWidth),
        },
      ]
    : [];
};

export const getToolbarConfig: FloatingToolbarHandler = (
  state,
  { formatMessage },
) => {
  const extensionState: ExtensionState = pluginKey.getState(state);
  const macroState: MacroState = macroPluginKey.getState(state);
  if (extensionState && extensionState.element) {
    return {
      title: 'Extension floating controls',
      getDomRef: () => extensionState.element!.parentElement || undefined,
      nodeType: [
        state.schema.nodes.extension,
        state.schema.nodes.inlineExtension,
        state.schema.nodes.bodiedExtension,
      ],
      items: [
        {
          type: 'button',
          icon: EditIcon,
          onClick: editExtension(macroState && macroState.macroProvider),
          title: formatMessage(messages.edit),
        },
        ...breakoutOptions(state, formatMessage, extensionState),
        {
          type: 'separator',
        },
        {
          type: 'button',
          icon: RemoveIcon,
          appearance: 'danger',
          onClick: removeExtension(),
          title: formatMessage(commonMessages.remove),
        },
      ],
    };
  }
};

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import {
  FloatingToolbarHandler,
  FloatingToolbarItem,
} from '../floating-toolbar/types';
import {
  updateExtensionLayout,
  editExtension,
  removeExtension,
} from './actions';
import { MacroState, pluginKey as macroPluginKey } from '../macro';
import { pluginKey, ExtensionState } from './plugin';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../types';

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
          intlTitle: 'ext_center',
        },
        {
          type: 'button',
          icon: WideIcon,
          onClick: updateExtensionLayout('wide'),
          selected: layout === 'wide',
          intlTitle: 'ext_wide',
        },
        {
          type: 'button',
          icon: FullWidthIcon,
          onClick: updateExtensionLayout('full-width'),
          selected: layout === 'full-width',
          intlTitle: 'ext_full_width',
        },
      ]
    : [];
};

export const getToolbarConfig: FloatingToolbarHandler = state => {
  const extensionState: ExtensionState = pluginKey.getState(state);
  const macroState: MacroState = macroPluginKey.getState(state);
  if (extensionState && extensionState.element) {
    return {
      title: 'Extension floating controls',
      getDomRef: () => extensionState.element,
      nodeType: state.schema.nodes.panel,
      items: [
        {
          type: 'button',
          icon: EditIcon,
          onClick: editExtension(macroState && macroState.macroProvider),
          intlTitle: 'ext_pencil',
        },
        ...breakoutOptions(state, extensionState),
        {
          type: 'separator',
        },
        {
          type: 'button',
          icon: RemoveIcon,
          appearance: 'danger',
          onClick: removeExtension(),
          intlTitle: 'ext_remove',
        },
      ],
    };
  }
};

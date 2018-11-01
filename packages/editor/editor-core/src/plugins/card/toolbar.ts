import { InjectedIntl, defineMessages } from 'react-intl';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import OpenIcon from '@atlaskit/icon/glyph/open';

import { analyticsService } from '../../analytics';
import commonMessages from '../../messages';
import { Command } from '../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
} from '../../../src/plugins/floating-toolbar/types';
import { SelectOption } from '../floating-toolbar/ui/Select';
import {
  changeSelectedCardToLink,
  setSelectedCardAppearance,
} from './pm-plugins/doc';
import { appearanceForNodeType } from './utils';
import { CardAppearance } from './types';
import { Fragment } from 'prosemirror-model';

export const messages = defineMessages({
  block: {
    id: 'fabric.editor.displayBlock',
    defaultMessage: 'Display as card',
    description:
      'Display link as a card with a rich preview similar to in a Facebook feed with page title, description, and potentially an image.',
  },
  inline: {
    id: 'fabric.editor.displayInline',
    defaultMessage: 'Display as link',
    description: 'Display link with the title only.',
  },
  link: {
    id: 'fabric.editor.displayLink',
    defaultMessage: 'Display as text',
    description: 'Convert the card to become a regular text-based hyperlink.',
  },
});

const remove: Command = (state, dispatch) => {
  dispatch(removeSelectedNode(state.tr));
  analyticsService.trackEvent('atlassian.editor.format.card.delete.button');
  return true;
};

const visit: Command = state => {
  if (state.selection instanceof NodeSelection) {
    const { attrs } = state.selection.node;
    const data = attrs.data || {};
    const url = attrs.url || data.url;

    window.open(url);
    analyticsService.trackEvent('atlassian.editor.format.card.visit.button');
    return true;
  }

  return false;
};

const changeAppearance = (selectedOption: SelectOption) => {
  if (selectedOption.value === 'link') {
    return changeSelectedCardToLink;
  } else {
    return setSelectedCardAppearance(selectedOption.value as CardAppearance);
  }
};

const buildDropdown = (
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarItem<Command> => {
  const { selection } = state;
  const selectedNode = selection instanceof NodeSelection && selection.node;
  const options: SelectOption[] = [];
  const { inlineCard, blockCard } = state.schema.nodes;

  if (selectedNode && [inlineCard, blockCard].indexOf(selectedNode.type) > -1) {
    const currentAppearance = appearanceForNodeType(selectedNode.type);

    ['block', 'inline', 'link'].forEach(value => {
      // don't allow conversion to link if it has no url attached
      if (value === 'link' && !selectedNode.attrs.url) {
        return;
      }

      if (value === 'block') {
        // don't allow conversion if the parent node doesn't allow it
        const { $from } = selection;
        const containerDepth =
          currentAppearance === 'block' ? $from.depth : $from.depth - 1;

        const allowed = $from
          .node(containerDepth)
          .type.validContent(
            Fragment.from(
              blockCard.createChecked(
                selectedNode.attrs,
                undefined,
                selectedNode.marks,
              ),
            ),
          );

        if (!allowed) {
          return;
        }
      }

      options.push({
        value,
        label: intl.formatMessage(messages[value]),
        selected: currentAppearance === value,
      });
    });
  }

  return {
    type: 'select',
    options,
    defaultValue: options.find(option => !!option.selected),
    onChange: changeAppearance,
  };
};

export const floatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarConfig | undefined => {
  const { inlineCard, blockCard } = state.schema.nodes;

  return {
    title: 'Card floating controls',
    nodeType: [inlineCard, blockCard],
    items: [
      buildDropdown(state, intl),
      { type: 'separator' },
      {
        type: 'button',
        icon: OpenIcon,
        title: intl.formatMessage(commonMessages.visit),
        onClick: visit,
      },
      { type: 'separator' },
      {
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        title: intl.formatMessage(commonMessages.remove),
        onClick: remove,
      },
    ],
  };
};

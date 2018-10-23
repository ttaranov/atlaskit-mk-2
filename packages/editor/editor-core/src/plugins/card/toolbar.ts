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

export const messages = defineMessages({
  block: {
    id: 'fabric.editor.displayBlock',
    defaultMessage: 'Display as block',
    description: 'Change the appearance of the card to be a block.',
  },
  inline: {
    id: 'fabric.editor.displayInline',
    defaultMessage: 'Display as inline',
    description: 'Change the appearance of the card to be inline.',
  },
  link: {
    id: 'fabric.editor.displayLink',
    defaultMessage: 'Display as link',
    description: 'Convert the card to become a regular link.',
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
  const selectedCard =
    state.selection instanceof NodeSelection && state.selection.node;
  const options: SelectOption[] = [];

  if (selectedCard) {
    const currentAppearance = appearanceForNodeType(selectedCard.type);

    ['block', 'inline', 'link'].forEach(value => {
      // don't allow conversion to link if it has no url attached
      if (value === 'link' && !selectedCard.attrs.url) {
        return;
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

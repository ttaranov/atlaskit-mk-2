import { InjectedIntl } from 'react-intl';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { removeSelectedNode } from 'prosemirror-utils';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import OpenIcon from '@atlaskit/icon/glyph/open';

import { analyticsService } from '../../analytics';
import commonMessages from '../../messages';
import { Command } from '../../../src/types';
import { FloatingToolbarConfig } from '../../../src/plugins/floating-toolbar/types';

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

export const floatingToolbar = (
  state: EditorState,
  intl: InjectedIntl,
): FloatingToolbarConfig | undefined => {
  const { inlineCard } = state.schema.nodes;

  return {
    title: 'Card floating controls',
    nodeType: inlineCard,
    items: [
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

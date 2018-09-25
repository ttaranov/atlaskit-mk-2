import { defineMessages, InjectedIntl } from 'react-intl';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';

import commonMessages from '../../messages';
import { MessageDescriptor } from '../../types/i18n';
import { Command } from '../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  Icon,
} from '../../../src/plugins/floating-toolbar/types';
import { setActiveLayoutType, deleteActiveLayoutNode } from './actions';

export const messages = defineMessages({
  twoColumns: {
    id: 'fabric.editor.twoColumns',
    defaultMessage: 'Two columns',
    description: '',
  },
  threeColumns: {
    id: 'fabric.editor.threeColumns',
    defaultMessage: 'Three columns',
    description: '',
  },
});

const LAYOUT_TYPES = [
  { type: 'two_equal', title: messages.twoColumns, icon: LayoutTwoEqualIcon },
  {
    type: 'three_equal',
    title: messages.threeColumns,
    icon: LayoutThreeEqualIcon,
  },
  // { type: two_left_sidebar, text: 'Two columns with left sidebar' }
  // { type: two_right_sidebar, text: 'Two columns with right sidebar' }
  // { type: three_with_siderbars, text: 'Three columns with sidebars' }
];

const buildLayoutButton = (
  intl: InjectedIntl,
  item: { type: string; title: MessageDescriptor; icon: Icon },
  active: Node,
): FloatingToolbarItem<Command> => ({
  type: 'button',
  icon: item.icon,
  title: intl.formatMessage(item.title),
  onClick: setActiveLayoutType(item.type),
  selected: active.attrs.layoutType === item.type,
});

export const buildToolbar = (
  state: EditorState,
  intl: InjectedIntl,
  pos: number,
): FloatingToolbarConfig | undefined => {
  const node = state.doc.nodeAt(pos);
  if (node) {
    return {
      title: 'Columns floating controls',
      getDomRef: view =>
        findDomRefAtPos(pos, view.domAtPos.bind(view)) as HTMLElement,
      nodeType: state.schema.nodes.layoutSection,
      items: [
        ...LAYOUT_TYPES.map(i => buildLayoutButton(intl, i, node)),
        { type: 'separator' },
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          title: intl.formatMessage(commonMessages.remove),
          onClick: deleteActiveLayoutNode,
        },
      ],
    };
  }
};

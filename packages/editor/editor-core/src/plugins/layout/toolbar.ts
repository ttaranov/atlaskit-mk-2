import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { Command } from '../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  Icon,
} from '../../../src/plugins/floating-toolbar/types';
import { setActiveLayoutType, deleteActiveLayoutNode } from './actions';

const LAYOUT_TYPES = [
  { type: 'two_equal', text: 'Two Columns', icon: LayoutTwoEqualIcon },
  { type: 'three_equal', text: 'Three Columns', icon: LayoutThreeEqualIcon },
  {
    type: 'two_left_sidebar',
    text: 'Two Columns with Left Sidebar',
    icon: LayoutTwoLeftSidebarIcon,
  },
  {
    type: 'two_right_sidebar',
    text: 'Two Columns with Right Sidebar',
    icon: LayoutTwoRightSidebarIcon,
  },
  {
    type: 'three_with_sidebars',
    text: 'Three Columns with Sidebars',
    icon: LayoutThreeWithSidebarsIcon,
  },
];

const buildLayoutButton = (
  item: { type: string; text: string; icon: Icon },
  active: Node,
): FloatingToolbarItem<Command> => ({
  type: 'button',
  icon: item.icon,
  title: item.text,
  onClick: setActiveLayoutType(item.type),
  selected: active.attrs.layoutType === item.type,
});

export const buildToolbar = (
  state: EditorState,
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
        ...LAYOUT_TYPES.map(i => buildLayoutButton(i, node)),
        { type: 'separator' },
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          title: 'Remove columns',
          onClick: deleteActiveLayoutNode,
        },
      ],
    };
  }
};

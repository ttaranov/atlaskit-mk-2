import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { Command } from '../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  Icon,
} from '../../../src/plugins/floating-toolbar/types';
import { setActiveLayoutType, deleteActiveLayoutNode } from './actions';

const LAYOUT_TYPES = [
  { type: 'two_equal', intlTitle: 'two_columns', icon: LayoutTwoEqualIcon },
  {
    type: 'three_equal',
    intlTitle: 'three_columns',
    icon: LayoutThreeEqualIcon,
  },
  // { type: two_left_sidebar, text: 'Two columns with left sidebar' }
  // { type: two_right_sidebar, text: 'Two columns with right sidebar' }
  // { type: three_with_siderbars, text: 'Three columns with sidebars' }
];

const buildLayoutButton = (
  item: { type: string; intlTitle: string; icon: Icon },
  active: Node,
): FloatingToolbarItem<Command> => ({
  type: 'button',
  icon: item.icon,
  intlTitle: item.intlTitle,
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
          intlTitle: 'remove_columns',
          onClick: deleteActiveLayoutNode,
        },
      ],
    };
  }
};

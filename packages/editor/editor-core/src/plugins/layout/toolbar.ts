import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { Command } from '../../../src/types';
import {
  FloatingToolbarConfig,
  FloatingToolbarItem,
  Icon,
} from '../../../src/plugins/floating-toolbar/types';
import { setActiveLayoutType, deleteActiveLayoutNode } from './actions';

const LAYOUT_TYPES = [
  { type: 'two_equal', text: 'Two columns', icon: LayoutTwoEqualIcon },
  { type: 'three_equal', text: 'Three columns', icon: LayoutThreeEqualIcon },
  { type: 'float_left', text: 'Float left', icon: WrapLeftIcon },
  { type: 'float_right', text: 'Float right', icon: WrapRightIcon },
  // { type: two_left_sidebar, text: 'Two columns with left sidebar' }
  // { type: two_right_sidebar, text: 'Two columns with right sidebar' }
  // { type: three_with_siderbars, text: 'Three columns with sidebars' }
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

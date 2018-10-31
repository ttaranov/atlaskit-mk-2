import { EditorState } from 'prosemirror-state';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import { Command } from '../../../types';
import commonMessages from '../../../messages';
import { FloatingToolbarButton } from '../../floating-toolbar/types';
import { removeBreakout } from '../commands/remove-breakout';
import { setBreakoutMode } from '../commands/set-breakout-mode';
import { getBreakoutMode } from './get-breakout-mode';
import { isBreakoutMarkAllowed } from './is-breakout-mark-allowed';

export function createBreakoutToolbarItems(
  state: EditorState,
  { formatMessage },
) {
  if (!isBreakoutMarkAllowed(state)) {
    return false;
  }

  const breakoutMode = getBreakoutMode(state);

  const centerButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: CenterIcon,
    onClick: removeBreakout(),
    title: formatMessage(commonMessages.layoutFixedWidth),
    selected: !breakoutMode,
  };

  const wideButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: WideIcon,
    onClick: setBreakoutMode('wide'),
    title: formatMessage(commonMessages.layoutWide),
    selected: breakoutMode === 'wide',
  };

  const fullWidthButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: FullWidthIcon,
    onClick: setBreakoutMode('full-width'),
    title: formatMessage(commonMessages.layoutFullWidth),
    selected: breakoutMode === 'full-width',
  };

  return [centerButton, wideButton, fullWidthButton];
}

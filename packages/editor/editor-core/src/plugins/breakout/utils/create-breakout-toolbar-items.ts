import { EditorState } from 'prosemirror-state';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import { Command } from '../../../types';
import { FloatingToolbarButton } from '../../floating-toolbar/types';
import { removeBreakout } from '../commands/remove-breakout';
import { setBreakoutMode } from '../commands/set-breakout-mode';
import { getBreakoutMode } from './get-breakout-mode';

export function createBreakoutToolbarItems(state: EditorState) {
  const breakoutMode = getBreakoutMode(state);
  const centerButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: CenterIcon,
    onClick: removeBreakout(),
    title: 'Center',
    selected: breakoutMode === 'center',
  };

  const wideButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: WideIcon,
    onClick: setBreakoutMode('wide'),
    title: 'Wide',
    selected: breakoutMode === 'wide',
  };

  const fullWidthButton: FloatingToolbarButton<Command> = {
    type: 'button',
    icon: FullWidthIcon,
    onClick: setBreakoutMode('full-width'),
    title: 'Full width',
    selected: breakoutMode === 'full-width',
  };

  return [centerButton, wideButton, fullWidthButton];
}

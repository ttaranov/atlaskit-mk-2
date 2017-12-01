import { keydownHandler } from 'prosemirror-keymap';
import { MarkType } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import * as keymaps from '../../keymaps';
import { trackAndInvoke } from '../../analytics';
import { TextFormattingState } from './';
import * as commands from './commands';

export function keymapHandler(
  view: EditorView,
  pluginState: TextFormattingState,
): Function {
  const list = {};
  const { schema } = view.state;

  if (schema.marks.strong) {
    const eventName = analyticsEventName(schema.marks.strong);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleBold.common!,
      trackAndInvoke(eventName, () => pluginState.toggleStrong(view)),
      list,
    );
  }

  if (schema.marks.em) {
    const eventName = analyticsEventName(schema.marks.em);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleItalic.common!,
      trackAndInvoke(eventName, () => pluginState.toggleEm(view)),
      list,
    );
  }

  if (schema.marks.code) {
    const eventName = analyticsEventName(schema.marks.code);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleCode.common!,
      trackAndInvoke(eventName, () => pluginState.toggleCode(view)),
      list,
    );
  }

  if (schema.marks.strike) {
    const eventName = analyticsEventName(schema.marks.strike);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleStrikethrough.common!,
      trackAndInvoke(eventName, () => pluginState.toggleStrike(view)),
      list,
    );
  }

  if (schema.marks.underline) {
    const eventName = analyticsEventName(schema.marks.underline);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleUnderline.common!,
      trackAndInvoke(eventName, () => pluginState.toggleUnderline(view)),
      list,
    );
  }

  keymaps.bindKeymapWithCommand(
    keymaps.moveRight.common!,
    commands.moveRight(),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.moveLeft.common!,
    commands.moveLeft(view),
    list,
  );
  keymaps.bindKeymapWithCommand(
    keymaps.backspace.common!,
    commands.removeIgnoredNodes(view),
    list,
  );

  return keydownHandler(list);
}

function analyticsEventName(markType: MarkType): string {
  return `atlassian.editor.format.${markType.name}.keyboard`;
}

export default keymapHandler;

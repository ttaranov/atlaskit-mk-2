import { keymap } from 'prosemirror-keymap';
import { MarkType, Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import * as keymaps from '../../../keymaps';
import { trackAndInvoke } from '../../../analytics';
import * as commands from '../commands/text-formatting';

export default function keymapPlugin(schema: Schema): Plugin {
  const list = {};

  if (schema.marks.strong) {
    const eventName = analyticsEventName(schema.marks.strong);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleBold.common!,
      trackAndInvoke(eventName, commands.toggleStrong()),
      list,
    );
  }

  if (schema.marks.em) {
    const eventName = analyticsEventName(schema.marks.em);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleItalic.common!,
      trackAndInvoke(eventName, commands.toggleEm()),
      list,
    );
  }

  if (schema.marks.code) {
    const eventName = analyticsEventName(schema.marks.code);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleCode.common!,
      trackAndInvoke(eventName, commands.toggleCode()),
      list,
    );
  }

  if (schema.marks.strike) {
    const eventName = analyticsEventName(schema.marks.strike);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleStrikethrough.common!,
      trackAndInvoke(eventName, commands.toggleStrike()),
      list,
    );
  }

  if (schema.marks.underline) {
    const eventName = analyticsEventName(schema.marks.underline);
    keymaps.bindKeymapWithCommand(
      keymaps.toggleUnderline.common!,
      trackAndInvoke(eventName, commands.toggleUnderline()),
      list,
    );
  }

  return keymap(list);
}

function analyticsEventName(markType: MarkType): string {
  return `atlassian.editor.format.${markType.name}.keyboard`;
}

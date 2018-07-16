import { EditorProps, EditorAppearance } from '../types';

const messageEditorPropsPreset: EditorProps = {
  appearance: 'message',

  saveOnEnter: true,

  allowLists: true,
  allowTextColor: true,
  allowInlineAction: true,
  allowCodeBlocks: true,
  allowTasksAndDecisions: true,
  allowHelpDialog: true,
};

export default function getPropsPreset(
  appearance: EditorAppearance,
): EditorProps {
  switch (appearance) {
    case 'message':
      return { ...messageEditorPropsPreset };
    default:
      return {};
  }
}

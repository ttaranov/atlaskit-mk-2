import { analyticsService } from '../../analytics';
import { NodeType } from 'prosemirror-model';
import {
  TextSelection,
  NodeSelection,
  EditorState,
  Transaction,
} from 'prosemirror-state';

export const insertBlock = (
  state: EditorState,
  nodeType: NodeType,
  nodeName: string,
  start,
  end,
  matchSize: number,
  attrs?: { [key: string]: any },
): Transaction => {
  analyticsService.trackEvent(
    `atlassian.editor.format.${nodeName}.autoformatting`,
  );

  let tr = state.tr.delete(start, end).split(start);

  const currentNode = tr.doc.nodeAt(start + 1);
  const { blockquote, paragraph } = state.schema.nodes;
  let content;
  if (nodeType === blockquote) {
    content = [paragraph.create({}, currentNode!.content)];
  } else {
    content = currentNode!.content;
  }
  const newNode = nodeType.create(attrs, content);

  tr = tr
    .setSelection(new NodeSelection(tr.doc.resolve(start + 1)))
    .replaceSelectionWith(newNode!)
    .setSelection(new TextSelection(tr.doc.resolve(start + 2)));
  return tr;
};

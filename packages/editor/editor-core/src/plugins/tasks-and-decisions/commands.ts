import { uuid } from '@atlaskit/editor-common';
import { Node as PMNode, ResolvedPos, Schema } from 'prosemirror-model';
import {
  EditorState,
  Selection,
  Transaction,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  safeInsert,
  hasParentNodeOfType,
  replaceParentNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { GapCursorSelection } from '../gap-cursor';

export type TaskDecisionListType = 'taskList' | 'decisionList';

const getListTypes = (
  listType: TaskDecisionListType,
  schema: Schema,
): { list; item } => {
  const { decisionList, decisionItem, taskList, taskItem } = schema.nodes;
  if (listType === 'taskList') {
    return {
      list: taskList,
      item: taskItem,
    };
  }

  return {
    list: decisionList,
    item: decisionItem,
  };
};

export const insertTaskDecision = (
  view: EditorView,
  listType: TaskDecisionListType,
): boolean => {
  const { state } = view;
  const { schema } = state;
  const { list, item } = getListTypes(listType, schema);
  const { tr } = state;
  const { $to } = state.selection;

  if (!findParentNodeOfType(list)(state.selection)) {
    // Not a list - convert to one.
    const created = createListAtSelection(tr, list, item, schema, state);
    view.dispatch(tr);
    return created;
  } else if ($to.node().textContent.length > 0) {
    const pos = $to.end($to.depth);
    tr.split(pos, 1, [{ type: item, attrs: { localId: uuid.generate() } }]);
    tr.setSelection(new TextSelection(tr.doc.resolve(pos + $to.depth)));
    view.dispatch(tr);
    return true;
  }

  return false;
};

export const isSupportedSourceNode = (
  schema: Schema,
  selection: Selection,
): boolean => {
  const { paragraph, blockquote, decisionList, taskList } = schema.nodes;

  return hasParentNodeOfType([blockquote, paragraph, decisionList, taskList])(
    selection,
  );
};

export const changeInDepth = (before: ResolvedPos, after: ResolvedPos) =>
  after.depth - before.depth;

export const createListAtSelection = (
  tr: Transaction,
  list: any,
  item: any,
  schema: Schema,
  state: EditorState,
): boolean => {
  const { selection } = state;
  const { $from, $to } = selection;
  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return false;
  }

  const {
    paragraph,
    blockquote,
    decisionList,
    taskList,
    mediaGroup,
  } = schema.nodes;
  if ($from.parent.type === mediaGroup) {
    return false;
  }

  const emptyList = list.create({ localId: uuid.generate() }, [
    item.create({ localId: uuid.generate() }),
  ]);

  // we don't take the content of a block node next to the gap cursor and always create an empty task
  if (selection instanceof GapCursorSelection) {
    safeInsert(emptyList)(tr);
    return true;
  }

  // try to replace any of the given nodeTypes
  if (isSupportedSourceNode(schema, selection)) {
    const newTr = replaceParentNodeOfType(
      [blockquote, paragraph, decisionList, taskList],
      list.create({ localId: uuid.generate() }, [
        item.create(
          { localId: uuid.generate() },
          $from.node($from.depth).content,
        ),
      ]),
    )(tr);

    // Adjust depth for new selection, if it has changed (e.g. paragraph to list (ol > li))
    const depthAdjustment = changeInDepth($to, newTr.selection.$to);

    tr = tr.setSelection(
      new TextSelection(tr.doc.resolve($to.pos + depthAdjustment)),
    );

    // replacing successful
    if (newTr !== tr) {
      return true;
    }
  }

  safeInsert(emptyList)(tr);
  return true;
};

export const splitListAtSelection = (
  tr: Transaction,
  schema: Schema,
  // state: EditorState,
): Transaction => {
  const { selection } = tr;
  const { $from, $to } = selection;
  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return tr;
  }

  const {
    decisionItem,
    decisionList,
    paragraph,
    taskItem,
    taskList,
  } = schema.nodes;

  const parentList = findParentNodeOfType([decisionList, taskList])(selection);

  if (!parentList) {
    return tr;
  }

  const item = findParentNodeOfType([decisionItem, taskItem])(selection);
  if (!item) {
    return tr;
  }

  const resolvedItemPos = tr.doc.resolve(item.pos);

  const newListIds = [
    parentList.node.attrs['localId'] || uuid.generate(), // first new list keeps list id
    uuid.generate(), // second list gets new id
  ];

  const beforeItems: PMNode[] = [];
  const afterItems: PMNode[] = [];
  parentList.node.content.forEach((item, offset, index) => {
    if (offset < resolvedItemPos.parentOffset) {
      beforeItems.push(item);
    } else if (offset > resolvedItemPos.parentOffset) {
      afterItems.push(item);
    }
  });

  const content: PMNode[] = [];

  if (beforeItems.length) {
    content.push(
      parentList.node.type.createChecked(
        {
          localId: newListIds.shift(),
        },
        beforeItems,
      ),
    );
  }

  content.push(paragraph.createChecked({}, item.node.content));

  if (afterItems.length) {
    content.push(
      parentList.node.type.createChecked(
        {
          localId: newListIds.shift(),
        },
        afterItems,
      ),
    );
  }

  // If no list remains at start, then the new selection is different relative to the original selection.
  const posAdjust = beforeItems.length === 0 ? -1 : 1;

  tr = tr.replaceWith(
    resolvedItemPos.start() - 1,
    resolvedItemPos.end() + 1,
    content,
  );
  tr = tr.setSelection(
    new TextSelection(tr.doc.resolve($from.pos + posAdjust)),
  );

  return tr;
};

import { uuid } from '@atlaskit/editor-common';
import { Schema } from 'prosemirror-model';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  safeInsert,
  hasParentNodeOfType,
  replaceParentNodeOfType,
} from 'prosemirror-utils';
import { GapCursorSelection } from '../gap-cursor';

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

export type TaskDecisionListType = 'taskList' | 'decisionList';

const isSelectionInAList = (
  listType: TaskDecisionListType,
  selection: Selection,
) => {
  const fromNode = selection.$from.node(selection.$from.depth - 2);
  const endNode = selection.$to.node(selection.$to.depth - 2);

  return (
    fromNode &&
    fromNode.type.name === listType &&
    endNode &&
    endNode.type.name !== listType
  );
};

export const changeToTaskDecision = (
  view: EditorView,
  listType: TaskDecisionListType,
): boolean => {
  const { state } = view;
  const { selection, schema } = state;
  const { list, item } = getListTypes(listType, schema);
  const { tr } = state;

  if (!isSelectionInAList(listType, selection)) {
    // Not a list - convert to one.
    const created = createListAtSelection(tr, list, item, schema, state);
    view.dispatch(tr);
    return created;
  }

  return false;
};

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
  if (
    hasParentNodeOfType([blockquote, paragraph, decisionList, taskList])(
      selection,
    )
  ) {
    const newTr = replaceParentNodeOfType(
      [blockquote, paragraph, decisionList, taskList],
      list.create({ localId: uuid.generate() }, [
        item.create(
          { localId: uuid.generate() },
          $from.node($from.depth).content,
        ),
      ]),
    )(tr);

    // replacing successful
    if (newTr !== tr) {
      return true;
    }
  }

  safeInsert(emptyList)(tr);
  return true;
};

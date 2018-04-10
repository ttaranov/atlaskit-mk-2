import { uuid } from '@atlaskit/editor-common';
import { Schema, Slice } from 'prosemirror-model';
import {
  EditorState,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { toJSON } from '../../utils';
import { taskDecisionSliceFilter } from '../../utils/filter';

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
  const { selection: { $from, $to } } = state;

  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return false;
  }

  const { decisionList, taskList, mediaGroup } = schema.nodes;
  const isAlreadyDecisionTask =
    $from.parent.type === decisionList || $from.parent.type === taskList;
  const isMediaNode = $from.parent.type === mediaGroup;

  if (isAlreadyDecisionTask || isMediaNode) {
    return false;
  }

  let where;
  let content = $from.node($from.depth).content;

  // Handle entire document selected case
  if ($from.depth === 0) {
    where = $from.before($from.depth + 1);
    const slice = Slice.fromJSON(schema, toJSON($from.node($from.depth)));
    content = taskDecisionSliceFilter(slice, schema).content;
  } else {
    where = $from.before($from.depth);
  }

  tr
    .delete(where, $from.end($from.depth))
    .replaceSelectionWith(
      list.create({ localId: uuid.generate() }, [
        item.create({ localId: uuid.generate() }, content),
      ]),
    );

  // Adjust selection into new item, if not there (e.g. in full page editor)
  const newSelection = tr.selection;
  if (newSelection.$from.parent.type !== item) {
    tr.setSelection(TextSelection.create(tr.doc, newSelection.$from.pos - 2));
  }

  return true;
};

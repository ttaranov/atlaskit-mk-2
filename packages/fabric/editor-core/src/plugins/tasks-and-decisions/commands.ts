import { uuid } from '@atlaskit/editor-common';
import { Schema } from 'prosemirror-model';
import { EditorState, Selection, TextSelection, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

const getListTypes = (listType: TaskDecisionListType, schema: Schema): { list, item } => {
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

const isSelectionInAList = (listType: TaskDecisionListType, selection: Selection) => {
  const fromNode = selection.$from.node(selection.$from.depth - 2);
  const endNode = selection.$to.node(selection.$to.depth - 2);

  return fromNode && fromNode.type.name === listType
      && endNode  && endNode.type.name !== listType;
};

export const changeToTaskDecision = (
  view: EditorView,
  listType: TaskDecisionListType
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

export const createListAtSelection = (tr: Transaction, list: any, item: any, schema: Schema, state: EditorState): boolean => {
  const { selection: { $from, $to } } = state;

  if ($from.parent !== $to.parent) {
    // ignore selections across multiple nodes
    return false;
  }

  const { decisionList, taskList } = schema.nodes;
  const isAlreadyDecisionTask = $from.parent.type === decisionList || $from.parent.type === taskList;

  if (isAlreadyDecisionTask) {
    return false;
  }

  const where = $from.before($from.depth);
  const content = $from.node($from.depth).content;

  tr
    .delete(where, $from.end($from.depth))
    .replaceSelectionWith(list.create({ localId: uuid.generate() }, [item.create({}, content)]))
  ;

  // Adjust selection into new item, if not there (e.g. in full page editor)
  const newSelection = tr.selection;
  if (newSelection.$from.parent.type !== item) {
    tr.setSelection(TextSelection.create(tr.doc, newSelection.$from.pos - 2));
  }

  return true;
};

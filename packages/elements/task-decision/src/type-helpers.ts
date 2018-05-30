import {
  Decision,
  Item,
  ObjectKey,
  RendererContext,
  ServiceDecision,
  ServiceItem,
  ServiceTask,
  SortCriteria,
  Task,
  TaskState,
  BaseItem,
  DecisionState,
} from './types';

import { Props as DecisionItemProps } from './components/ResourcedDecisionItem';
import { Props as TaskItemProps } from './components/ResourcedTaskItem';

export const isDecision = (item: Item): item is Decision =>
  !!(item && item.type === 'DECISION');
export const isTask = (item: Item): item is Task =>
  !!(item && item.type === 'TASK');

export const isServiceDecision = (item: ServiceItem): item is ServiceDecision =>
  !!(item && item.type === 'DECISION');
export const isServiceTask = (item: ServiceItem): item is ServiceTask =>
  !!(item && item.type === 'TASK');

export const isDateSortCriteria = (sortCriteria?: SortCriteria) =>
  !sortCriteria ||
  sortCriteria === 'creationDate' ||
  sortCriteria === 'lastUpdateDate';

export const toObjectKey = (
  item: Item | ServiceDecision | ServiceTask | BaseItem<any>,
): ObjectKey => {
  const { containerAri, localId, objectAri } = item;
  return {
    containerAri,
    localId,
    objectAri,
  };
};

export const toRendererContext = (item: Item | ObjectKey): RendererContext => {
  const { containerAri, objectAri } = item;
  return {
    containerAri,
    objectAri,
  };
};

export const objectKeyToString = (objectKey: ObjectKey) => {
  const { containerAri, objectAri, localId } = objectKey;
  return `${containerAri}:${objectAri}:${localId}`;
};

export const toggleTaskState = (state: TaskState): TaskState =>
  state === 'DONE' ? 'TODO' : 'DONE';

export const baseItemFromTaskProps = (
  props: TaskItemProps,
): BaseItem<TaskState> => {
  return {
    localId: props.taskId,
    containerAri: props.containerAri || '',
    objectAri: props.objectAri || '',
    state: props.isDone ? 'DONE' : 'TODO',
    reminderDate: props.reminderDate,
    type: 'TASK',
    lastUpdateDate: new Date(),
  };
};

export const baseItemFromDecisionProps = (
  props: DecisionItemProps,
): BaseItem<DecisionState> => {
  return {
    localId: props.localId,
    containerAri: props.containerAri || '',
    objectAri: props.objectAri || '',
    state: 'DECIDED',
    reminderDate: props.reminderDate,
    type: 'DECISION',
    lastUpdateDate: new Date(),
  };
};

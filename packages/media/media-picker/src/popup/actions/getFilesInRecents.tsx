import { Action } from 'redux';
import { CollectionItem } from '../domain';

export const GET_FILES_IN_RECENTS = 'GET_FILES_IN_RECENTS';

export interface GetFilesInRecentsAction extends Action {
  type: 'GET_FILES_IN_RECENTS';
  inclusiveStartKey?: string;
}

export const isGetFilesInRecentsAction = (
  action: Action,
): action is GetFilesInRecentsAction => {
  return action.type === GET_FILES_IN_RECENTS;
};

export const getFilesInRecents = (
  inclusiveStartKey?: string,
): GetFilesInRecentsAction => {
  return {
    inclusiveStartKey,
    type: GET_FILES_IN_RECENTS,
  };
};

export const GET_FILES_IN_RECENTS_FULLFILLED =
  'GET_FILES_IN_RECENTS_FULLFILLED';

export interface GetFilesInRecentsFullfilledAction {
  readonly type: 'GET_FILES_IN_RECENTS_FULLFILLED';
  readonly items: CollectionItem[];
  readonly nextKey: string;
}

export const isGetFilesInRecentsFullfilledAction = (
  action: Action,
): action is GetFilesInRecentsFullfilledAction => {
  return action.type === GET_FILES_IN_RECENTS_FULLFILLED;
};

export function getFilesInRecentsFullfilled(
  items: CollectionItem[],
  nextKey: string,
): GetFilesInRecentsFullfilledAction {
  return {
    type: GET_FILES_IN_RECENTS_FULLFILLED,
    items,
    nextKey,
  };
}

export const GET_FILES_IN_RECENTS_FAILED = 'GET_FILES_IN_RECENTS_FAILED';

export interface GetFilesInRecentsFailedAction {
  readonly type: 'GET_FILES_IN_RECENTS_FAILED';
}

export const isGetFilesInRecentsFailedAction = (
  action: Action,
): action is GetFilesInRecentsFailedAction => {
  return action.type === GET_FILES_IN_RECENTS_FAILED;
};

export function getFilesInRecentsFailed(): GetFilesInRecentsFailedAction {
  return {
    type: GET_FILES_IN_RECENTS_FAILED,
  };
}

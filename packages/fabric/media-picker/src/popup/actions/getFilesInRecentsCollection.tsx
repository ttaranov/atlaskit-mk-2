import { Action } from 'redux';

export const GET_FILES_IN_RECENTS_COLLECTION =
  'GET_FILES_IN_RECENTS_COLLECTION';

export interface GetFilesInRecentsCollectionAction extends Action {
  type: 'GET_FILES_IN_RECENTS_COLLECTION';
}

export const getFilesInRecentsCollection = (): GetFilesInRecentsCollectionAction => {
  return {
    type: GET_FILES_IN_RECENTS_COLLECTION,
  };
};

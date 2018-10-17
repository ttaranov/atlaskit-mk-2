import { stateKey } from './main';
import { ImageUploadPluginAction } from '../types';
import { Transaction } from 'prosemirror-state';

const imageUploadAction = (
  tr,
  action: ImageUploadPluginAction,
): Transaction => {
  return tr.setMeta(stateKey, action);
};

export const startUpload = event => (tr: Transaction) =>
  imageUploadAction(tr, {
    name: 'START_UPLOAD',
    event,
  });

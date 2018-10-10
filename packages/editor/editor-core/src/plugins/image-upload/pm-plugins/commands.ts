import { safeInsert } from 'prosemirror-utils';
import { createExternalMediaNode } from '../utils';
import { Command } from '../../../types';
import { InsertedImageProperties, ImageUploadPluginState } from '../types';
import { stateKey } from './main';
import { startUpload } from './actions';

export const insertExternalImage: (
  options: InsertedImageProperties,
) => Command = options => (state, dispatch) => {
  const pluginState: ImageUploadPluginState = stateKey.getState(state);
  if (!pluginState.enabled || !options.src) {
    return false;
  }

  const mediaNode = createExternalMediaNode(options.src, state.schema);
  if (!mediaNode) {
    return false;
  }

  dispatch(
    safeInsert(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView(),
  );
  return true;
};

export const startImageUpload: (event?: Event) => Command = event => (
  state,
  dispatch,
) => {
  const pluginState: ImageUploadPluginState = stateKey.getState(state);
  if (!pluginState.enabled) {
    return false;
  }

  dispatch(startUpload(event)(state.tr));
  return true;
};

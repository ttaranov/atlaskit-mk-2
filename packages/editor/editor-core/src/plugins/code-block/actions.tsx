import { setParentNodeMarkup, removeParentNodeOfType } from 'prosemirror-utils';
import { Command } from '../../types';

export type DomAtPos = (pos: number) => { node: HTMLElement; offset: number };
export const removeCodeBlock: Command = (state, dispatch) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  dispatch(removeParentNodeOfType(nodes.codeBlock)(tr));
  return true;
};

export const changeLanguage = (language: string): Command => (
  state,
  dispatch,
) => {
  const {
    schema: { nodes },
    tr,
  } = state;
  dispatch(setParentNodeMarkup(nodes.codeBlock, null, { language })(tr));
  return true;
};

import { Action } from 'redux';

import { isFileClickAction } from '../actions/fileClick';
import { State } from '../domain';

export default function fileClick(state: State, action: Action): State {
  if (isFileClickAction(action)) {
    const { file } = action;
    const { selectedItems } = state;
    const itemFound = selectedItems.some(item => item.id === file.id);

    if (itemFound) {
      return {
        ...state,
        selectedItems: selectedItems.filter(item => item.id !== file.id),
      };
    } else {
      return {
        ...state,
        selectedItems: [...selectedItems, file],
      };
    }
  } else {
    return state;
  }
}

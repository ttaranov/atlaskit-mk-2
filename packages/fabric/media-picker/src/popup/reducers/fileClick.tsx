import { State } from '../domain';

export default function fileClick(state: State, action: any): State {
  if (action.type === 'FILE_CLICK') {
    let newSelectedItems = state.selectedItems || [];

    let itemFound = false;

    for (let i = 0; i < newSelectedItems.length; i++) {
      if (action.file.id === newSelectedItems[i].id) {
        itemFound = true;
        break;
      }
    }

    if (itemFound) {
      newSelectedItems = newSelectedItems.filter((item: any) => {
        return item.id !== action.file.id;
      });
    } else {
      newSelectedItems = [...newSelectedItems, action.file];
    }

    return Object.assign(state, { selectedItems: newSelectedItems });
  } else {
    return state;
  }
}

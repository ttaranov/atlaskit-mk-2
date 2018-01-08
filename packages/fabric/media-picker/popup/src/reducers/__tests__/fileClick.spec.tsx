// import { fileClick as createFileClickAction } from '../actions';
import fileClick from '../fileClick';

describe('fileClick()', () => {
  const stateBase = {
    a: 12,
    b: 'abc',
  };

  const state = {
    ...stateBase,
    selectedItems: [
      { id: 'selected-item-1' },
      { id: 'selected-item-2' },
      { id: 'selected-item-3' },
    ],
  };

  it('should return original state for unknown action', () => {
    const oldState: any = { ...state };
    const newState = fileClick(oldState, { type: 'UNKNOWN' });

    expect(oldState).toEqual(state);
    expect(newState).toEqual(state);
  });

  it('should add file to list of selected items if it does NOT already exist in the array', () => {
    const oldState: any = { ...state };

    const clickedFile: any = { id: 'clicked-file' };
    const fileClickAction: any = { type: 'FILE_CLICK', file: clickedFile };

    const newState = fileClick(oldState, fileClickAction);
    expect(oldState).toEqual(state);
    expect(newState.selectedItems).toEqual([
      ...oldState.selectedItems,
      clickedFile,
    ]);
  });

  it('should remove file from list of selected items if it DOES already exist in the array', () => {
    const oldState: any = { ...state };

    const clickedFile: any = { id: 'selected-item-2' };
    const fileClickAction: any = { type: 'FILE_CLICK', file: clickedFile };

    const newState = fileClick(oldState, fileClickAction);
    expect(oldState).toEqual(state);
    expect(newState.selectedItems).toEqual([
      { id: 'selected-item-1' },
      { id: 'selected-item-3' },
    ]);
  });
});

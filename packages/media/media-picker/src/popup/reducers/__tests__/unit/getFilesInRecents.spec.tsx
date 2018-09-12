import {
  getRecentFilesFullfilled,
  getRecentFilesFailed,
} from '../../getFilesInRecents';
import { State } from '../../../domain';

describe('getFilesInRecents', () => {
  it('should contain recent items when request fullfilled', () => {
    const state = {} as State;
    const action = {
      type: 'GET_FILES_IN_RECENTS_FULLFILLED',
      items: [1, 2],
    };
    const { recents, view } = getRecentFilesFullfilled(state, action);

    expect(recents).toEqual({
      items: [1, 2],
    });
    expect(view).toEqual(
      expect.objectContaining({
        isLoading: false,
      }),
    );
  });

  it('should mark state as error when request failed', () => {
    const state = {} as State;
    const action = {
      type: 'GET_FILES_IN_RECENTS_FAILED',
    };
    const { recents, view } = getRecentFilesFailed(state, action);

    expect(recents).toEqual(undefined);
    expect(view).toEqual(
      expect.objectContaining({
        isLoading: false,
        hasError: true,
      }),
    );
  });
});

import {
  getRecentFilesStarted,
  getRecentFilesFullfilled,
  getRecentFilesFailed,
} from '../../getFilesInRecents';
import { State } from '../../../domain';

describe('getFilesInRecents', () => {
  it('should reset recents files when start the fetching', () => {
    const state = {} as State;
    const action = { type: 'GET_FILES_IN_RECENTS' };
    const { recents, view } = getRecentFilesStarted(state, action);

    expect(recents).toEqual({
      items: [],
      nextKey: '',
    });
    expect(view).toEqual(
      expect.objectContaining({
        isLoading: true,
        hasError: false,
      }),
    );
  });

  it('should contain recent items when request fullfilled', () => {
    const state = {} as State;
    const action = {
      type: 'GET_FILES_IN_RECENTS_FULLFILLED',
      items: [1, 2],
      nextKey: 'abc',
    };
    const { recents, view } = getRecentFilesFullfilled(state, action);

    expect(recents).toEqual({
      items: [1, 2],
      nextKey: 'abc',
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

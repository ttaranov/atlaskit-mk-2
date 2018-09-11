import { mockStore, mockFetcher } from '../../../mocks';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
} from '../../../actions';

import { getFilesInRecents, requestRecentFiles } from '../../getFilesInRecents';

describe('getFilesInRecents middleware', () => {
  describe('getFilesInRecents()', () => {
    it('should ignore actions which are NOT type GET_FILES_IN_RECENTS', () => {
      const fetcher = mockFetcher();
      const store = mockStore();
      const next = jest.fn();

      const unknownAction = { type: 'UNKNOWN' };
      getFilesInRecents()(store)(next)(unknownAction);

      expect(fetcher.getRecentFiles).toHaveBeenCalledTimes(0);
      expect(store.dispatch).toHaveBeenCalledTimes(0);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(unknownAction);
    });
  });

  describe('requestRecentFiles()', () => {
    it('should dispatch GET_FILES_IN_RECENTS_FAILED when userAuthProvider() rejects', async () => {
      const fetcher = mockFetcher();
      const store = mockStore();

      await requestRecentFiles(store);
      expect(fetcher.getRecentFiles).toHaveBeenCalledTimes(0);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(getFilesInRecentsFailed());
    });

    it('should dispatch GET_FILES_IN_RECENTS_FAILED when fetcher#getRecentFiles() rejects', async () => {
      const fetcher = mockFetcher();
      const store = mockStore();

      fetcher.getRecentFiles.mockReturnValue(Promise.reject('some-error'));

      await requestRecentFiles(store);
      expect(fetcher.getRecentFiles).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(getFilesInRecentsFailed());
    });

    it('should dispatch GET_FILES_IN_RECENTS_SUCCESS when requests succeed', async () => {
      const fetcher = mockFetcher();
      const store = mockStore();

      const fetcherResult = {
        contents: [],
        nextInclusiveStartKey: 'some-start-key',
      };
      fetcher.getRecentFiles.mockReturnValue(Promise.resolve(fetcherResult));

      await requestRecentFiles(store);
      expect(fetcher.getRecentFiles).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        getFilesInRecentsFullfilled([]),
      );
    });
  });
});

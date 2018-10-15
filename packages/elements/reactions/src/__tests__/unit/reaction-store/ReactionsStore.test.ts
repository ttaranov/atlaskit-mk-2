import { ReactionClient } from '../../../client';
import {
  ari,
  containerAri,
  reaction,
  user,
} from '../../../client/MockReactionsClient';
import { MemoryReactionsStore } from '../../../reaction-store/ReactionsStore';
import { ReactionStatus } from '../../../types/ReactionStatus';

describe('ReactionContext', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  const fakeClient: ReactionClient = {
    getReactions: jest.fn(),
    getDetailedReaction: jest.fn(),
    addReaction: jest.fn(),
    deleteReaction: jest.fn(),
  };

  const getReactionsResponse = Promise.resolve({
    [ari]: [
      reaction(':fire:', 2, true),
      reaction(':thumbsup:', 3, false),
      reaction(':thumbsdown:', 1, true),
    ],
  });

  let store: MemoryReactionsStore;

  beforeEach(() => {
    store = new MemoryReactionsStore(fakeClient);
  });

  afterEach(() => {
    (fakeClient.getReactions as jest.Mock<any>).mockClear();
    (fakeClient.getDetailedReaction as jest.Mock<any>).mockClear();
    (fakeClient.addReaction as jest.Mock<any>).mockClear();
    (fakeClient.deleteReaction as jest.Mock<any>).mockClear();
  });

  describe('with empty state', () => {
    beforeEach(() => {
      store = new MemoryReactionsStore(fakeClient);
    });

    it('should set initial state', () => {
      expect(store.getState()).toMatchObject({
        reactions: {},
        flash: {},
      });
    });

    it('should call client to get reactions', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      expect(fakeClient.getReactions).toHaveBeenCalledTimes(1);

      return getReactionsResponse.then(() => {
        expect(store.getState()).toMatchObject({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                reaction(':thumbsup:', 3, false),
                reaction(':fire:', 2, true),
                reaction(':thumbsdown:', 1, true),
              ],
            },
          },
          flash: {},
        });
      });
    });

    it('should notify notify onUpdate', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      const callback = jest.fn();
      store.onChange(callback);

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      return getReactionsResponse.then(() => {
        // we need to run all timers because onUpdate notification is batched
        jest.runAllTimers();
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                reaction(':thumbsup:', 3, false),
                reaction(':fire:', 2, true),
                reaction(':thumbsdown:', 1, true),
              ],
            },
          },
          flash: {},
        });
      });
    });

    it('should not notify after removing the callback', () => {
      (fakeClient.getReactions as jest.Mock<any>).mockReturnValueOnce(
        getReactionsResponse,
      );

      const callback = jest.fn();
      store.onChange(callback);

      store.removeOnChangeListener(callback);

      store.getReactions(containerAri, ari);

      jest.runAllTimers();

      return getReactionsResponse.then(() => {
        // we need to run all timers because onUpdate notification is batched
        jest.runAllTimers();
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('with state set', () => {
    beforeEach(() => {
      store = new MemoryReactionsStore(fakeClient, {
        reactions: {
          [`${containerAri}|${ari}`]: {
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':thumbsdown:', 3, true),
            ],
            status: ReactionStatus.ready,
          },
        },
        flash: {},
      });
    });

    it('should call adaptor to get detailed reaction', () => {
      const response = Promise.resolve({
        ...reaction(':thumbsup:', 1, true),
        users: [user('id', 'Some real user')],
      });

      (fakeClient.getDetailedReaction as jest.Mock<any>).mockReturnValueOnce(
        response,
      );

      store.getDetailedReaction(containerAri, ari, '1f44d');

      expect(fakeClient.getDetailedReaction).toHaveBeenCalledTimes(1);

      return response.then(() => {
        expect(store.getState()).toMatchObject({
          reactions: {
            [`${containerAri}|${ari}`]: {
              status: ReactionStatus.ready,
              reactions: [
                {
                  ...reaction(':thumbsup:', 3, false),
                  users: [user('id', 'Some real user')],
                },
                reaction(':thumbsdown:', 3, true),
              ],
            },
          },
        });
      });
    });

    it('should call adaptor to add reaction', () => {
      const response = Promise.resolve(reaction(':thumbsup:', 4, true));

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.addReaction(containerAri, ari, '1f44d');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              {
                ...reaction(':thumbsup:', 4, true),
                optimisticallyUpdated: true,
              },
              reaction(':thumbsdown:', 3, true),
            ],
          },
        },
      });
    });

    it('should call adaptor to add reaction using toggle action', () => {
      const response = Promise.resolve(reaction(':thumbsup:', 4, true));

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.toggleReaction(containerAri, ari, '1f44d');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              {
                ...reaction(':thumbsup:', 4, true),
                optimisticallyUpdated: true,
              },
              reaction(':thumbsdown:', 3, true),
            ],
          },
        },
      });
    });

    it('should flash reaction when the user tries to add it again', () => {
      store.addReaction(containerAri, ari, '1f44e');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':thumbsdown:', 3, true),
            ],
          },
        },
        flash: {
          [`${containerAri}|${ari}`]: { '1f44e': true },
        },
      });

      expect(fakeClient.addReaction).not.toHaveBeenCalled();
    });

    it('should call adaptor to remove reaction', () => {
      const response = Promise.resolve({
        ...reaction(':thumbsdown:', 2, false),
      });

      (fakeClient.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      store.toggleReaction(containerAri, ari, '1f44e');

      expect(store.getState()).toMatchObject({
        reactions: {
          [`${containerAri}|${ari}`]: {
            status: ReactionStatus.ready,
            reactions: [
              reaction(':thumbsup:', 3, false),
              {
                ...reaction(':thumbsdown:', 2, false),
                optimisticallyUpdated: true,
              },
            ],
          },
        },
      });
    });
  });
});

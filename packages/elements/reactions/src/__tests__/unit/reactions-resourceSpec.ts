import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import { ReactionsResource } from '../..';
import { ReactionsState, ReactionStatus } from '../../reactions-resource';
import { equalEmojiId } from '../../internal/helpers';
import {
  grinId,
  grinningId,
  laughingId,
  smileyId,
  thumbsupId,
} from './_test-data';

const baseUrl = 'https://reactions';
const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

const detailedReaction = {
  ari: ari,
  containerAri: containerAri,
  emojiId: grinningId.id!,
  count: 1,
  reacted: true,
  users: [
    {
      id: 'oscar',
      displayName: 'Oscar Wallhult',
    },
  ],
};

const smileyDetailedReaction = {
  ari: ari,
  containerAri: containerAri,
  emojiId: smileyId.id!,
  count: 0,
  reacted: true,
  users: [],
};

const laughingDetailedReaction = {
  ari: ari,
  containerAri: containerAri,
  emojiId: laughingId.id!,
  count: 2,
  reacted: true,
  users: [
    {
      id: 'oscar',
      displayName: 'Oscar Wallhult',
    },
    {
      id: 'julien',
      displayName: 'Julien H.',
    },
  ],
};

const reaction = {
  ari: ari,
  containerAri: containerAri,
  emojiId: grinningId.id!,
  count: 1,
  reacted: true,
};

const smilingReaction = {
  ari: ari,
  containerAri: containerAri,
  emojiId: smileyId.id!,
  count: 1,
  reacted: true,
};

const fetchDetailedReaction = () => {
  return detailedReaction;
};

const fetchGetReactions = () => {
  return {
    [ari]: [
      {
        ari: ari,
        containerAri: containerAri,
        emojiId: grinningId.id!,
        count: 1,
        reacted: true,
      },
      {
        ari: ari,
        containerAri: containerAri,
        emojiId: laughingId.id!,
        count: 2,
        reacted: true,
      },
      {
        ari: ari,
        containerAri: containerAri,
        emojiId: thumbsupId.id!,
        count: 5,
        reacted: false,
      },
      {
        ari: ari,
        containerAri: containerAri,
        emojiId: grinId.id!,
        count: 100,
        reacted: false,
      },
    ],
  };
};

const fetchAddReaction = () => {
  return {
    ari: ari,
    containerAri: containerAri,
    reactions: [
      ...fetchGetReactions()[ari],
      {
        ari: ari,
        containerAri: containerAri,
        emojiId: smileyId.id,
        count: 1,
        reacted: true,
      },
    ],
  };
};

const fetchDeleteReaction = () => {
  return {
    ari: ari,
    containerAri: containerAri,
    reactions: fetchGetReactions()[ari].filter(
      r => !equalEmojiId(r.emojiId, grinningId.id!),
    ),
  };
};

const populateCache = (reactionsProvider: ReactionsResource) => {
  const cachedReactions = {};
  const response = fetchGetReactions();
  Object.keys(response).forEach(ari => {
    const key = `${response[ari][0].containerAri}|${response[ari][0].ari}`;
    cachedReactions[key] = {
      status: ReactionStatus.ready,
      reactions: response[ari],
    };
  });
  (reactionsProvider as any).cachedReactions = cachedReactions;
};

describe('@atlaskit/reactions/reactions-provider', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe('test data defined', () => {
    expect(grinningId).not.toEqual(undefined);
    expect(laughingId).not.toEqual(undefined);
    expect(thumbsupId).not.toEqual(undefined);
    expect(grinId).not.toEqual(undefined);
    expect(smileyId).not.toEqual(undefined);
  });

  describe('getReactions', () => {
    beforeEach(() => {
      fetchMock.mock({
        method: 'POST',
        matcher: 'end:reactions/view',
        response: {
          body: fetchGetReactions(),
        },
        name: 'reactionsView',
      });
    });

    const reactionsProvider = new ReactionsResource({ baseUrl });
    it('should return reaction data', () => {
      return reactionsProvider
        .getReactions([{ ari, containerAri }])
        .then(reactions => {
          expect(reactions).toEqual(fetchGetReactions());
        });
    });

    it('should set cached reactions', () => {
      return reactionsProvider
        .getReactions([{ ari, containerAri }])
        .then(reactions => {
          expect(
            Object.keys((reactionsProvider as any).cachedReactions).length,
          ).toEqual(1);
        });
    });

    it('should not overwrite cache for excluded aris', () => {
      populateCache(reactionsProvider);
      const anotherAri = 'another:ari:123';
      const anotherAriData: ReactionsState = {
        status: ReactionStatus.ready,
        reactions: [
          {
            ari: anotherAri,
            containerAri: containerAri,
            emojiId: 'grinning',
            count: 1,
            reacted: false,
          },
        ],
      };

      const anotherCacheKey = reactionsProvider.objectReactionKey(
        containerAri,
        anotherAri,
      );
      (reactionsProvider as any).cachedReactions[
        anotherCacheKey
      ] = anotherAriData;

      return reactionsProvider
        .getReactions([{ ari, containerAri }])
        .then(reactions => {
          expect((reactionsProvider as any).cachedReactions).not.toEqual(
            reactions,
          );
          expect(
            (reactionsProvider as any).cachedReactions[
              reactionsProvider.objectReactionKey(containerAri, ari)
            ].reactions,
          ).toEqual(reactions[ari]);
          expect(
            (reactionsProvider as any).cachedReactions[anotherCacheKey],
          ).toEqual(anotherAriData);
        });
    });

    it('should not fail with empty args', () => {
      return reactionsProvider.getReactions([]).then(reactions => {
        expect(reactions).toEqual({});
      });
    });
  });

  describe('addReaction', () => {
    const reactionsProvider = new ReactionsResource({ baseUrl });
    populateCache(reactionsProvider);

    it('should call service with container/objectAri and objectCreationTimestamp', () => {
      fetchMock.mock({
        name: 'add',
        options: {
          method: 'POST',
        },
        matcher: 'end:reactions',
        response: fetchAddReaction(),
      });
      const objectCreationTimestamp = Date.now();
      const emojiId = smileyId.id!;

      return reactionsProvider
        .addReaction(containerAri, ari, emojiId, objectCreationTimestamp)
        .then(state => {
          const lastCall = fetchMock.lastCall('add');
          expect(lastCall).not.toEqual(undefined);

          return lastCall[0].json().then(body => {
            expect(body.containerAri).toEqual(containerAri);
            expect(body.ari).toEqual(ari);
            expect(body.emojiId).toEqual(emojiId);
            expect(body.objectCreationTimestamp).toEqual(
              objectCreationTimestamp,
            );
          });
        });
    });

    it('should optimistically add reaction', () => {
      fetchMock.mock({
        options: {
          method: 'POST',
        },
        matcher: 'end:reactions',
        response: fetchAddReaction(),
      });
      const spy = jest.spyOn(reactionsProvider, 'notifyUpdated');

      return reactionsProvider
        .addReaction(containerAri, ari, smileyId.id!)
        .then(state => {
          expect(spy).toHaveBeenCalled();
          expect(
            (reactionsProvider as any).cachedReactions[
              reactionsProvider.objectReactionKey(containerAri, ari)
            ],
          ).toEqual(state);
          expect(state.status).toEqual(ReactionStatus.ready);
          if (state.status === ReactionStatus.ready) {
            expect(state.reactions.length).toEqual(
              fetchGetReactions()[ari].length + 1,
            );
          }
        });
    });
  });

  describe('deleteReaction', () => {
    const reactionsProvider = new ReactionsResource({ baseUrl });
    populateCache(reactionsProvider);

    it('should optimistically delete reaction', () => {
      fetchMock.mock({
        options: {
          method: 'DELETE',
        },
        matcher: `begin:${baseUrl}/reactions?ari=${ari}`,
        response: fetchDeleteReaction(),
      });
      const spy = jest.spyOn(reactionsProvider, 'notifyUpdated');

      return reactionsProvider
        .deleteReaction(containerAri, ari, grinningId.id!)
        .then(state => {
          expect(spy).toHaveBeenCalled();
          expect(
            (reactionsProvider as any).cachedReactions[
              reactionsProvider.objectReactionKey(containerAri, ari)
            ],
          ).toEqual(state);
          expect(state.status).toEqual(ReactionStatus.ready);
          if (state.status === ReactionStatus.ready) {
            expect(state.reactions.length).toEqual(
              fetchGetReactions()[ari].length - 1,
            );
          }
        });
    });
  });

  describe('toggleReaction', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should optimistically add reaction if not in cache or if user have not reacted and call service', () => {
      const reactionsProvider = new ReactionsResource({ baseUrl });
      populateCache(reactionsProvider);

      // cast to <any> because Jest doesn't see the protected optmisticAddReaction method
      const optimisticSpy = jest.spyOn(
        <any>reactionsProvider,
        'optimisticAddReaction',
      );
      const addSpy = jest.spyOn(reactionsProvider, 'addReaction');

      reactionsProvider.toggleReaction(containerAri, ari, smileyId.id!);
      expect(optimisticSpy).toHaveBeenCalled();
      expect(addSpy).toHaveBeenCalled();
    });

    it('should optimistically delete reaction if in cache and call service', () => {
      const reactionsProvider = new ReactionsResource({ baseUrl });
      populateCache(reactionsProvider);

      // cast to <any> because Jest doesn't see the protected optmisticDeleteReaction method
      const optimisticSpy = jest.spyOn(
        <any>reactionsProvider,
        'optimisticDeleteReaction',
      );
      const deleteSpy = jest.spyOn(reactionsProvider, 'deleteReaction');

      reactionsProvider.toggleReaction(containerAri, ari, grinningId.id!);
      expect(optimisticSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();
    });

    it('should optimistically increase counter on reaction if user have not already reacted', () => {
      const reactionsProvider = new ReactionsResource({ baseUrl });
      populateCache(reactionsProvider);

      const addSpy = jest.spyOn(reactionsProvider, 'addReaction');
      reactionsProvider.toggleReaction(containerAri, ari, thumbsupId.id!);
      expect(addSpy).toHaveBeenCalled();

      const reaction = (reactionsProvider as any).cachedReactions[
        reactionsProvider.objectReactionKey(containerAri, ari)
      ].reactions.filter(r => equalEmojiId(r.emojiId, thumbsupId.id!))[0];
      expect(reaction.count).toEqual(6);
      expect(reaction.reacted).toEqual(true);
    });

    it('should not override multiple optimistic add', done => {
      const reactionsProvider = new ReactionsResource({ baseUrl });

      let callCount = 0;
      fetchMock.mock({
        options: {
          method: 'POST',
        },
        matcher: 'end:reactions',
        response: () => {
          if (callCount++ === 0) {
            return new Promise(resolve => {
              setTimeout(
                () =>
                  resolve({
                    ari: ari,
                    containerAri: containerAri,
                    reactions: [
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: grinningId.id!,
                        count: 1,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: laughingId.id!,
                        count: 2,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: thumbsupId.id!,
                        count: 6,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: grinId.id!,
                        count: 100,
                        reacted: false,
                      },
                    ],
                  }),
                100,
              );
            });
          } else {
            return new Promise(resolve => {
              setTimeout(
                () =>
                  resolve({
                    ari: ari,
                    containerAri: containerAri,
                    reactions: [
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: grinningId.id!,
                        count: 1,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: laughingId.id!,
                        count: 2,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: thumbsupId.id!,
                        count: 6,
                        reacted: true,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: grinId.id!,
                        count: 100,
                        reacted: false,
                      },
                      {
                        ari: ari,
                        containerAri: containerAri,
                        emojiId: smileyId.id,
                        count: 1,
                        reacted: true,
                      },
                    ],
                  }),
                200,
              );
            });
          }
        },
      });

      populateCache(reactionsProvider);

      const handler = jest.fn();
      reactionsProvider.subscribe(
        {
          containerAri: containerAri,
          ari: ari,
        },
        handler,
      );

      function getReactionsForEmojiAtNthCall(emojiId, call) {
        return handler.mock.calls[call][0].reactions.find(
          value => value.emojiId === emojiId.id,
        );
      }

      const toggleGrinning = reactionsProvider.toggleReaction(
        containerAri,
        ari,
        thumbsupId.id!,
      );

      expect(handler).toHaveBeenCalledTimes(2);
      expect(getReactionsForEmojiAtNthCall(thumbsupId, 1).count).toEqual(6);

      const toggleSmiley = reactionsProvider.toggleReaction(
        containerAri,
        ari,
        smileyId.id!,
      );

      expect(handler).toHaveBeenCalledTimes(3);
      expect(getReactionsForEmojiAtNthCall(thumbsupId, 2).count).toEqual(6);
      expect(getReactionsForEmojiAtNthCall(smileyId, 2).count).toEqual(1);

      toggleGrinning.then(() => {
        expect(handler).toHaveBeenCalledTimes(3);

        toggleSmiley
          .then(() => {
            expect(getReactionsForEmojiAtNthCall(thumbsupId, 3).count).toEqual(
              6,
            );
            expect(getReactionsForEmojiAtNthCall(smileyId, 3).count).toEqual(1);
          })
          .then(done, done);

        jest.runTimersToTime(150);
      });
      jest.runTimersToTime(150);
    });

    it('should optimistically decrease counter on reaction if user have already reacted', () => {
      const reactionsProvider = new ReactionsResource({ baseUrl });
      populateCache(reactionsProvider);

      const deleteSpy = jest.spyOn(reactionsProvider, 'deleteReaction');
      reactionsProvider.toggleReaction(containerAri, ari, laughingId.id!);
      expect(deleteSpy).toHaveBeenCalled();

      const reaction = (reactionsProvider as any).cachedReactions[
        reactionsProvider.objectReactionKey(containerAri, ari)
      ].reactions.filter(r => equalEmojiId(r.emojiId, laughingId.id!))[0];
      expect(reaction.count).toEqual(1);
      expect(reaction.reacted).toEqual(false);
    });

    it('should delete reaction if count is less than 1', () => {
      const reactionsProvider = new ReactionsResource({ baseUrl });
      populateCache(reactionsProvider);

      const deleteSpy = jest.spyOn(reactionsProvider, 'deleteReaction');
      reactionsProvider.toggleReaction(containerAri, ari, grinningId.id!);
      expect(deleteSpy).toHaveBeenCalled();

      const objectReactionKey = reactionsProvider.objectReactionKey(
        containerAri,
        ari,
      );
      expect(
        (reactionsProvider as any).cachedReactions[
          objectReactionKey
        ].reactions.filter(r => equalEmojiId(r.emojiId, grinningId.id!)).length,
      ).toEqual(0);
      expect(
        (reactionsProvider as any).cachedReactions[objectReactionKey].reactions
          .length,
      ).toEqual(fetchGetReactions()[ari].length - 1);
    });
  });

  describe('getDetailedReaction', () => {
    const reactionId = `${containerAri}|${ari}|${grinningId!.id}`;
    const reactionsProvider = new ReactionsResource({ baseUrl });

    beforeEach(() => {
      fetchMock.mock({
        options: {
          method: 'GET',
        },
        matcher: `end:reactions?reactionId=${encodeURIComponent(reactionId)}`,
        response: fetchDetailedReaction(),
      });
    });

    it('should fetch details for reaction', () => {
      return reactionsProvider.getDetailedReaction(reaction).then(detail => {
        expect(detail).toEqual(detailedReaction);
      });
    });
  });

  describe('fetchReactionDetails', () => {
    const reactionId = `${containerAri}|${ari}|${grinningId!.id}`;
    const reactionsProvider = new ReactionsResource({ baseUrl });

    beforeEach(() => {
      fetchMock.mock({
        options: {
          method: 'GET',
        },
        matcher: `end:reactions?reactionId=${encodeURIComponent(reactionId)}`,
        response: fetchDetailedReaction(),
      });

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should fetch reaction details for reaction', () => {
      const spy = jest.spyOn(reactionsProvider, 'getDetailedReaction');
      reactionsProvider.fetchReactionDetails(reaction);
      expect(spy).toHaveBeenCalledWith(reaction);
      spy.mockRestore();
    });

    it('should call notifyUpdated if cached', () => {
      const key = `${reaction.containerAri}|${reaction.ari}`;
      const reactionsState = {
        status: ReactionStatus.ready,
        reactions: [reaction],
      };
      (reactionsProvider as any).cachedReactions = {
        [key]: reactionsState,
      };
      const spy = jest.spyOn(reactionsProvider, 'notifyUpdated');
      return reactionsProvider.fetchReactionDetails(reaction).then(() => {
        expect(spy).toHaveBeenCalledWith(
          reaction.containerAri,
          reaction.ari,
          expect.objectContaining({
            ...reactionsState,
            reactions: expect.arrayContaining([
              expect.objectContaining(reactionsState.reactions[0]),
            ]),
          }),
        );
        spy.mockRestore();
      });
    });

    it('should not query if request already in flight', () => {
      const firstCall = reactionsProvider.fetchReactionDetails(reaction);

      const spy = jest.spyOn(reactionsProvider, 'getDetailedReaction');
      const secondCall = reactionsProvider.fetchReactionDetails(reaction);
      expect(spy).not.toHaveBeenCalled();
      expect(secondCall).toEqual(firstCall);
      spy.mockRestore();
    });

    it('should not override optimistic add', done => {
      const smileyReactionId = `${containerAri}|${ari}|${smileyId!.id}`;

      fetchMock.mock({
        options: {
          method: 'GET',
        },
        matcher: `end:reactions?reactionId=${encodeURIComponent(
          smileyReactionId,
        )}`,
        response: new Promise(resolve => {
          setTimeout(() => resolve(smileyDetailedReaction), 100);
        }),
      });

      fetchMock.mock({
        options: {
          method: 'POST',
        },
        matcher: 'end:reactions',
        response: new Promise(resolve => {
          setTimeout(() => resolve(fetchAddReaction()), 200);
        }),
      });

      populateCache(reactionsProvider);

      const handler = jest.fn();
      reactionsProvider.subscribe(
        {
          containerAri: containerAri,
          ari: ari,
        },
        handler,
      );

      function getReactionsForEmojiAtNthCall(emojiId, call) {
        return handler.mock.calls[call][0].reactions.find(
          value => value.emojiId === emojiId.id,
        );
      }

      const fetchReactionDetails = reactionsProvider.fetchReactionDetails(
        smilingReaction,
      );

      const toggleSmiley = reactionsProvider.toggleReaction(
        containerAri,
        ari,
        smileyId.id!,
      );

      expect(getReactionsForEmojiAtNthCall(smileyId, 1).count).toEqual(1);

      fetchReactionDetails.then(() => {
        expect(handler.mock.calls.length).toEqual(2);

        jest.runTimersToTime(150);

        toggleSmiley.then(() => {
          expect(getReactionsForEmojiAtNthCall(smileyId, 2).count).toEqual(1);
          done();
        });
      });

      jest.runTimersToTime(150);
    });

    it('should not override optimistic delete (last reaction)', done => {
      fetchMock.mock({
        options: {
          method: 'GET',
        },
        matcher: `end:reactions?reactionId=${encodeURIComponent(reactionId)}`,
        response: new Promise(resolve => {
          setTimeout(() => resolve(fetchDetailedReaction()), 100);
        }),
      });

      fetchMock.mock({
        options: {
          method: 'DELETE',
        },
        matcher: `begin:${baseUrl}/reactions?ari=${ari}`,
        response: new Promise(resolve => {
          setTimeout(() => resolve(fetchDeleteReaction()), 100);
        }),
      });

      populateCache(reactionsProvider);

      const handler = jest.fn();
      reactionsProvider.subscribe(
        {
          containerAri: containerAri,
          ari: ari,
        },
        handler,
      );

      function getReactionsForEmojiAtNthCall(emojiId, call) {
        return handler.mock.calls[call][0].reactions.find(
          value => value.emojiId === emojiId.id,
        );
      }

      const fetchReactionDetails = reactionsProvider.fetchReactionDetails(
        reaction,
      );

      const toggleGrinning = reactionsProvider.toggleReaction(
        containerAri,
        ari,
        grinningId.id!,
      );

      expect(getReactionsForEmojiAtNthCall(grinningId, 1)).toBeUndefined();

      fetchReactionDetails.then(() => {
        expect(handler.mock.calls.length).toEqual(2);

        jest.runTimersToTime(150);

        toggleGrinning.then(() => {
          expect(getReactionsForEmojiAtNthCall(grinningId, 2)).toBeUndefined();
          done();
        });
      });

      jest.runTimersToTime(150);
    });

    it('should not override optimistic delete (decreased count)', done => {
      const laughingReactionId = `${containerAri}|${ari}|${laughingId!.id}`;
      fetchMock.mock({
        options: {
          method: 'GET',
        },
        matcher: `end:reactions?reactionId=${encodeURIComponent(
          laughingReactionId,
        )}`,
        response: new Promise(resolve => {
          setTimeout(() => resolve(laughingDetailedReaction), 100);
        }),
      });

      fetchMock.mock({
        options: {
          method: 'DELETE',
        },
        matcher: `begin:${baseUrl}/reactions?ari=${ari}`,
        response: new Promise(resolve => {
          setTimeout(
            () =>
              resolve({
                ari: ari,
                containerAri: containerAri,
                reactions: fetchGetReactions()[ari].map(value => {
                  if (value.emojiId === laughingId.id) {
                    return {
                      ...value,
                      reacted: false,
                      count: value.count - 1,
                    };
                  }

                  return value;
                }),
              }),
            100,
          );
        }),
      });

      populateCache(reactionsProvider);

      const handler = jest.fn();
      reactionsProvider.subscribe(
        {
          containerAri: containerAri,
          ari: ari,
        },
        handler,
      );

      function getReactionsForEmojiAtNthCall(emojiId, call) {
        return handler.mock.calls[call][0].reactions.find(
          value => value.emojiId === emojiId.id,
        );
      }

      const fetchReactionDetails = reactionsProvider.fetchReactionDetails(
        reaction,
      );

      const deleteLaughing = reactionsProvider.toggleReaction(
        containerAri,
        ari,
        laughingId.id!,
      );

      expect(getReactionsForEmojiAtNthCall(laughingId, 1).count).toEqual(1);

      fetchReactionDetails.then(() => {
        expect(handler.mock.calls.length).toEqual(3);
        expect(getReactionsForEmojiAtNthCall(laughingId, 2).count).toEqual(1);

        jest.runTimersToTime(150);

        deleteLaughing.then(() => {
          expect(getReactionsForEmojiAtNthCall(laughingId, 3).count).toEqual(1);
          done();
        });
      });

      jest.runTimersToTime(150);
    });
  });
});

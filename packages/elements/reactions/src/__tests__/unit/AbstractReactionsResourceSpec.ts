import AbstractReactionsResource from '../../reactions-resource';
import {
  ReactionSummary,
  ReactionsState,
  ObjectReactionKey,
  Reactions,
  ReactionStatus,
} from '../../reactions-resource';

const buildAbstractClass = () => {
  const concreteMockClass = class extends AbstractReactionsResource {
    addReaction(
      containerAri: string,
      ari: string,
      emojiId: string,
    ): Promise<ReactionsState> {
      throw new Error('Not implemented!');
    }

    deleteReaction(
      containerAri: string,
      ari: string,
      emojiId: string,
    ): Promise<ReactionsState> {
      throw new Error('Not implemented!');
    }

    getReactions(keys: ObjectReactionKey[]): Promise<Reactions> {
      throw new Error('Not implemented!');
    }

    getDetailedReaction(reaction: ReactionSummary): Promise<ReactionSummary> {
      throw new Error('Not implemented!');
    }

    fetchReactionDetails(reaction: ReactionSummary): Promise<ReactionSummary> {
      throw new Error('Not implemented!');
    }
  };

  return new concreteMockClass();
};

describe('AbstractReactionsResource', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  let resource: AbstractReactionsResource;

  beforeEach(() => {
    resource = buildAbstractClass();
  });

  // Skip for now. This is failing due a bug. See issue FS-1891
  it.skip('should notify subscribers of different containers', () => {
    jest.spyOn(resource, 'getReactions').mockImplementation(args => {
      return Promise.reject('Error');
    });

    const handler1 = jest.fn();
    resource.subscribe(
      {
        containerAri: 'container-1',
        ari: 'ari-1',
      },
      handler1,
    );
    const handler2 = jest.fn();
    resource.subscribe(
      {
        containerAri: 'container-2',
        ari: 'ari-2',
      },
      handler2,
    );

    jest.runTimersToTime(100);

    return Promise.resolve().then(() => {
      expect(resource.getReactions).toHaveBeenCalledTimes(1);
      expect(resource.getReactions).toHaveBeenCalledWith([
        { containerAri: 'container-1', ari: 'ari-1' },
        { containerAri: 'container-2', ari: 'ari-2' },
      ]);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle error', () => {
    jest
      .spyOn(resource, 'getReactions')
      .mockImplementation(args => Promise.reject('Error'));

    const handler: (state: ReactionsState) => void = jest.fn();

    resource.subscribe(
      {
        containerAri: 'container',
        ari: 'ari',
      },
      handler,
    );
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ status: ReactionStatus.loading });

    jest.runAllTimers();

    return (
      Promise.resolve()
        // We need this extra then to force the callback to executed
        // after the catch in our code. If we upgrade jest to latest
        // version (22), we can remove it.
        .then()
        .then(() => {
          expect(handler).toHaveBeenCalledTimes(2);
          expect(handler).toHaveBeenCalledWith({
            status: ReactionStatus.error,
            message: 'Error while fetching reactions',
          });
        })
    );
  });
});

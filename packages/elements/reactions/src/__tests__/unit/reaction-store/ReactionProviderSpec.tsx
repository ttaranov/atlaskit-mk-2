import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import {
  ari,
  containerAri,
  reaction,
  user,
} from '../../../adapter/MockReactionsAdapter';
import { ReactionAdapter } from '../../../adapter/ReactionAdapter';
import {
  ReactionProvider,
  Props,
  State,
} from '../../../reaction-store/ReactionProvider';
import {
  Actions,
  ReactionsContext,
} from '../../../reaction-store/ReactionsContext';
import { ReactionStatus } from '../../../types/ReactionStatus';

describe('ReactionProvider', () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  const fakeAdaptor: ReactionAdapter = {
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

  const extractActions = (provider: ShallowWrapper<Props, State>): Actions =>
    provider.find(ReactionsContext.Provider).prop('value').actions;

  const renderProvider = () =>
    shallow(
      <ReactionProvider
        adapter={fakeAdaptor}
        url="http://reactions.atlassian.com"
      />,
    );

  let provider: ShallowWrapper<Props, State>;
  let actions: Actions;

  beforeEach(() => {
    provider = renderProvider();
    actions = extractActions(provider);
  });

  afterEach(() => {
    (fakeAdaptor.getReactions as jest.Mock<any>).mockClear();
    (fakeAdaptor.getDetailedReaction as jest.Mock<any>).mockClear();
    (fakeAdaptor.addReaction as jest.Mock<any>).mockClear();
    (fakeAdaptor.deleteReaction as jest.Mock<any>).mockClear();
  });

  it('should provide actions and state', () => {
    const contextProvider = provider.find(ReactionsContext.Provider);
    expect(contextProvider.prop('value')).toMatchObject({
      value: {
        reactions: {},
        flash: {},
      },
      actions: {
        getReactions: expect.any(Function),
        toggleReaction: expect.any(Function),
        addReaction: expect.any(Function),
        getDetailedReaction: expect.any(Function),
      },
    });
  });

  it('should update adapter', () => {
    const newAdapter: ReactionAdapter = {
      getReactions: jest.fn(),
      getDetailedReaction: jest.fn(),
      addReaction: jest.fn(),
      deleteReaction: jest.fn(),
    };
    (newAdapter.getReactions as jest.Mock<any>).mockReturnValueOnce(
      getReactionsResponse,
    );
    provider.setProps({ adapter: newAdapter });
    actions.getReactions(containerAri, ari);

    jest.runAllTimers();
    expect(newAdapter.getReactions).toHaveBeenCalled();
    expect(fakeAdaptor.getReactions).not.toHaveBeenCalled();
  });

  it('should call adaptor to get reactions', () => {
    (fakeAdaptor.getReactions as jest.Mock<any>).mockReturnValueOnce(
      getReactionsResponse,
    );

    actions.getReactions(containerAri, ari);

    jest.runAllTimers();

    expect(fakeAdaptor.getReactions).toHaveBeenCalledTimes(1);

    return getReactionsResponse.then(() => {
      expect(provider.state()).toMatchObject({
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

  describe('with state set', () => {
    beforeEach(() => {
      provider.setState({
        reactions: {
          [`${containerAri}|${ari}`]: {
            reactions: [
              reaction(':thumbsup:', 3, false),
              reaction(':thumbsdown:', 3, true),
            ],
            status: ReactionStatus.ready,
          },
        },
      });
    });

    it('should call adaptor to get detailed reaction', () => {
      const response = Promise.resolve({
        ...reaction(':thumbsup:', 1, true),
        users: [user('id', 'Some real user')],
      });

      (fakeAdaptor.getDetailedReaction as jest.Mock<any>).mockReturnValueOnce(
        response,
      );

      actions.getDetailedReaction(containerAri, ari, '1f44d');

      expect(fakeAdaptor.getDetailedReaction).toHaveBeenCalledTimes(1);

      return response.then(() => {
        expect(provider.state()).toMatchObject({
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

      (fakeAdaptor.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      actions.addReaction(containerAri, ari, '1f44d');

      expect(provider.state()).toMatchObject({
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

      (fakeAdaptor.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      actions.toggleReaction(containerAri, ari, '1f44d');

      expect(provider.state()).toMatchObject({
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
      actions.addReaction(containerAri, ari, '1f44e');

      expect(provider.state()).toMatchObject({
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

      expect(fakeAdaptor.addReaction).not.toHaveBeenCalled();
    });

    it('should call adaptor to remove reaction', () => {
      const response = Promise.resolve({
        ...reaction(':thumbsdown:', 2, false),
      });

      (fakeAdaptor.addReaction as jest.Mock<any>).mockReturnValueOnce(response);

      actions.toggleReaction(containerAri, ari, '1f44e');

      expect(provider.state()).toMatchObject({
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

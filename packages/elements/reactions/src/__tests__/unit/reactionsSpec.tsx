import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';

import { mount } from 'enzyme';
import { Reactions, OnEmoji } from '../..';
import { sortByRelevance } from '../../internal/helpers';
import Reaction from '../../internal/reaction';
import ReactionPicker from '../../reaction-picker';
import MockReactionsProvider, {
  reactionsProvider,
} from '../../mock-reactions-provider';
import { smileyId, flagBlackId, thumbsdownId, thumbsupId } from './_test-data';
import { ObjectReactionKey, ReactionStatus } from '../../reactions-resource';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResourcePromise } = emoji.testData;

const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

describe('@atlaskit/reactions/reactions', () => {
  const renderReactions = (onClick: OnEmoji = () => {}) => {
    return (
      <Reactions
        containerAri={containerAri}
        ari={demoAri}
        reactionsProvider={reactionsProvider}
        emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
        onReactionClick={onClick}
      />
    );
  };

  const getSortedReactions = () => {
    const reactionSummaries = (reactionsProvider as MockReactionsProvider)
      .mockData[reactionsProvider.objectReactionKey(containerAri, demoAri)];
    return [...reactionSummaries].sort(sortByRelevance);
  };

  beforeAll(() => {
    // Override "subscribe" so that it resolves instantly.
    const subscribe = reactionsProvider.subscribe;
    jest
      .spyOn(reactionsProvider, 'subscribe')
      .mockImplementation(
        (objectReactionKey: ObjectReactionKey, handler: Function) => {
          subscribe.call(reactionsProvider, objectReactionKey, handler);
          (reactionsProvider as any).updateReactionState(
            containerAri,
            demoAri,
            {
              status: ReactionStatus.ready,
              reactions: (reactionsProvider as MockReactionsProvider).mockData[
                reactionsProvider.objectReactionKeyToString(objectReactionKey)
              ],
            },
          );
        },
      );
  });

  afterAll(() => {
    (reactionsProvider.subscribe as any).restore();
  });

  it('should trigger "onReactionClick" when Reaction is clicked', () => {
    const onReactionClick = jest.fn();
    const reactions = mount(renderReactions(onReactionClick));

    reactions
      .find(Reaction)
      .find('button')
      .first()
      .simulate('mouseup', { button: 0 });
    expect(onReactionClick).toHaveBeenCalled();
  });

  it('should render reactions based on response from reactions service', () => {
    const reactions = mount(renderReactions());
    const sortedReactions = getSortedReactions();

    expect(reactions.length).toEqual(1);
    const reactionElements = reactions.find(Reaction);
    expect(reactionElements.length).toEqual(sortedReactions.length);

    // NOTE: Type definitions for enzyme is wrong. forEach takes a second parameter (index).
    (reactionElements as any).forEach((reaction, index) => {
      expect(reaction.props().reaction).toEqual(sortedReactions[index]);
    });
  });

  it('should update when reactions service emits notifyUpdated', () => {
    const reactions = mount(renderReactions());
    const sortedReactions = getSortedReactions();

    const reactionElements = reactions.find(Reaction);
    expect(reactionElements.length).toEqual(sortedReactions.length);

    return reactionsProvider
      .addReaction(containerAri, demoAri, smileyId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();
        expect(reactions.find(Reaction).length).toEqual(
          sortedReactions.length + 1,
        );
      });
  });

  it('should update reactions without affecting original order', () => {
    const reactions = mount(renderReactions());

    return reactionsProvider
      .addReaction(containerAri, demoAri, flagBlackId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();
        expect(
          reactions
            .find(Reaction)
            .last()
            .prop('reaction').emojiId,
        ).toEqual(flagBlackId.id);
      });
  });

  it('should not reorder existing reactions', () => {
    const reactions = mount(renderReactions());

    return reactionsProvider
      .addReaction(containerAri, demoAri, thumbsdownId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();
        const thumbsupReaction = reactions.find(Reaction).at(1);

        const thumbsDownReaction = reactions.find(Reaction).at(2);
        expect(thumbsupReaction.prop('reaction').emojiId).toEqual(
          thumbsupId.id!,
        );
        expect(thumbsupReaction.prop('reaction').count).toEqual(9);
        expect(thumbsDownReaction.prop('reaction').emojiId).toEqual(
          thumbsdownId.id!,
        );
        expect(thumbsDownReaction.prop('reaction').count).toEqual(6);
      });
  });

  it('should not flash on first mount', () => {
    const reactions = mount(renderReactions());
    const reactionElements = reactions.find(Reaction);
    expect(
      reactionElements
        .map(reaction => reaction.prop('flashOnMount'))
        .reduce((a, b) => a || b),
    ).toBeFalsy();
  });

  it('should flash new reaction on mount', () => {
    const reactions = mount(renderReactions());

    return reactionsProvider
      .addReaction(containerAri, demoAri, flagBlackId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();

        const reactionElements = reactions.find(Reaction);
        expect(
          reactionElements
            .map(reaction => reaction.prop('flashOnMount'))
            .reduce((a, b) => a && b),
        ).toBeTruthy();
      });
  });

  it('should call flash on Reaction after trying to react again', () => {
    const reactions = mount(renderReactions());

    return reactionsProvider
      .addReaction(containerAri, demoAri, thumbsupId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();

        const reactedReaction = reactions
          .find(Reaction)
          .filterWhere(
            reaction => reaction.prop('reaction').emojiId === thumbsupId.id!,
          )
          .instance() as Reaction;

        const reactionFlash = jest.spyOn(reactedReaction, 'flash');

        reactions.find(ReactionPicker).prop('onSelection')(thumbsupId.id!);

        expect(reactionFlash).toHaveBeenCalledTimes(1);
      });
  });

  it('should show loading tooltip and disable picker', () => {
    const reactions = mount(renderReactions());

    reactionsProvider.notifyUpdated(containerAri, demoAri, {
      status: ReactionStatus.loading,
    });

    reactions.update();

    expect(reactions.find(Tooltip).prop('content')).toEqual('Loading...');
    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should show loading tooltip and disable picker', () => {
    const reactions = mount(renderReactions());

    reactionsProvider.notifyUpdated(containerAri, demoAri, {
      status: ReactionStatus.error,
      message: 'Something is wrong',
    });

    reactions.update();

    expect(reactions.find(Tooltip).prop('content')).toEqual(
      'Sorry... something went wrong',
    );
    expect(reactions.find(ReactionPicker).prop('disabled')).toBeTruthy();
  });

  it('should render picker after reactions', () => {
    const reactions = mount(renderReactions());
    const container = reactions
      .find('div')
      .first()
      .children();
    expect(container.last().find(ReactionPicker)).toHaveLength(1);
  });
});

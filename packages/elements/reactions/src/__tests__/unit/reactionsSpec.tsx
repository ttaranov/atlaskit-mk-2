import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';

import { mount } from 'enzyme';
import { Reactions, OnEmoji } from '../..';
import { sortByRelevance } from '../../internal/helpers';
import Reaction, { ReactionComponent } from '../../internal/reaction';
import ReactionPicker from '../../reaction-picker';
import MockReactionsProvider, {
  reactionsProvider,
} from '../../mock-reactions-provider';
import { smileyId, flagBlackId, thumbsdownId, thumbsupId } from './_test-data';
import { ObjectReactionKey, ReactionStatus } from '../../reactions-resource';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Trigger from '../../internal/trigger';
import { ReactionSummary } from '../../reactions-resource';

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
        allowAllEmojis={true}
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
            .prop<ReactionSummary>('reaction').emojiId,
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
        expect(
          thumbsupReaction.prop<ReactionSummary>('reaction').emojiId,
        ).toEqual(thumbsupId.id!);
        expect(
          thumbsupReaction.prop<ReactionSummary>('reaction').count,
        ).toEqual(9);
        expect(
          thumbsDownReaction.prop<ReactionSummary>('reaction').emojiId,
        ).toEqual(thumbsdownId.id!);
        expect(
          thumbsDownReaction.prop<ReactionSummary>('reaction').count,
        ).toEqual(6);
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
          .find(ReactionComponent)
          .filterWhere(
            reaction => reaction.prop('reaction').emojiId === thumbsupId.id!,
          )
          .instance() as ReactionComponent;

        const reactionFlash = jest.spyOn(reactedReaction, 'flash');

        reactions.find(ReactionPicker).prop('onSelection')(
          thumbsupId.id!,
          'quickSelector',
        );

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

  describe('with analytics', () => {
    const onEvent = jest.fn();
    let component;

    beforeEach(() => {
      component = mount(
        <AnalyticsListener channel="fabric-elements" onEvent={onEvent}>
          {renderReactions()}
        </AnalyticsListener>,
      );
    });

    afterEach(() => {
      onEvent.mockClear();
    });

    it('should trigger render ', () => {
      expect(onEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            action: 'rendered',
            actionSubject: 'reactionView',
            eventType: 'ops',
            attributes: {
              duration: expect.any(Number),
              containerAri,
              ari: demoAri,
            },
          }),
        }),
        'fabric-elements',
      );
    });

    describe('with ReactionPicker open', () => {
      beforeEach(() => {
        component.find(Trigger).simulate('click');
      });

      it('should trigger clicked for Reaction Picker Button', () => {
        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPickerButton',
              eventType: 'ui',
              attributes: {
                reactionEmojiCount: 4,
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger cancelled for ReactionPicker', () => {
        component.find(ReactionPicker).prop('onCancel')();

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'cancelled',
              actionSubject: 'reactionPicker',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for new emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          'emoji-1',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectID: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: 'emoji-1',
                previousState: 'new',
                source: 'quickSelector',
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f60d',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectID: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f60d',
                previousState: 'existingNotReacted',
                source: 'quickSelector',
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked for existing reacted emoji', () => {
        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'quickSelector',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectID: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f525',
                previousState: 'existingReacted',
                source: 'quickSelector',
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });

      it('should trigger clicked from emojiPicker', () => {
        component.find(ReactionPicker).prop('onMore')();

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectID: 'more',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );

        component.find(ReactionPicker).prop('onSelection')(
          '1f525',
          'emojiPicker',
        );

        expect(onEvent).toHaveBeenCalledWith(
          expect.objectContaining({
            payload: expect.objectContaining({
              action: 'clicked',
              actionSubject: 'reactionPicker',
              actionSubjectID: 'emoji',
              eventType: 'ui',
              attributes: {
                duration: expect.any(Number),
                emojiId: '1f525',
                previousState: 'existingReacted',
                source: 'emojiPicker',
                containerAri,
                ari: demoAri,
              },
            }),
          }),
          'fabric-elements',
        );
      });
    });
  });
});

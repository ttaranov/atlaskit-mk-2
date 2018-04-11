import * as chai from 'chai';
import * as React from 'react';
import * as sinon from 'sinon';

import { mount } from 'enzyme';
import { Reactions, OnEmoji } from '../src';
import { sortByRelevance } from '../src/internal/helpers';
import Reaction from '../src/internal/reaction';
import ReactionPicker from '../src/reaction-picker';
import { reactionsProvider } from '../src/mock-reactions-provider';
import {
  smileyId,
  flagBlackId,
  thumbsdownId,
  thumbsupId,
  grinningId,
} from './_test-data';
import { ObjectReactionKey } from '../src/reactions-resource';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResourcePromise } = emoji.testData;

const { expect } = chai;

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
    const reactionSummaries = (reactionsProvider as any).cachedReactions[
      reactionsProvider.objectReactionKey(containerAri, demoAri)
    ];
    return [...reactionSummaries].sort(sortByRelevance);
  };

  beforeAll(() => {
    // Override "subscribe" so that it resolves instantly.
    const subscribe = reactionsProvider.subscribe;
    sinon
      .stub(reactionsProvider, 'subscribe')
      .callsFake((objectReactionKey: ObjectReactionKey, handler: Function) => {
        subscribe.call(reactionsProvider, objectReactionKey, handler);
        reactionsProvider.notifyUpdated(
          containerAri,
          demoAri,
          (reactionsProvider as any).cachedReactions[
            reactionsProvider.objectReactionKeyToString(objectReactionKey)
          ],
        );
      });
  });

  afterAll(() => {
    (reactionsProvider.subscribe as any).restore();
  });

  it('should trigger "onReactionClick" when Reaction is clicked', () => {
    const onReactionClick = sinon.spy();
    const reactions = mount(renderReactions(onReactionClick));

    reactions
      .find(Reaction)
      .first()
      .simulate('mouseup', { button: 0 });
    expect(onReactionClick.called).to.equal(true);
  });

  it('should render reactions based on response from reactions service', () => {
    const reactions = mount(renderReactions());
    const sortedReactions = getSortedReactions();

    expect(reactions.length).to.equal(1);
    const reactionElements = reactions.find(Reaction);
    expect(reactionElements.length).to.equal(sortedReactions.length);

    // NOTE: Type definitions for enzyme is wrong. forEach takes a second parameter (index).
    (reactionElements as any).forEach((reaction, index) => {
      expect(reaction.props().reaction).to.deep.equal(sortedReactions[index]);
    });
  });

  it('should update when reactions service emits notifyUpdated', () => {
    const reactions = mount(renderReactions());
    const sortedReactions = getSortedReactions();

    const reactionElements = reactions.find(Reaction);
    expect(reactionElements.length).to.equal(sortedReactions.length);

    return reactionsProvider
      .addReaction(containerAri, demoAri, smileyId.id!)
      .then(state => {
        reactionsProvider.notifyUpdated(containerAri, demoAri, state);
        reactions.update();
        expect(reactions.find(Reaction).length).to.equal(
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
        ).to.equal(flagBlackId.id);
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
        expect(thumbsupReaction.prop('reaction').emojiId).to.equal(
          thumbsupId.id!,
        );
        expect(thumbsupReaction.prop('reaction').count).to.equal(9);
        expect(thumbsDownReaction.prop('reaction').emojiId).to.equal(
          thumbsdownId.id!,
        );
        expect(thumbsDownReaction.prop('reaction').count).to.equal(6);
      });
  });

  it('should not flash on first mount', () => {
    const reactions = mount(renderReactions());
    const reactionElements = reactions.find(Reaction);
    expect(
      reactionElements
        .map(reaction => reaction.prop('flashOnMount'))
        .reduce((a, b) => a || b),
    ).to.be.false;
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
        ).to.be.true;
      });
  });

  it('should call flash on Reaction after trying to react again', () => {
    const reactions = mount(renderReactions());

    const reactedReaction = reactions
      .find(Reaction)
      .filterWhere(
        reaction => reaction.prop('reaction').emojiId === grinningId.id!,
      )
      .instance() as Reaction;

    const reactionFlash = sinon.spy(reactedReaction, 'flash');

    reactions.find(ReactionPicker).prop('onSelection')(grinningId.id!);

    expect(reactionFlash.calledOnce).to.be.true;
  });
});

import * as chai from 'chai';
import * as React from 'react';
import * as sinon from 'sinon';

import { mount } from 'enzyme';
import { Reactions, OnEmoji } from '../src';
import { sortReactions } from '../src/internal/helpers';
import Reaction from '../src/internal/reaction';
import { reactionsProvider } from '../src/mock-reactions-provider';
import { smileyId } from './_test-data';
import { ObjectReactionKey } from '../src/reactions-resource';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResourcePromise } = emoji.testData;

const { expect } = chai;

const demoAri = 'ari:cloud:owner:demo-cloud-id:item/1';
const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

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
  return [...reactionSummaries].sort(sortReactions);
};

describe('@atlaskit/reactions/reactions', () => {
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
});

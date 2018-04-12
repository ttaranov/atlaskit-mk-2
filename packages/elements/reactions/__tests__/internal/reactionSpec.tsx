import { Emoji, EmojiDescription, toEmojiId } from '@atlaskit/emoji';
import * as chai from 'chai';
import * as React from 'react';
import * as sinon from 'sinon';
import { waitUntil } from '@atlaskit/util-common-test';
import { mount } from 'enzyme';

import { hasSelector } from '../_test-utils';
import Reaction, { ReactionOnClick } from '../../src/internal/reaction';
import FlashAnimation from '../../src/internal/flash-animation';
import { emoji } from '@atlaskit/util-data-test';
import { EmojiProvider } from '@atlaskit/emoji';

const { getEmojiResourcePromise, newEmojiRepository } = emoji.testData;
const emojiRepository = newEmojiRepository();

const { expect } = chai;

const grinning: EmojiDescription = emojiRepository.findByShortName(
  ':grinning:',
) as EmojiDescription;

const buildReaction = (count: number, reacted: boolean) => ({
  ari: 'ari:cloud:owner:demo-cloud-id:item/1',
  containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
  emojiId: toEmojiId(grinning).id!,
  count,
  reacted,
});

const renderReaction = (
  reacted: boolean,
  count: number,
  onClick: ReactionOnClick,
  flashOnMount: boolean = false,
) => (
  <Reaction
    reaction={buildReaction(count, reacted)}
    emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
    onClick={onClick}
    flashOnMount={flashOnMount}
  />
);

describe('@atlaskit/reactions/reaction', () => {
  it('should render emoji with resolved emoji data', () => {
    const reaction = mount(renderReaction(false, 1, () => {}));

    waitUntil(() => hasSelector(reaction, Emoji)).then(() => {
      const emoji = reaction.find(Emoji).first();
      expect(emoji.length).to.equal(1);
      const emojiDesc = emoji.prop('emoji');
      expect(emojiDesc.id).to.equal(grinning.id);
    });
  });

  it('should call onClick on click', () => {
    const onClickSpy = sinon.spy();
    const reaction = mount(renderReaction(false, 1, onClickSpy));

    reaction.simulate('mouseup', { button: 0 });
    expect(onClickSpy.called).to.equal(true);
  });

  it('should delegate flash to Flash component', () => {
    const reaction = mount(renderReaction(true, 10, () => {}));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;

    const flashSpy = jest.spyOn(flash, 'flash');

    (reaction.instance() as Reaction).flash();

    expect(flashSpy.mock.calls).to.have.lengthOf(1);
  });

  it('should call flash when change to reacted', () => {
    const reaction = mount(renderReaction(false, 10, () => {}));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;
    const flashSpy = jest.spyOn(flash, 'flash');

    reaction.setProps({
      reaction: {
        ari: 'ari:cloud:owner:demo-cloud-id:item/1',
        containerAri: 'ari:cloud:owner:demo-cloud-id:container/1',
        emojiId: toEmojiId(grinning).id!,
        count: 11,
        reacted: true,
      },
    });

    expect(flashSpy.mock.calls).to.have.lengthOf(1);
  });

  it('should call flash on mount', () => {
    const reaction = mount(renderReaction(true, 10, () => {}, true));

    const flash = reaction.find(FlashAnimation).instance() as FlashAnimation;
    const flashSpy = jest.spyOn(flash, 'flash');

    (reaction.instance() as Reaction).componentDidMount();

    expect(flashSpy.mock.calls).to.have.lengthOf(1);
  });
});

import * as chai from 'chai';
import * as React from 'react';
import * as sinon from 'sinon';
import { OnEmojiEvent, EmojiProvider } from '@atlaskit/emoji';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';

import { mount, shallow } from 'enzyme';
import EmojiButton from '../../src/internal/emoji-button';
import Selector from '../../src/internal/selector';
import {
  defaultReactions,
  isDefaultReaction,
  revealStyle,
} from '../../src/internal/selector';
import { emoji } from '@atlaskit/util-data-test';

const { getEmojiResourcePromise } = emoji.testData;

const { expect } = chai;

const renderSelector = (
  onSelection: OnEmojiEvent = () => {},
  showMore = false,
  onMoreClick = () => {},
) => {
  return (
    <Selector
      emojiProvider={getEmojiResourcePromise() as Promise<EmojiProvider>}
      onSelection={onSelection}
      showMore={showMore}
      onMoreClick={onMoreClick}
    />
  );
};

describe('@atlaskit/reactions/selector', () => {
  let clock;
  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  it('should render default reactions', () => {
    const selector = shallow(renderSelector());
    const emojis = selector.find(EmojiButton);

    expect(emojis.length).to.equal(defaultReactions.length);

    emojis.forEach(emoji => {
      expect(isDefaultReaction(emoji.props().emojiId)).to.equal(true);
    });

    expect(selector.find(EditorMoreIcon)).to.have.lengthOf(0);
  });

  it('should call "onSelection" on selection', () => {
    const onSelection = sinon.spy();
    const selector = mount(renderSelector(onSelection));
    selector
      .find(EmojiButton)
      .first()
      .simulate('mouseup', { button: 0 });

    clock.tick(500);
    expect(onSelection.called).to.equal(true);
  });

  it('should call "onMoreClick" when more button is clicked', () => {
    const onSelection = jest.fn();
    const onMoreClick = jest.fn();
    const selector = mount(renderSelector(onSelection, true, onMoreClick));

    selector.find(EditorMoreIcon).simulate('mousedown');

    expect(onMoreClick.mock.calls).to.have.lengthOf(1);
  });

  it('should reveal default emoji', () => {
    const selector = mount(renderSelector());

    expect(
      selector
        .find(`.${revealStyle}`)
        .at(2)
        .prop('style'),
    ).to.have.property('animationDelay', '100ms');
  });
});

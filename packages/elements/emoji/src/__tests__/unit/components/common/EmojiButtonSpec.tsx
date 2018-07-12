import * as sinon from 'sinon';
import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import * as styles from '../../../../components/common/styles';
import EmojiButton from '../../../../components/common/EmojiButton';
import { spriteEmoji, imageEmoji } from '../../_test-data';

describe('<EmojiButton />', () => {
  describe('as sprite', () => {
    it('should call onClick on click', () => {
      const onClickSpy = sinon.spy();
      const wrapper = mount(
        <EmojiButton emoji={spriteEmoji} onSelected={onClickSpy} />,
      );

      wrapper
        .find(`.${styles.emojiButton}`)
        .simulate('mousedown', { button: 0 });
      expect(onClickSpy.called).to.equal(true);
    });
  });

  describe('as image', () => {
    it('should call onClick on click', () => {
      const onClickSpy = sinon.spy();
      const wrapper = mount(
        <EmojiButton emoji={imageEmoji} onSelected={onClickSpy} />,
      );

      wrapper
        .find(`.${styles.emojiButton}`)
        .simulate('mousedown', { button: 0 });
      expect(onClickSpy.called).to.equal(true);
    });
  });
});

import * as sinon from 'sinon';
import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import ToneSelector from '../../../../components/common/ToneSelector';
import EmojiButton from '../../../../components/common/EmojiButton';
import {
  EmojiDescription,
  EmojiDescriptionWithVariations,
} from '../../../../types';
import { imageEmoji, generateSkinVariation } from '../../_test-data';
import { analyticsEmojiPrefix } from '../../../../constants';

const baseHandEmoji: EmojiDescription = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
};

const handEmoji: EmojiDescriptionWithVariations = {
  ...baseHandEmoji,
  skinVariations: [
    generateSkinVariation(baseHandEmoji, 1),
    generateSkinVariation(baseHandEmoji, 2),
    generateSkinVariation(baseHandEmoji, 3),
    generateSkinVariation(baseHandEmoji, 4),
    generateSkinVariation(baseHandEmoji, 5),
  ],
};

describe('<ToneSelector />', () => {
  it('should display one emoji per skin variations + default', () => {
    const onToneSelectedSpy = sinon.spy();
    const wrapper = mount(
      <ToneSelector emoji={handEmoji} onToneSelected={onToneSelectedSpy} />,
    );

    expect(wrapper.find(EmojiButton)).to.have.length(6);
  });

  it('should call onToneSelected on click', () => {
    const onToneSelectedSpy = sinon.spy();
    const firePrivateAnalyticsEvent = sinon.stub();

    const wrapper = mount(
      <ToneSelector
        emoji={handEmoji}
        onToneSelected={onToneSelectedSpy}
        firePrivateAnalyticsEvent={firePrivateAnalyticsEvent}
      />,
    );

    wrapper
      .find(EmojiButton)
      .first()
      .simulate('mousedown', { button: 0 });
    expect(onToneSelectedSpy.calledWith(0)).to.equal(true);
    expect(
      firePrivateAnalyticsEvent.calledWith(
        `${analyticsEmojiPrefix}.skintone.select`,
        { skinTone: 0 },
      ),
    ).to.equal(true);
  });
});

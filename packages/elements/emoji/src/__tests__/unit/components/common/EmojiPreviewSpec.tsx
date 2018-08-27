import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';
import * as styles from '../../../../components/common/styles';
import EmojiPreview from '../../../../components/common/EmojiPreview';
import ToneSelector from '../../../../components/common/ToneSelector';
import Emoji from '../../../../components/common/Emoji';
import EmojiButton from '../../../../components/common/EmojiButton';
import CachingEmoji from '../../../../components/common/CachingEmoji';
import { EmojiDescriptionWithVariations } from '../../../../types';
import { imageEmoji, generateSkinVariation } from '../../_test-data';
import * as helper from './_common-test-helpers';

const baseEmoji = imageEmoji;

const emoji: EmojiDescriptionWithVariations = {
  ...baseEmoji,
  skinVariations: [
    generateSkinVariation(imageEmoji, 1),
    generateSkinVariation(imageEmoji, 2),
    generateSkinVariation(imageEmoji, 3),
    generateSkinVariation(imageEmoji, 4),
    generateSkinVariation(imageEmoji, 5),
  ],
};

const baseToneEmoji = {
  ...imageEmoji,
  id: 'raised_back_of_hand',
  shortName: ':raised_back_of_hand:',
  name: 'Raised back of hand',
};

const toneEmoji: EmojiDescriptionWithVariations = {
  ...baseToneEmoji,
  skinVariations: [
    generateSkinVariation(baseToneEmoji, 1),
    generateSkinVariation(baseToneEmoji, 2),
    generateSkinVariation(baseToneEmoji, 3),
    generateSkinVariation(baseToneEmoji, 4),
    generateSkinVariation(baseToneEmoji, 5),
  ],
};

describe('<EmojiPreview />', () => {
  describe('preview', () => {
    it('should render an emoji preview if one is selected', () => {
      const wrapper = shallow(<EmojiPreview emoji={emoji} />);

      expect(
        wrapper.find(`.${styles.preview}`),
        'Preview rendered',
      ).to.have.length(1);
    });

    it('should not render the emoji preview if one is not selected', () => {
      const wrapper = shallow(<EmojiPreview />);

      expect(
        wrapper.find(`.${styles.preview}`),
        'Preview not rendered',
      ).to.have.length(0);
    });
  });

  describe('tone', () => {
    it('should display tone selector after clicking on the tone button', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      wrapper.find(EmojiButton).simulate('mousedown', { button: 0 });
      expect(wrapper.state('selectingTone')).to.equal(true);
      expect(
        wrapper.find(ToneSelector),
        'ToneSelector in preview',
      ).to.have.length(1);
    });

    it('button should show current selected tone if provided', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} selectedTone={1} toneEmoji={toneEmoji} />,
      );

      expect(wrapper.find(Emoji), 'Emoji in preview').to.have.length(2);
      const first = wrapper.find(Emoji).first();
      const emoji1Prop = first.prop('emoji');
      expect(emoji1Prop, 'First has emoji prop').to.not.equal(undefined);
      expect(emoji1Prop.id, 'Emoji id').to.equal(emoji.id);
      expect(emoji1Prop.shortName, 'Emoji shortName').to.equal(emoji.shortName);

      const second = wrapper.find(Emoji).at(1);
      const selectedTone = toneEmoji!.skinVariations![0];
      const emoji2Prop = second.prop('emoji');
      expect(emoji2Prop, 'Second has emoji prop').to.not.equal(undefined);
      expect(emoji2Prop.id, 'Tone id').to.equal(selectedTone.id);
      expect(emoji2Prop.shortName, 'Tone shortName').to.equal(
        selectedTone.shortName,
      );
    });

    it('button should show default tone if selected tone is not specified', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      expect(wrapper.find(Emoji), 'Emoji in preview').to.have.length(2);
      const first = wrapper.find(Emoji).first();
      const emoji1Prop = first.prop('emoji');
      expect(emoji1Prop.shortName, 'Emoji shortName').to.equal(emoji.shortName);
      expect(
        emoji1Prop.representation,
        'Emoji skin variation',
      ).to.have.all.keys(emoji.representation as Object);
      const second = wrapper.find(Emoji).at(1);
      const emoji2Prop = second.prop('emoji');
      expect(emoji2Prop.shortName, 'Tone shortName').to.equal(
        toneEmoji.shortName,
      );
      expect(emoji2Prop.representation, 'Tone skin variation').to.have.all.keys(
        toneEmoji.representation as Object,
      );
    });

    it('should stop selecting tone when tone selected', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();
      instance.onToneSelected(1);

      expect(wrapper.state('selectingTone')).to.equal(false);
    });

    it('should pass onToneSelected to tone selector', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();
      wrapper.update();

      expect(wrapper.find(ToneSelector).prop('onToneSelected')).to.equal(
        instance.onToneSelected,
      );
    });

    it('should stop selecting tone on mouse leave', () => {
      const wrapper = mount(
        <EmojiPreview emoji={emoji} toneEmoji={toneEmoji} />,
      );

      const instance = wrapper.instance() as EmojiPreview;
      instance.onToneButtonClick();

      wrapper.simulate('mouseLeave');
      expect(wrapper.state('selectingTone')).to.equal(false);
    });
  });

  describe('Add custom emoji', () => {
    const safeFindStartEmojiUpload = async component => {
      await waitUntil(() => helper.customEmojiButtonVisible(component));
      return helper.findCustomEmojiButton(component);
    };

    const waitUntilPreviewSectionIsVisible = async component => {
      await waitUntil(() => helper.findEmojiPreviewSection(component).exists());
      return helper.findEmojiPreviewSection(component);
    };

    describe('Upload not supported', () => {
      it('"Add custom emoji" button should not appear when uploadEnabled is false', async () => {
        const component = mount(
          <EmojiPreview
            emoji={emoji}
            toneEmoji={toneEmoji}
            uploadEnabled={false}
          />,
        );
        await waitUntil(
          () => component.update() && component.find(CachingEmoji).exists(),
        );
      });
    });

    describe('Upload supported', () => {
      let component;

      beforeEach(() => {
        component = mount(
          <EmojiPreview
            emoji={emoji}
            toneEmoji={toneEmoji}
            uploadEnabled={true}
          />,
        );
      });

      const assertCustomEmojiButtonShown = async () => {
        const addCustomEmojiButton = await safeFindStartEmojiUpload(component);
        expect(
          addCustomEmojiButton,
          'Add custom emoji button defined',
        ).to.not.equal(undefined);
      };

      const performToneButtonClick = component => {
        const instance = component.instance() as EmojiPreview;
        instance.onToneButtonClick();
        component.update();
      };

      it('"Add custom emoji" button should appear as default', async () => {
        await assertCustomEmojiButtonShown();
      });

      it('"Add custom emoji" button should not appear when Tone is clicked', async () => {
        await assertCustomEmojiButtonShown();

        performToneButtonClick(component);

        expect(helper.findCustomEmojiButton(component).length).to.equal(0);
      });

      it('"Add custom emoji" button should appear after Tone is skipped', async () => {
        const emojiPreviewSection = await waitUntilPreviewSectionIsVisible(
          component,
        );
        await assertCustomEmojiButtonShown();

        performToneButtonClick(component);

        expect(helper.findCustomEmojiButton(component).length).to.equal(0);

        // this should cancel the Tone selection
        emojiPreviewSection.simulate('mouseleave');

        // ensure upload button is shown after Tone is cancelled
        await assertCustomEmojiButtonShown();
      });
    });
  });
});

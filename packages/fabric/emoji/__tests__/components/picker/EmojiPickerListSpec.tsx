import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import * as styles from '../../../src/components/picker/styles';
import EmojiList from '../../../src/components/picker/EmojiPickerList';
import EmojiPickerCategoryHeading from '../../../src/components/picker/EmojiPickerCategoryHeading';
import {
  imageEmoji,
  siteEmojiFoo,
  siteEmojiWtf,
} from '../../../src/support/test-data';
import { EmojiDescription } from '../../../src/types';
import { CachingEmoji } from '../../../src/components/common/CachingEmoji';

const emojis = [imageEmoji];
const customEmojis: EmojiDescription[] = [siteEmojiFoo, siteEmojiWtf];

describe('<EmojiPickerList />', () => {
  describe('list', () => {
    it('should contain search ', () => {
      const wrapper = mount(<EmojiList emojis={emojis} />);

      expect(wrapper.find(`.${styles.pickerSearch}`)).to.have.length(1);
    });

    it('should show people category first if no frequently used', () => {
      const wrapper = mount(<EmojiList emojis={emojis} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.get(0).props.title).to.equal('PEOPLE');
    });

    it('should show frequently used category first if present', () => {
      const frequentEmoji: EmojiDescription = {
        id: 'freq-1',
        shortName: ':frequent_thing:',
        name: 'Frequent',
        type: 'standard',
        category: 'FREQUENT',
        order: 1032,
        representation: {
          imagePath: 'https://path-to-image.png',
          width: 24,
          height: 24,
        },
        ascii: undefined,
        searchable: true,
      };

      const emojisWithFrequent = [...emojis, frequentEmoji];

      const wrapper = mount(<EmojiList emojis={emojisWithFrequent} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.get(0).props.title).to.equal('FREQUENT');
      expect(categoryHeadings.get(1).props.title).to.equal('PEOPLE');
    });

    it('should render user custom emojis under Your Uploads', () => {
      const wrapper = mount(
        <EmojiList emojis={customEmojis} currentUser={{ id: 'hulk' }} />,
      );

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.length).to.equal(2);
      expect(categoryHeadings.get(0).props.title).to.equal('Your uploads');
      expect(categoryHeadings.get(1).props.title).to.equal('All uploads');

      const cachedEmojis = wrapper.find(CachingEmoji);

      // expected 3 emojis: foo in "Your Uploads", foo/wtf in "All uploads", grimacing in People
      expect(cachedEmojis.length).to.equal(3);
      expect(cachedEmojis.get(0).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(1).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(2).props.emoji.id).to.equal('wtf');
    });

    it('should not render user custom emojis section if user has none', () => {
      const wrapper = mount(
        <EmojiList emojis={customEmojis} currentUser={{ id: 'alex' }} />,
      );

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.length).to.equal(1);
      expect(categoryHeadings.get(0).props.title).to.equal('All uploads');

      const cachedEmojis = wrapper.find(CachingEmoji);

      expect(cachedEmojis.length).to.equal(2);
      expect(cachedEmojis.get(0).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(1).props.emoji.id).to.equal('wtf');
    });

    it('should not render user custom emojis section if currentUser is undefined', () => {
      const wrapper = mount(<EmojiList emojis={customEmojis} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.length).to.equal(1);
      expect(categoryHeadings.get(0).props.title).to.equal('All uploads');

      const cachedEmojis = wrapper.find(CachingEmoji);

      expect(cachedEmojis.length).to.equal(2);
      expect(cachedEmojis.get(0).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(1).props.emoji.id).to.equal('wtf');
    });
  });
});

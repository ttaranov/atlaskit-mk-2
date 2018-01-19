import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import * as styles from '../../../../src/components/picker/styles';
import EmojiList from '../../../../src/components/picker/EmojiPickerList';
import EmojiPickerCategoryHeading from '../../../../src/components/picker/EmojiPickerCategoryHeading';
import { imageEmoji } from '../../../../src/support/test-data';
import { EmojiDescription } from '../../../../src/types';

const emojis = [imageEmoji];

describe('<EmojiPickerList />', () => {
  describe('list', () => {
    it('should contain search ', () => {
      const wrapper = mount(
        <EmojiList emojis={emojis} showUploadOption={true} />,
      );

      expect(wrapper.find(`.${styles.pickerSearch}`)).to.have.length(1);
    });

    it('should show people category first if no frequently used', () => {
      const wrapper = mount(
        <EmojiList emojis={emojis} showUploadOption={true} />,
      );

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

      const wrapper = mount(
        <EmojiList emojis={emojisWithFrequent} showUploadOption={true} />,
      );

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.get(0).props.title).to.equal('FREQUENT');
      expect(categoryHeadings.get(1).props.title).to.equal('PEOPLE');
    });
  });
});

import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { List as VirtualList } from 'react-virtualized/dist/commonjs/List';
import * as styles from '../../../../components/picker/styles';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiPickerCategoryHeading from '../../../../components/picker/EmojiPickerCategoryHeading';
import {
  imageEmoji,
  siteEmojiFoo,
  siteEmojiWtf,
  emojis as allEmojis,
  onRowsRenderedArgs,
  atlassianEmojis,
} from '../../_test-data';
import { EmojiDescription } from '../../../../types';
import { deleteEmojiLabel } from '../../../../constants';
import {
  CachingEmoji,
  CachingEmojiProps,
} from '../../../../components/common/CachingEmoji';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

const emojis = [imageEmoji];
const customEmojis: EmojiDescription[] = [siteEmojiFoo, siteEmojiWtf];

describe('<EmojiPickerList />', () => {
  describe('list', () => {
    it('should contain search ', () => {
      const wrapper = mount(<EmojiPickerList emojis={emojis} />);

      expect(wrapper.find(`.${styles.pickerSearch}`)).to.have.length(1);
    });

    it('should show people category first if no frequently used', () => {
      const wrapper = mount(<EmojiPickerList emojis={emojis} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.get(0).props.id).to.equal('PEOPLE');
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

      const wrapper = mount(<EmojiPickerList emojis={emojisWithFrequent} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.get(0).props.id).to.equal('FREQUENT');
      expect(categoryHeadings.get(1).props.id).to.equal('PEOPLE');
    });

    it('should order emoji inside category', () => {
      const outOfOrderEmojis = [
        {
          ...atlassianEmojis[0],
          order: 10,
        },
        {
          ...atlassianEmojis[1],
          order: 0,
        },
      ];
      const wrapper = mount(<EmojiPickerList emojis={outOfOrderEmojis} />);

      const cachingEmojis: ReactWrapper<
        CachingEmojiProps,
        never
      > = wrapper.find(CachingEmoji);

      expect(cachingEmojis).to.have.lengthOf(2);
      expect(cachingEmojis.at(0).prop('emoji').id).to.be.equal(
        atlassianEmojis[1].id,
      );
      expect(cachingEmojis.at(1).prop('emoji').id).to.be.equal(
        atlassianEmojis[0].id,
      );
    });

    it('should not order frequent category emojis', () => {
      const frequentCategoryEmojis = [
        {
          ...atlassianEmojis[0],
          category: 'FREQUENT',
          order: 10,
        },
        {
          ...atlassianEmojis[1],
          category: 'FREQUENT',
          order: 0,
        },
      ];

      const wrapper = mount(
        <EmojiPickerList emojis={frequentCategoryEmojis} />,
      );

      const cachingEmojis: ReactWrapper<
        CachingEmojiProps,
        never
      > = wrapper.find(CachingEmoji);

      expect(cachingEmojis).to.have.lengthOf(2);
      expect(cachingEmojis.at(0).prop('emoji').id).to.be.equal(
        atlassianEmojis[0].id,
      );
      expect(cachingEmojis.at(1).prop('emoji').id).to.be.equal(
        atlassianEmojis[1].id,
      );
    });
  });

  describe('custom upload display', () => {
    it('should render user custom emojis under Your Uploads', () => {
      const wrapper = mount(
        <EmojiPickerList emojis={customEmojis} currentUser={{ id: 'hulk' }} />,
      );

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.length).to.equal(2);
      expect(categoryHeadings.get(0).props.title).to.equal('Your uploads');
      expect(categoryHeadings.get(1).props.title).to.equal('All uploads');

      const cachedEmojis = wrapper.find(CachingEmoji);

      // expected 3 emojis: foo in "Your Uploads", foo/wtf in "All uploads"
      expect(cachedEmojis.length).to.equal(3);
      expect(cachedEmojis.get(0).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(1).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(2).props.emoji.id).to.equal('wtf');
    });

    it('should not render user custom emojis section if user has none', () => {
      const wrapper = mount(
        <EmojiPickerList emojis={customEmojis} currentUser={{ id: 'alex' }} />,
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
      const wrapper = mount(<EmojiPickerList emojis={customEmojis} />);

      const categoryHeadings = wrapper.find(EmojiPickerCategoryHeading);
      expect(categoryHeadings.length).to.equal(1);
      expect(categoryHeadings.get(0).props.title).to.equal('All uploads');

      const cachedEmojis = wrapper.find(CachingEmoji);

      expect(cachedEmojis.length).to.equal(2);
      expect(cachedEmojis.get(0).props.emoji.id).to.equal('foo');
      expect(cachedEmojis.get(1).props.emoji.id).to.equal('wtf');
    });

    it('should trigger onCategoryActivated', () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={allEmojis}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      onCategoryActivated.mockReset();

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onRowsRendered(onRowsRenderedArgs(9, 10, 15, 20));

      expect(onCategoryActivated.mock.calls).to.have.length(1);
      expect(onCategoryActivated.mock.calls[0][0]).to.equal('ACTIVITY');
    });

    it('should not break while finding category in an empty list', () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={[]}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      onCategoryActivated.mockReset();

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onRowsRendered(onRowsRenderedArgs());

      expect(onCategoryActivated.mock.calls).to.have.length(0);
    });

    it('should trigger onCategoryActivated for first category', () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={allEmojis}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onRowsRendered(onRowsRenderedArgs(5, 10, 20, 25));
      onCategoryActivated.mockReset();
      onRowsRendered(onRowsRenderedArgs(0, 0, 10, 15));

      expect(onCategoryActivated.mock.calls).to.have.length(1);
      expect(onCategoryActivated.mock.calls[0][0]).to.equal('PEOPLE');
    });

    it('should trigger onCategoryActivated for bottom category', () => {
      const onCategoryActivated = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={allEmojis}
          onCategoryActivated={onCategoryActivated}
        />,
      );

      const virtualList = wrapper.find(VirtualList);

      const onRowsRendered = virtualList.prop('onRowsRendered') as Function;

      onCategoryActivated.mockReset();
      onRowsRendered(onRowsRenderedArgs(27, 29, 29, 29));

      expect(onCategoryActivated.mock.calls).to.have.length(1);
      expect(onCategoryActivated.mock.calls[0][0]).to.equal('CUSTOM');
    });
  });

  describe('delete', () => {
    it('should render user custom emoji with delete button', () => {
      const wrapper = mount(
        <EmojiPickerList emojis={customEmojis} currentUser={{ id: 'hulk' }} />,
      );
      const yourEmoji = wrapper.find(CachingEmoji).at(0);
      // expected first to be :foo: under "Your uploads"
      expect(yourEmoji.props().emoji.id).to.equal('foo');
      expect(yourEmoji.find(CrossCircleIcon)).to.have.length(1);
    });

    it('should not render delete button if not user custom emoji', () => {
      const wrapper = mount(
        <EmojiPickerList emojis={customEmojis} currentUser={{ id: 'alex' }} />,
      );
      const emoji = wrapper.find(CachingEmoji).at(0);
      // Expect first :foo: under "All uploads"
      expect(emoji.props().emoji.id).to.equal('foo');
      expect(emoji.find(CrossCircleIcon)).to.have.length(0);
    });

    it('should have label "delete-emoji" on delete button', () => {
      const wrapper = mount(
        <EmojiPickerList emojis={customEmojis} currentUser={{ id: 'hulk' }} />,
      );
      const deleteButton = wrapper
        .find(CachingEmoji)
        .at(0)
        .find(CrossCircleIcon)
        .at(0);
      // needs label of "delete-emoji" to prevent selection on click
      expect(
        deleteButton.find(`[aria-label="${deleteEmojiLabel}"]`),
      ).to.have.length.greaterThan(1);
    });

    it('should call onEmojiDelete if delete button is clicked', () => {
      const onDelete = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={customEmojis}
          currentUser={{ id: 'hulk' }}
          onEmojiDelete={onDelete}
        />,
      );
      const deleteButton = wrapper
        .find(CachingEmoji)
        .at(0)
        .find(CrossCircleIcon);
      deleteButton.simulate('click');
      expect(onDelete.mock.calls).to.have.length(1);
    });

    it('should not call onEmojiSelected if delete button is clicked', () => {
      const onSelection = jest.fn();
      const wrapper = mount(
        <EmojiPickerList
          emojis={customEmojis}
          currentUser={{ id: 'hulk' }}
          onEmojiSelected={onSelection}
        />,
      );
      const deleteButton = wrapper
        .find(CachingEmoji)
        .at(0)
        .find(CrossCircleIcon);
      deleteButton.simulate('click');
      expect(onSelection.mock.calls).to.have.length(0);
    });
  });
});

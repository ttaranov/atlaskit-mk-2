import { waitUntil } from '@atlaskit/util-common-test';

import {
  getEmojiResourcePromise,
  mediaEmoji,
  standardEmojis,
} from '../../_test-data';
import { Props } from '../../../../components/picker/EmojiPicker';
import { mockNonUploadingEmojiResourceFactory } from '@atlaskit/util-data-test';

import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import CategorySelector, {
  sortCategories,
} from '../../../../components/picker/CategorySelector';
import { CategoryDescriptionMap } from '../../../../components/picker/categories';
import Emoji from '../../../../components/common/Emoji';
import EmojiButton from '../../../../components/common/EmojiButton';
import EmojiPickerFooter from '../../../../components/picker/EmojiPickerFooter';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiRepository from '../../../../api/EmojiRepository';
import { EmojiDescription, OptionalEmojiDescription } from '../../../../types';
import {
  customCategory,
  customTitle,
  defaultCategories,
  frequentCategory,
  selectedToneStorageKey,
  analyticsEmojiPrefix,
} from '../../../../constants';
import * as helper from './_emoji-picker-test-helpers';

declare var global: any;

describe('<EmojiPicker />', () => {
  let firePrivateAnalyticsEvent;

  const getUpdatedList = (component: any) =>
    component.update().find(EmojiPickerList);

  beforeEach(async () => {
    firePrivateAnalyticsEvent = jest.fn();
  });

  describe('analytics for component lifecycle', () => {
    it('should fire analytics in componentWillMount/componentWillUnmount', async () => {
      const component = await helper.setupPicker({
        firePrivateAnalyticsEvent,
      } as Props);
      component.unmount();
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.open`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.close`,
        {},
      );
    });
  });

  describe('display', () => {
    it('should display first set of emoji in viewport by default', async () => {
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const emojiProp = emojis.at(0).prop('emoji');
      // First emoji displayed
      expect(emojiProp.id).toEqual(helper.allEmojis[0].id);
      const lastEmojiProp = emojis.at(emojis.length - 1).prop('emoji');
      // Last displayed emoji in same order as source data
      expect(lastEmojiProp.id).toEqual(helper.allEmojis[emojis.length - 1].id);
    });

    it('should display all categories', async () => {
      const component = await helper.setupPicker();
      let expectedCategories = defaultCategories;
      const provider = await getEmojiResourcePromise();

      // the provider is expected to implement calculateDynamicCategories for this test
      expect(provider.calculateDynamicCategories).toBeDefined();
      const dynamicCategories = await provider.calculateDynamicCategories();
      expectedCategories = expectedCategories.concat(dynamicCategories);

      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(expectedCategories.length);
      expectedCategories.sort(sortCategories);

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons.at(i);
        const expectedTitle =
          CategoryDescriptionMap[expectedCategories[i]].name;
        expect(button.prop('title')).toEqual(expectedTitle);
      }
    });

    it('should tone selector in preview by default', async () => {
      const component = await helper.setupPicker();
      const footer = component.find(EmojiPickerFooter);
      const previewEmoji = footer.find(Emoji);

      // Only contains tone emoji
      expect(previewEmoji).toHaveLength(1);
      expect(previewEmoji.at(0).prop('emoji').shortName).toEqual(
        ':raised_hand:',
      );
    });

    it('media emoji should render placeholder while loading', async () => {
      const mockConfig = {
        promiseBuilder: (result, context) => {
          if (context === 'loadMediaEmoji') {
            // unresolved promise
            return new Promise(() => {});
          }
          return Promise.resolve(result);
        },
      };
      const component = await helper.setupPicker({} as Props, mockConfig);

      await helper.showCategory(customCategory, component, customTitle);

      const list = getUpdatedList(component);
      const customHeading = helper.findCategoryHeading(customCategory, list);
      expect(customHeading).toHaveLength(1);
      expect(customHeading.prop('title')).toEqual(customTitle);

      const customEmojiRows = helper.emojiRowsVisibleInCategory(
        customCategory,
        component,
      );
      const placeholders = customEmojiRows.find(EmojiPlaceholder);
      expect(placeholders).toHaveLength(1);
      const props = placeholders.get(0).props;
      expect(props.shortName).toEqual(mediaEmoji.shortName);
    });
  });

  describe('hover', () => {
    it('should update preview on hover', async () => {
      const component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      hoverButton.simulate('mousemove');
      const footer = component.find(EmojiPickerFooter);
      const previewEmoji = footer.find(Emoji);
      expect(previewEmoji).toHaveLength(1);
      const emojiProps = previewEmoji.prop('emoji');
      expect(emojiProps.id).toEqual(helper.allEmojis[0].id);
    });
  });

  describe('category', () => {
    it('selecting category should show that category', async () => {
      const component = await helper.setupPicker({
        firePrivateAnalyticsEvent,
      } as Props);
      // Update list until provider resolved and emojis comes in
      await waitUntil(() =>
        helper.emojisVisible(component, getUpdatedList(component)),
      );
      const categoryId = 'FLAGS';
      expect(helper.categoryVisible(categoryId, component)).toBe(false);

      helper.showCategory(categoryId, component);
      await waitUntil(() => helper.categoryVisible(categoryId, component));
      const list = getUpdatedList(component);
      const emoji = helper.findEmojiInCategory(
        helper.findEmoji(list),
        categoryId,
      );
      expect(emoji!.category).toEqual(categoryId);
      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.category.select`,
        { categoryName: categoryId },
      );
    });

    it('selecting custom category scrolls to bottom', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() =>
        helper.emojisVisible(component, getUpdatedList(component)),
      );
      expect(helper.categoryVisible(customCategory, component)).toBe(false);
      helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => helper.categoryVisible(customCategory, component));

      const list = getUpdatedList(component);
      const emoji = helper.findEmojiInCategory(
        helper.findEmoji(list),
        customCategory,
      );
      expect(emoji!.category).toEqual(customCategory);
    });

    it('does not add non-standard categories to the selector if there are no emojis in those categories', async () => {
      const component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(standardEmojis),
        ),
      });
      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(defaultCategories.length);
      expect(helper.categoryVisible(customCategory, component)).toBe(false);
      expect(helper.categoryVisible('ATLASSIAN', component)).toBe(false);
    });

    it('should display frequent category when there are frequently used emoji', async () => {
      const frequent: EmojiDescription = {
        ...standardEmojis[0],
        category: frequentCategory,
      };
      const emojiWithFrequent: EmojiDescription[] = [
        ...standardEmojis,
        frequent,
      ];
      const component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(emojiWithFrequent),
        ),
      });
      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(defaultCategories.length + 1);
      expect(helper.categoryVisible(frequentCategory, component)).toBe(true);
    });

    it('should show frequent emoji first', async () => {
      const frequent: EmojiDescription[] = [];
      for (let i = 0; i < 8; i++) {
        const emoji = {
          ...standardEmojis[i],
          category: frequentCategory,
        };

        frequent.push(emoji);
      }

      const emojiWithFrequent: EmojiDescription[] = [
        ...standardEmojis,
        ...frequent,
      ];

      const component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(emojiWithFrequent),
        ),
      });
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      // get Emoji with a particular property
      const displayedEmoji = list.find(Emoji);

      displayedEmoji.forEach((node, index) => {
        const props = node.props();
        if (index < 8) {
          expect(props.emoji.category).toEqual(frequentCategory);
        } else {
          expect(props.emoji.category).not.toEqual(frequentCategory);
        }
      });
    });

    it('adds non-standard categories to the selector dynamically based on whether they are populated with emojis', async () => {
      const component = await helper.setupPicker();
      helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => helper.categoryVisible(customCategory, component));
      const categorySelector = component.find(CategorySelector);
      const buttons = categorySelector.find('button');
      expect(buttons).toHaveLength(defaultCategories.length + 2);
      expect(helper.categoryVisible('ATLASSIAN', component)).toBe(true);
    });
  });

  describe('selection', () => {
    it('selecting emoji should trigger onSelection', async () => {
      let selection: OptionalEmojiDescription;
      const clickOffset = 10;
      const component = await helper.setupPicker({
        firePrivateAnalyticsEvent,
        onSelection: (emojiId, emoji) => {
          selection = emoji;
        },
      } as Props);

      const list = getUpdatedList(component);
      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      hoverButton().simulate('mousedown', helper.leftClick);

      await waitUntil(() => !!selection);
      expect(selection).toBeDefined();
      expect(selection!.id).toEqual(helper.allEmojis[clickOffset].id);

      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.item.select`,
        expect.objectContaining({
          emojiId: '1f431',
          type: 'STANDARD',
          queryLength: 0,
          duration: expect.any(Number),
        }),
      );
    });

    it('selecting emoji should call recordSelection on EmojiProvider', async () => {
      let selection: OptionalEmojiDescription;
      const emojiResourcePromise = getEmojiResourcePromise();
      const clickOffset = 10;
      const component = await helper.setupPicker({
        onSelection: (emojiId, emoji) => {
          selection = emoji;
        },
        emojiProvider: emojiResourcePromise,
      } as Props);
      const list = getUpdatedList(component);
      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      hoverButton().simulate('mousedown', helper.leftClick);

      await waitUntil(() => !!selection);
      const provider = await emojiResourcePromise;
      expect(provider.recordedSelections).toHaveLength(1);
      expect(provider.recordedSelections[0].shortName).toEqual(
        helper.allEmojis[clickOffset].shortName,
      );
    });
  });

  describe('search', () => {
    it('searching for "al" should match emoji via description', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() => helper.searchInputVisible(component));
      // click search
      const searchInput = helper.findSearchInput(component);
      searchInput.simulate('focus');
      // type "al"
      searchInput.simulate('change', {
        target: {
          value: 'al',
        },
      });
      await waitUntil(
        () => helper.findEmoji(getUpdatedList(component)).length === 2,
      );
      const list = getUpdatedList(component);
      const emojis = list.find(Emoji);
      expect(emojis).toHaveLength(2);
      // Albania and Algeria emoji displayed
      expect(emojis.at(0).prop('emoji').shortName).toEqual(':flag_al:');
      expect(emojis.at(1).prop('emoji').shortName).toEqual(':flag_dz:');
    });

    it('searching for red car should match emoji via shortName', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() => helper.searchInputVisible(component));
      // click search
      const searchInput = helper.findSearchInput(component);
      searchInput.simulate('focus');
      // type "red car"
      searchInput.simulate('change', {
        target: {
          value: 'red car',
        },
      });
      await waitUntil(
        () => helper.findEmoji(getUpdatedList(component)).length === 1,
      );
      const list = getUpdatedList(component);
      const emojis = list.find(Emoji);
      expect(emojis).toHaveLength(1);
      const emojiDescription = emojis.at(0).prop('emoji');
      expect(emojiDescription.name).toEqual('automobile');
      expect(emojiDescription.shortName).toEqual(':red_car:');
    });

    it('searching should disable categories in selector', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() => helper.searchInputVisible(component));
      // click search
      const searchInput = helper.findSearchInput(component);
      searchInput.simulate('focus');
      // type "al"
      searchInput.simulate('change', {
        target: {
          value: 'al',
        },
      });

      await waitUntil(
        () => helper.findEmoji(getUpdatedList(component)).length === 2,
      );
      expect(component.find(CategorySelector).prop('disableCategories')).toBe(
        true,
      );
    });
  });

  describe('skin tone selection', () => {
    it('should display the tone emoji by default', async () => {
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      hoverButton.simulate('mousemove');

      const footer = component.find(EmojiPickerFooter);
      const toneEmoji = footer.find(EmojiButton);
      expect(toneEmoji).toHaveLength(1);
    });

    it('should not display the tone emoji if hideToneSelector is set to true', async () => {
      const component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = helper.findEmoji(list).at(0);
      hoverButton.simulate('mousemove');

      const footer = component.find(EmojiPickerFooter);
      const toneEmoji = footer.find(EmojiButton);
      expect(toneEmoji).toHaveLength(0);
    });

    it('should display emojis without skin tone variations by default', async () => {
      const component = await helper.setupPicker();
      const list = getUpdatedList(component);

      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const hoverOffset = helper.findHandEmoji(emojis);
      expect(hoverOffset).not.toEqual(-1);
      const handEmoji = helper
        .findEmoji(list)
        .at(hoverOffset)
        .prop('emoji');
      expect(handEmoji.shortName).toEqual(':raised_hand:');
    });

    it('should display emojis using the skin tone preference provided by the EmojiResource', async () => {
      const emojiProvider = getEmojiResourcePromise();
      const provider = await emojiProvider;
      provider.setSelectedTone(1);

      const component = await helper.setupPicker({ emojiProvider });
      const list = getUpdatedList(component);
      await waitUntil(() => helper.emojisVisible(component, list));
      const emojis = helper.findEmoji(list);
      const hoverOffset = helper.findHandEmoji(emojis);
      expect(hoverOffset).not.toEqual(-1);
      const handEmoji = helper
        .findEmoji(list)
        .at(hoverOffset)
        .prop('emoji');
      expect(handEmoji.shortName).toEqual(':raised_hand::skin-tone-2:');
    });
  });

  describe('with localStorage available', () => {
    let setItemSpy: jest.SpyInstance<any>;

    beforeEach(() => {
      // https://github.com/facebook/jest/issues/6798#issuecomment-412871616
      setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    });

    it('should use localStorage to remember tone selection between sessions', async () => {
      const findToneEmojiInNewPicker = async () => {
        const component = await helper.setupPicker();
        const list = getUpdatedList(component);
        await waitUntil(() => helper.emojisVisible(component, list));
        const emojis = helper.findEmoji(list);
        const hoverOffset = helper.findHandEmoji(emojis);
        expect(hoverOffset).not.toEqual(-1);
        return helper
          .findEmoji(list)
          .at(hoverOffset)
          .prop('emoji');
      };

      const tone = '2';
      const provider = await getEmojiResourcePromise();
      provider.setSelectedTone(parseInt(tone, 10));

      await waitUntil(() => !!setItemSpy.mock.calls.length);
      global
        .expect(setItemSpy)
        .toHaveBeenCalledWith(selectedToneStorageKey, tone);

      // First picker should have tone set by default
      const handEmoji1 = await findToneEmojiInNewPicker();
      expect(handEmoji1.shortName).toEqual(':raised_hand::skin-tone-3:');

      // Second picker should have tone set by default
      const handEmoji2 = await findToneEmojiInNewPicker();
      expect(handEmoji2.shortName).toEqual(':raised_hand::skin-tone-3:');
    });
  });
});

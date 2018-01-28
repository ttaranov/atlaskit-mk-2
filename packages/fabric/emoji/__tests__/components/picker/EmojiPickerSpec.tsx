import * as React from 'react';
import { waitUntil } from '@atlaskit/util-common-test';

import {
  createPngFile,
  getEmojiResourcePromise,
  getNonUploadingEmojiResourcePromise,
  mediaEmoji,
  pngDataURL,
  pngFileUploadData,
  standardEmojis,
} from '../../../src/support/test-data';
import { MockEmojiResource } from '../../../src/support/MockEmojiResource';
import { Props } from '../../../src/components/picker/EmojiPicker';
import { MockEmojiResourceConfig } from '../../../src/support/support-types';
import { mockNonUploadingEmojiResourceFactory } from '../../../src/support/MockEmojiResource';

import EmojiPlaceholder from '../../../src/components/common/EmojiPlaceholder';
import CategorySelector, {
  CategoryDescriptionMap,
  sortCategories,
} from '../../../src/components/picker/CategorySelector';
import Emoji from '../../../src/components/common/Emoji';
import EmojiButton from '../../../src/components/common/EmojiButton';
import EmojiPickerFooter from '../../../src/components/picker/EmojiPickerFooter';
import EmojiPickerList from '../../../src/components/picker/EmojiPickerList';
import EmojiRepository from '../../../src/api/EmojiRepository';
import FileChooser from '../../../src/components/common/FileChooser';
import { EmojiDescription, OptionalEmojiDescription } from '../../../src/types';
import {
  customCategory,
  defaultCategories,
  frequentCategory,
  selectedToneStorageKey,
} from '../../../src/constants';
import * as helper from './_emoji-picker-test-helpers';

declare var global: any;

describe('<EmojiPicker />', () => {
  let component;
  let getUpdatedList;

  beforeEach(async () => {
    component = await helper.setupPicker();
    getUpdatedList = () => component.update().find(EmojiPickerList);
  });

  describe('display', () => {
    it('should display first set of emoji in viewport by default', async () => {
      const list = getUpdatedList();
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

    it('should tone selector in preview by default', () => {
      const footer = component.find(EmojiPickerFooter);
      const previewEmoji = footer.find(Emoji);

      // Only contains tone emoji
      expect(previewEmoji).toHaveLength(1);
      expect(previewEmoji.at(0).prop('emoji').shortName).toEqual(
        ':raised_hand:',
      );
    });

    it('media emoji should render placeholder while loading', async () => {
      const mockConfig: MockEmojiResourceConfig = {
        promiseBuilder: (result, context) => {
          if (context === 'loadMediaEmoji') {
            // unresolved promise
            return new Promise(() => {});
          }
          return Promise.resolve(result);
        },
      };
      component = await helper.setupPicker({} as Props, mockConfig);
      await helper.showCategory(customCategory, component);
      const list = getUpdatedList();
      const customHeading = helper.findCategoryHeading(customCategory, list);
      expect(customHeading).toHaveLength(1);
      expect(customHeading.prop('title')).toEqual(customCategory);

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
      component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList();

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
      // Update list until provider resolved and emojis comes in
      await waitUntil(() => helper.emojisVisible(component, getUpdatedList()));
      expect(helper.categoryVisible('flags', component)).toBe(false);
      helper.showCategory('flags', component);
      await waitUntil(() => helper.categoryVisible('flags', component));
      const list = getUpdatedList();
      const emoji = helper.findEmojiInCategory(helper.findEmoji(list), 'flags');
      expect(emoji!.category).toEqual('FLAGS');
    });

    it('selecting custom category scrolls to bottom', async () => {
      await waitUntil(() => helper.emojisVisible(component, getUpdatedList()));
      expect(helper.categoryVisible(customCategory, component)).toBe(false);
      helper.showCategory(customCategory, component);
      await waitUntil(() => helper.categoryVisible(customCategory, component));
      const list = getUpdatedList();
      const emoji = helper.findEmojiInCategory(
        helper.findEmoji(list),
        customCategory,
      );
      expect(emoji!.category).toEqual(customCategory);
    });

    it('does not add non-standard categories to the selector if there are no emojis in those categories', async () => {
      component = await helper.setupPicker({
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
      component = await helper.setupPicker({
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

      component = await helper.setupPicker({
        emojiProvider: mockNonUploadingEmojiResourceFactory(
          new EmojiRepository(emojiWithFrequent),
        ),
      });
      const list = getUpdatedList();
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
      helper.showCategory(customCategory, component);
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
      component = await helper.setupPicker({
        onSelection: (emojiId, emoji) => {
          selection = emoji;
        },
      } as Props);
      const list = getUpdatedList();
      const hoverButton = () => list.find(Emoji).at(clickOffset);
      await waitUntil(() => hoverButton().exists());
      hoverButton().simulate('mousedown', helper.leftClick);

      await waitUntil(() => !!selection);
      expect(selection).toBeDefined();
      expect(selection!.id).toEqual(helper.allEmojis[clickOffset].id);
    });

    it('selecting emoji should call recordSelection on EmojiProvider', async () => {
      let selection: OptionalEmojiDescription;
      const emojiResourcePromise = getEmojiResourcePromise() as Promise<
        MockEmojiResource
      >;
      const clickOffset = 10;
      component = await helper.setupPicker({
        onSelection: (emojiId, emoji) => {
          selection = emoji;
        },
        emojiProvider: emojiResourcePromise,
      } as Props);
      const list = getUpdatedList();
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
      await waitUntil(() => helper.findEmoji(getUpdatedList()).length === 2);
      const list = getUpdatedList();
      const emojis = list.find(Emoji);
      expect(emojis).toHaveLength(2);
      // Albania and Algeria emoji displayed
      expect(emojis.at(0).prop('emoji').shortName).toEqual(':flag_al:');
      expect(emojis.at(1).prop('emoji').shortName).toEqual(':flag_dz:');
    });

    it('searching for red car should match emoji via shortName', async () => {
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
      await waitUntil(() => helper.findEmoji(getUpdatedList()).length === 1);
      const list = getUpdatedList();
      const emojis = list.find(Emoji);
      expect(emojis).toHaveLength(1);
      const emojiDescription = emojis.at(0).prop('emoji');
      expect(emojiDescription.name).toEqual('automobile');
      expect(emojiDescription.shortName).toEqual(':red_car:');
    });

    it('searching should disable categories in selector', async () => {
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

      await waitUntil(() => helper.findEmoji(getUpdatedList()).length === 2);
      expect(component.find(CategorySelector).prop('disableCategories')).toBe(
        true,
      );
    });
  });

  describe('upload', () => {
    let consoleError;
    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it('Non-uploading EmojiResource - no upload UI', async () => {
      const emojiProvider = getNonUploadingEmojiResourcePromise();
      component = await helper.setupPicker({ emojiProvider });

      await waitUntil(() => helper.customSectionVisible(component));
      const addEmoji = helper.findStartEmojiUpload(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "without media token" - no upload UI', async () => {
      await waitUntil(() => helper.customSectionVisible(component));
      const addEmoji = helper.findStartEmojiUpload(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "with media token" - upload UI', async () => {
      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      component = await helper.setupPicker({ emojiProvider });
      await helper.showCategory(customCategory, component);
      await waitUntil(() => helper.startEmojiUploadVisible(component));
      const addEmoji = helper.findStartEmojiUpload(component);
      expect(addEmoji.length).toEqual(1);
    });

    it('Upload main flow interaction', async () => {
      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component);
      await waitUntil(() => helper.startEmojiUploadVisible(component));

      // click add
      const addEmoji = helper.findStartEmojiUpload(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      const nameInput = helper.findEmojiNameInput(component);
      nameInput.simulate('focus');
      nameInput.simulate('change', {
        target: {
          value: ':cheese burger:',
        },
      });
      expect(helper.findEmojiNameInput(component).prop('value')).toEqual(
        'cheese_burger',
      );

      // choose file
      const fileChooser = component.find(FileChooser);
      const fileOnChange = fileChooser.prop('onChange');
      expect(fileOnChange).toBeDefined();
      fileOnChange({
        target: {
          files: [createPngFile()],
        },
      } as React.ChangeEvent<any>);
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      const uploadPreview = helper.findUploadPreview(component);
      expect(uploadPreview).toHaveLength(1);
      const uploadPreviewEmoji = uploadPreview.find(Emoji);
      expect(uploadPreviewEmoji).toHaveLength(1);
      let emoji = uploadPreviewEmoji.prop('emoji');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.representation.imagePath).toEqual(pngDataURL);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);

      // upload called on provider
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(1);
      const upload = uploads[0];
      expect(upload.upload).toEqual({
        name: 'Cheese burger',
        shortName: ':cheese_burger:',
        ...pngFileUploadData,
        width: 0, // jsdom fallbacks to width attribute
        height: 0, // jsdom fallbacks to height attribute
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      let { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => helper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);

      const previewEmoji = preview.find(Emoji);
      expect(previewEmoji).toHaveLength(1);

      emoji = previewEmoji.prop('emoji');
      expect(emoji.name).toEqual('Cheese burger');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.fallback).toEqual(':cheese_burger:');
    });

    it('Upload after searching', async () => {
      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      const provider = await emojiProvider;
      await waitUntil(() => helper.searchInputVisible(component));

      // click search
      const searchInput = helper.findSearchInput(component);
      searchInput.simulate('focus');
      // type "cheese burger"
      searchInput.simulate('change', {
        target: {
          value: 'cheese burger',
        },
      });
      // Wait for no matches
      await waitUntil(
        () =>
          !helper.emojisVisible(component, component.find(EmojiPickerList)) &&
          helper.startEmojiUploadVisible(component),
      );

      // click add
      const addEmoji = helper.findStartEmojiUpload(component).first();
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputHasAValue(component));

      // name is "cheese_burger" (from search)
      const nameInput = helper.findEmojiNameInput(component);
      expect(nameInput.prop('value')).toEqual('cheese_burger');

      // choose file
      const fileChooser = component.find(FileChooser);
      const fileOnChange = fileChooser.prop('onChange');
      expect(fileOnChange).toBeDefined();
      fileOnChange({
        target: {
          files: [createPngFile()],
        },
      } as React.ChangeEvent<any>);
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      const uploadPreview = helper.findUploadPreview(component);
      expect(uploadPreview).toHaveLength(1);
      const uploadPreviewEmoji = uploadPreview.find(Emoji);
      expect(uploadPreviewEmoji).toHaveLength(1);
      let emoji = uploadPreviewEmoji.prop('emoji');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.representation.imagePath).toEqual(pngDataURL);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);

      // upload called on provider
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(1);
      const upload = uploads[0];
      expect(upload.upload).toEqual({
        name: 'Cheese burger',
        shortName: ':cheese_burger:',
        ...pngFileUploadData,
        width: 0, // jsdom fallbacks to width attribute
        height: 0, // jsdom fallbacks to height attribute
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      const { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => helper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);

      const previewEmoji = preview.find(Emoji);
      expect(previewEmoji).toHaveLength(1);

      emoji = previewEmoji.prop('emoji');
      expect(emoji.name).toEqual('Cheese burger');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.fallback).toEqual(':cheese_burger:');
    });

    it('Upload cancel interaction', async () => {
      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component);
      await waitUntil(
        () =>
          helper.startEmojiUploadVisible(component) &&
          helper.previewVisible(component),
      );

      // save emoji initially shown in preview
      let preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);
      const initalPreviewEmoji = preview.find(Emoji);
      expect(initalPreviewEmoji).toHaveLength(1);

      // click add
      const addEmoji = helper.findStartEmojiUpload(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      const nameInput = helper.findEmojiNameInput(component);
      nameInput.simulate('focus');
      nameInput.simulate('change', {
        target: {
          value: ':cheese burger:',
        },
      });
      expect(helper.findEmojiNameInput(component).prop('value')).toEqual(
        'cheese_burger',
      );

      // choose file
      const fileChooser = component.find(FileChooser);
      const fileOnChange = fileChooser.prop('onChange');
      expect(fileOnChange).toBeDefined();
      fileOnChange({
        target: {
          files: [createPngFile()],
        },
      } as React.ChangeEvent<any>);
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      const uploadPreview = helper.findUploadPreview(component);
      expect(uploadPreview).toHaveLength(1);
      const uploadPreviewEmoji = uploadPreview.find(Emoji);
      expect(uploadPreviewEmoji).toHaveLength(1);
      let emoji = uploadPreviewEmoji.prop('emoji');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.representation.imagePath).toEqual(pngDataURL);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');
      await waitUntil(() => helper.previewVisible(component));

      // preview is back with previous emoji shown by default
      preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);
      const previewEmoji = preview.find(Emoji);
      expect(previewEmoji).toHaveLength(1);
      expect(previewEmoji.prop('emoji').shortName).toEqual(
        initalPreviewEmoji.prop('emoji').shortName,
      );

      // No uploads occured
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);
    });

    it('Upload error interaction', async () => {
      const emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
        uploadError: 'bad times',
      });
      component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
      });

      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component);
      await waitUntil(
        () =>
          helper.startEmojiUploadVisible(component) &&
          helper.previewVisible(component),
      );

      // save emoji initially shown in preview
      let preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);
      const initalPreviewEmoji = preview.find(Emoji);
      expect(initalPreviewEmoji).toHaveLength(1);

      // click add
      const addEmoji = helper.findStartEmojiUpload(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      const nameInput = helper.findEmojiNameInput(component);
      nameInput.simulate('focus');
      nameInput.simulate('change', {
        target: {
          value: ':cheese burger:',
        },
      });
      expect(helper.findEmojiNameInput(component).prop('value')).toEqual(
        'cheese_burger',
      );

      // choose file
      const fileChooser = component.find(FileChooser);
      const fileOnChange = fileChooser.prop('onChange');
      expect(fileOnChange).toBeDefined();
      fileOnChange({
        target: {
          files: [createPngFile()],
        },
      } as React.ChangeEvent<any>);
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      const uploadPreview = helper.findUploadPreview(component);
      expect(uploadPreview).toHaveLength(1);
      const uploadPreviewEmoji = uploadPreview.find(Emoji);
      expect(uploadPreviewEmoji).toHaveLength(1);
      let emoji = uploadPreviewEmoji.prop('emoji');
      expect(emoji.shortName).toEqual(':cheese_burger:');
      expect(emoji.representation.imagePath).toEqual(pngDataURL);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for error
      await waitUntil(() => helper.uploadErrorVisible(component));

      // Check error displayed
      const uploadError = helper.findUploadError(component);
      expect(uploadError).toHaveLength(1);

      // upload not called on provider
      let uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');

      // wait for preview to return
      await waitUntil(() => helper.previewVisible(component));

      // preview is back with previous emoji shown by default
      preview = helper.findPreview(component);
      expect(preview).toHaveLength(1);
      const previewEmoji = preview.find(Emoji);
      expect(previewEmoji).toHaveLength(1);
      expect(previewEmoji.prop('emoji').shortName).toEqual(
        initalPreviewEmoji.prop('emoji').shortName,
      );

      // No uploads occured
      uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);
    });
  });

  describe('skin tone selection', () => {
    it('should display the tone emoji by default', async () => {
      const list = getUpdatedList();

      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = list.find(Emoji).at(0);
      hoverButton.simulate('mousemove');

      const footer = component.find(EmojiPickerFooter);
      const toneEmoji = footer.find(EmojiButton);
      expect(toneEmoji).toHaveLength(1);
    });

    it('should not display the tone emoji if hideToneSelector is set to true', async () => {
      component = await helper.setupPickerWithoutToneSelector();
      const list = getUpdatedList();
      await waitUntil(() => helper.emojisVisible(component, list));
      const hoverButton = helper.findEmoji(list).at(0);
      hoverButton.simulate('mousemove');

      const footer = component.find(EmojiPickerFooter);
      const toneEmoji = footer.find(EmojiButton);
      expect(toneEmoji).toHaveLength(0);
    });

    it('should display emojis without skin tone variations by default', async () => {
      const list = getUpdatedList();

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

      component = await helper.setupPicker({ emojiProvider });
      const list = getUpdatedList();
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
    let originalLocalStorage;

    let mockStorage: Storage;
    let mockGetItem: jest.Mock<any>;
    let mockSetItem: jest.Mock<any>;

    beforeEach(() => {
      originalLocalStorage = global.window.localStorage;

      mockGetItem = jest.fn();
      mockSetItem = jest.fn();
      mockStorage = {} as Storage;
      mockStorage.getItem = mockGetItem;
      mockStorage.setItem = mockSetItem;

      global.window.localStorage = mockStorage;
    });

    afterEach(() => {
      global.window.localStorage = originalLocalStorage;
    });

    it('should use localStorage to remember tone selection between sessions', async () => {
      const findToneEmojiInNewPicker = async () => {
        component = await helper.setupPicker();
        const list = getUpdatedList();
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
      mockGetItem.mockReturnValue(tone);

      await waitUntil(() => !!mockSetItem.mock.calls.length);
      expect(mockSetItem.mock.calls[0]).toEqual([selectedToneStorageKey, tone]);

      // First picker should have tone set by default
      const handEmoji1 = await findToneEmojiInNewPicker();
      expect(handEmoji1.shortName).toEqual(':raised_hand::skin-tone-3:');

      // Second picker should have tone set by default
      const handEmoji2 = await findToneEmojiInNewPicker();
      expect(handEmoji2.shortName).toEqual(':raised_hand::skin-tone-3:');
    });
  });
});

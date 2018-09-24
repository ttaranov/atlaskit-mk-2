import * as React from 'react';
import { waitUntil } from '@atlaskit/util-common-test';

import * as ImageUtil from '../../../../util/image';

import {
  createPngFile,
  getEmojiResourcePromise,
  getNonUploadingEmojiResourcePromise,
  pngFileUploadData,
  getEmojiResourcePromiseFromRepository,
  siteEmojiFoo,
  mediaEmoji,
  pngDataURL,
} from '../../_test-data';

import Emoji from '../../../../components/common/Emoji';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import FileChooser from '../../../../components/common/FileChooser';
import {} from '../../../../types';
import {
  customCategory,
  customTitle,
  analyticsEmojiPrefix,
  userCustomTitle,
} from '../../../../constants';
import * as helper from './_emoji-picker-test-helpers';
import * as commonHelper from '../common/_common-test-helpers';
import EmojiPickerCategoryHeading from '../../../../components/picker/EmojiPickerCategoryHeading';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EmojiDeletePreview from '../../../../components/common/EmojiDeletePreview';
import { MockEmojiResource } from '@atlaskit/util-data-test';
import EmojiRepository from '../../../../api/EmojiRepository';
import EmojiErrorMessage from '../../../../components/common/EmojiErrorMessage';
import EmojiUploadPreview from '../../../../components/common/EmojiUploadPreview';

/**
 * Skipping 4 tests here that are not working since the jest 23 upgrade
 * TODO: JEST-23
 */

describe('<UploadingEmojiPicker />', () => {
  let firePrivateAnalyticsEvent;

  const safeFindCustomEmojiButton = async component => {
    await waitUntil(() => commonHelper.customEmojiButtonVisible(component));
    return commonHelper.findCustomEmojiButton(component);
  };

  const uploadPreviewShown = component => {
    const uploadPreview = helper.findUploadPreview(component);
    expect(uploadPreview).toHaveLength(1);
    const uploadPreviewEmoji = uploadPreview.find(Emoji);
    // Should show two emoji in EmojiUploadPrevew
    expect(uploadPreviewEmoji).toHaveLength(2);
    let emoji = uploadPreviewEmoji.at(0).prop('emoji');
    expect(emoji.shortName).toEqual(':cheese_burger:');
    expect(emoji.representation.imagePath).toEqual(pngDataURL);
  };

  const chooseFile = (component, file) => {
    const fileChooser = component.find(FileChooser);
    const fileOnChange = fileChooser.prop('onChange');
    expect(fileOnChange).toBeDefined();
    fileOnChange!({
      target: {
        files: [file],
      },
    } as React.ChangeEvent<any>);
    return fileChooser;
  };

  const typeEmojiName = component => {
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
  };

  beforeEach(async () => {
    firePrivateAnalyticsEvent = jest.fn();
  });

  describe('upload', () => {
    let consoleError;
    let emojiProviderPromise;

    beforeEach(() => {
      consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      jest
        .spyOn(ImageUtil, 'parseImage')
        .mockImplementation(() => Promise.resolve(new Image()));

      jest
        .spyOn(ImageUtil, 'hasFileExceededSize')
        .mockImplementation(() => false);

      emojiProviderPromise = getEmojiResourcePromise({
        uploadSupported: true,
      });
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    const navigateToUploadPreview = async providerPromise => {
      const component = await helper.setupPicker({
        emojiProvider: providerPromise,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });

      await providerPromise;
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      return component;
    };

    it('Non-uploading EmojiResource - no upload UI', async () => {
      const emojiProvider = getNonUploadingEmojiResourcePromise();
      const component = await helper.setupPicker({ emojiProvider });

      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );

      const addEmoji = commonHelper.findCustomEmojiButton(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "without media token" - no upload UI', async () => {
      const component = await helper.setupPicker();
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = commonHelper.findCustomEmojiButton(component);
      expect(addEmoji).toHaveLength(0);
    });

    it('UploadingEmojiResource - "with media token" - upload UI', async () => {
      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      const component = await helper.setupPicker({ emojiProvider });
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );

      const addEmoji = await safeFindCustomEmojiButton(component);
      expect(addEmoji.length).toEqual(1);
    });

    it.skip('Upload main flow interaction', async () => {
      const emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

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
        width: 30,
        height: 30,
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      const emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      let { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.trigger`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.file.selected`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.start`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.upload.successful`,
        {
          duration: expect.any(Number),
        },
      );
    });

    it('Upload failure with invalid file', async () => {
      jest
        .spyOn(ImageUtil, 'parseImage')
        .mockImplementation(() => Promise.reject(new Error('file error')));

      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });
      await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      typeEmojiName(component);

      chooseFile(component, createPngFile());
      expect(component.find('FileChooser')).toHaveLength(1);

      await waitUntil(() => helper.errorMessageVisible(component));

      expect(component.find(EmojiErrorMessage).prop('message')).toEqual(
        'Selected image is invalid',
      );
    });

    it('Upload failure with file too big', async () => {
      jest
        .spyOn(ImageUtil, 'hasFileExceededSize')
        .mockImplementation(() => true);

      const emojiProvider = getEmojiResourcePromise({ uploadSupported: true });
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });
      await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      chooseFile(component, createPngFile());
      expect(component.find('FileChooser')).toHaveLength(1);

      await waitUntil(() => helper.errorMessageVisible(component));

      expect(component.find(EmojiErrorMessage).prop('message')).toEqual(
        'Selected image is more than 1 MB',
      );
    });

    it.skip('Upload after searching', async () => {
      const emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
      const component = await helper.setupPicker({
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
        () => !helper.emojisVisible(component, component.find(EmojiPickerList)),
      );

      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);

      // click add
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputHasAValue(component));

      // name is "cheese_burger" (from search)
      const nameInput = helper.findEmojiNameInput(component);
      expect(nameInput.prop('value')).toEqual('cheese_burger');

      // choose file
      chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

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
        width: 30,
        height: 30,
      });
      await waitUntil(() =>
        helper.emojiWithIdVisible(component, upload.emoji.id),
      );

      // new emoji in view
      const newEmojiDescription = provider.getUploads()[0].emoji;
      const emoji = helper.findEmojiWithId(component, newEmojiDescription.id);
      expect(emoji).toHaveLength(1);

      const { name, shortName, fallback } = emoji.prop('emoji');
      expect(name).toEqual('Cheese burger');
      expect(shortName).toEqual(':cheese_burger:');
      expect(fallback).toEqual(':cheese_burger:');

      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with new emoji shown by default
      const preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);
    });

    it('Upload cancel interaction', async () => {
      const emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });
      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);

      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');
      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with previous emoji shown by default
      preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      // No uploads occured
      const uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.trigger`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.file.selected`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.upload.cancel`,
        {},
      );
    });

    it.skip('Upload error interaction', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
        .mockImplementation(() => Promise.reject(new Error('upload error')));

      const emojiProvider = getEmojiResourcePromise({
        uploadSupported: true,
      });
      const component = await helper.setupPicker({
        emojiProvider,
        hideToneSelector: true,
        firePrivateAnalyticsEvent,
      });

      const provider = await emojiProvider;
      await helper.showCategory(customCategory, component, customTitle);
      await waitUntil(() => commonHelper.previewVisible(component));

      // save emoji initially shown in preview
      let preview = commonHelper.findPreview(component);
      expect(preview).toHaveLength(1);

      // click add
      await waitUntil(() =>
        commonHelper.findEmojiPreviewSection(component).exists(),
      );
      const addEmoji = await safeFindCustomEmojiButton(component);
      addEmoji.simulate('click');
      await waitUntil(() => helper.emojiNameInputVisible(component));

      // type name
      typeEmojiName(component);

      // choose file
      chooseFile(component, createPngFile());
      await waitUntil(() => helper.addEmojiButtonVisible(component));

      // upload preview shown
      uploadPreviewShown(component);

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for error
      await waitUntil(() => helper.errorMessageVisible(component));

      // Check error displayed
      expect(component.find(EmojiErrorMessage).prop('message')).toEqual(
        'Upload failed',
      );

      const retryButton = component
        .find(EmojiUploadPreview)
        .find('button')
        .at(0);

      expect(retryButton.text()).toEqual('Retry');

      // upload not called on provider
      let uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      // cancel
      const cancelLink = helper.findCancelLink(component);
      cancelLink.simulate('click');

      // wait for preview to return
      await waitUntil(() => commonHelper.previewVisible(component));

      // preview is back with previous emoji shown by default
      // "add custom emoji" button should appear
      await safeFindCustomEmojiButton(component);

      // No uploads occured
      uploads = provider.getUploads();
      expect(uploads).toHaveLength(0);

      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.trigger`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.file.selected`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.start`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenCalledWith(
        `${analyticsEmojiPrefix}.upload.failed`,
        {},
      );
      expect(firePrivateAnalyticsEvent).toHaveBeenLastCalledWith(
        `${analyticsEmojiPrefix}.upload.cancel`,
        {},
      );
      spy.mockReset();
    });

    it.skip('Retry on upload error', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'uploadCustomEmoji')
        .mockImplementation(() => Promise.reject(new Error('upload error')));

      const component = await navigateToUploadPreview(emojiProviderPromise);
      const provider = await emojiProviderPromise;

      // add emoji
      const addEmojiButton = helper.findAddEmojiButton(component);
      addEmojiButton.simulate('click');

      // wait for error
      await waitUntil(() => helper.errorMessageVisible(component));

      // Check error displayed
      expect(component.find(EmojiErrorMessage).prop('message')).toEqual(
        'Upload failed',
      );

      const retryButton = component
        .find(EmojiUploadPreview)
        .find('button')
        .at(0);

      expect(retryButton.text()).toEqual('Retry');
      expect(spy).toHaveBeenCalledTimes(1);

      // remove mock to make upload successful
      // @ts-ignore: prevent TS from complaining about mockRestore function
      spy.mockRestore();

      retryButton.simulate('click');
      // wait for upload
      await waitUntil(() => provider.getUploads().length > 0);
    });
  });

  describe('delete', () => {
    let getUserProvider;
    beforeEach(() => {
      // Initialise repository with clone of siteEmojis
      const repository = new EmojiRepository(
        JSON.parse(JSON.stringify([mediaEmoji, siteEmojiFoo])),
      );
      getUserProvider = () =>
        getEmojiResourcePromiseFromRepository(repository, {
          currentUser: { id: 'hulk' },
        });
    });

    // Click delete button on user emoji in picker
    const openDeletePrompt = component =>
      component.find(CrossCircleIcon).simulate('click');
    // Click 'Remove' in delete preview
    const clickRemove = component =>
      component
        .find(EmojiDeletePreview)
        .find('button')
        .at(0)
        .simulate('click');

    it('shows the emoji delete preview when the delete button is clicked', async () => {
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      openDeletePrompt(component);
      expect(component.find(EmojiDeletePreview)).toHaveLength(1);
    });

    it('calls #deleteSiteEmoji with the emoji to delete when button is clicked', async () => {
      const spy = jest.spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji');
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      openDeletePrompt(component);
      clickRemove(component);
      // Delete called with user custom emoji
      expect(spy).toHaveBeenCalledWith(siteEmojiFoo);
    });

    it('closes the delete preview onCancel', async () => {
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      await helper.showCategory(customCategory, component, userCustomTitle);
      openDeletePrompt(component);
      const deletePreview = component.find(EmojiDeletePreview);
      // Click 'Cancel'
      deletePreview
        .find('button')
        .at(1)
        .simulate('click');
      expect(component.find(EmojiDeletePreview)).toHaveLength(0);
    });

    it('cannot find deleted emoji from provider', async () => {
      const emojiProvider = getUserProvider();
      const component = await helper.setupPicker({ emojiProvider });
      const provider = await emojiProvider;
      expect(await provider.findById('foo')).toEqual(siteEmojiFoo);
      openDeletePrompt(component);
      clickRemove(component);
      await waitUntil(() => helper.finishDelete(component));
      expect(await provider.findById('foo')).toBeUndefined();
    });

    it('deleting user emoji removes from both sections', async () => {
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      expect(component.find(Emoji)).toHaveLength(3);
      openDeletePrompt(component);
      clickRemove(component);
      await waitUntil(() => helper.finishDelete(component));
      // Emoji removed from 'Your uploads' and 'All uploads'
      expect(component.find(Emoji)).toHaveLength(1);
    });

    it('removes Your Uploads if the only user emoji was deleted', async () => {
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      // show 'Your uploads'
      expect(
        component
          .find(EmojiPickerCategoryHeading)
          .at(0)
          .props().title,
      ).toEqual(userCustomTitle);
      openDeletePrompt(component);
      clickRemove(component);
      // 'Your uploads' title no longer visible
      await waitUntil(() => helper.finishDelete(component));
      expect(
        component
          .find(EmojiPickerCategoryHeading)
          .at(0)
          .props().title,
      ).toEqual(customTitle);
    });

    it('does not remove emoji from list on failure', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      openDeletePrompt(component);
      // Emoji found for 3 in list + 1 in preview
      expect(component.find(Emoji)).toHaveLength(4);
      clickRemove(component);
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      // Same number of emoji
      expect(component.find(Emoji)).toHaveLength(4);
      spy.mockReset();
    });

    it('displays a retry button if call to #deleteSiteEmoji fails', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      openDeletePrompt(component);
      clickRemove(component);
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      const retryButton = component
        .find(EmojiDeletePreview)
        .find('button')
        .at(0);
      expect(retryButton.text()).toEqual('Retry');
      spy.mockReset();
    });

    it('calls #deleteSiteEmoji again on retry', async () => {
      const spy = jest
        .spyOn(MockEmojiResource.prototype, 'deleteSiteEmoji')
        .mockImplementation(() => Promise.resolve(false));
      const component = await helper.setupPicker({
        emojiProvider: getUserProvider(),
      });
      openDeletePrompt(component);
      clickRemove(component);
      const deleteCalls = spy.mock.calls.length;
      // Expect error to occur
      await waitUntil(() => helper.errorMessageVisible(component));
      const retryButton = component
        .find(EmojiDeletePreview)
        .find('button')
        .at(0);
      retryButton.simulate('click');
      // Tries to call #deleteSiteEmoji again
      expect(spy).toHaveBeenCalledTimes(deleteCalls + 1);
      spy.mockReset();
    });
  });
});

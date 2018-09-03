import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider, EmojiPreview, Emoji } from '@atlaskit/emoji';
import EmojiPicker from '../../../picker/EmojiPicker';
import EmojiPickerList from '../../../picker/EmojiPickerList';

import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  newSiteEmojiRepository,
} from '../_test-data';
import { hasSelector } from '@atlaskit/util-data-test';
import {
  setupPicker,
  emojisVisible,
} from '../picker/_emoji-picker-test-helpers';

describe('Media Emoji Handling across components', () => {
  let emojiProvider: Promise<EmojiProvider>;

  beforeEach(() => {
    emojiProvider = getEmojiResourcePromiseFromRepository(
      newSiteEmojiRepository(),
    );
  });

  describe('<EmojiPicker/>', () => {
    it('Media emoji rendered in picker', () => {
      const component = mount(<EmojiPicker emojiProvider={emojiProvider} />);
      return waitUntil(() => hasSelector(component, EmojiPickerList)).then(
        () => {
          const list = component.find(EmojiPickerList);
          expect(list.length, 'List exists').to.equal(1);
          return waitUntil(() => emojisVisible(component, list)).then(() => {
            const emojiDescription = component.find(Emoji).prop('emoji');
            expect(emojiDescription, 'Is media emoji').to.deep.equal(
              mediaEmoji,
            );
            expect(
              component.find('CachingMediaEmoji').length,
              'Rendered via CachingMediaEmoji',
            ).to.equal(1);
          });
        },
      );
    });

    it('Media emoji rendered in picker preview', async () => {
      const component = await setupPicker({ emojiProvider });
      await waitUntil(() => hasSelector(component, EmojiPickerList));
      const list = component.find(EmojiPickerList);
      expect(list.length, 'List exists').to.equal(1);
      await waitUntil(() => emojisVisible(component, list));
      const emoji = component.find(Emoji);
      const emojiDescription = emoji.prop('emoji');
      expect(emojiDescription, 'Is media emoji').to.deep.equal(mediaEmoji);
      expect(
        list.find('CachingMediaEmoji').length,
        'Rendered via CachingMediaEmoji',
      ).to.equal(1);
      let preview = component.find(EmojiPreview);
      expect(preview.length, 'Preview').to.equal(1);

      // Hover to force preview
      emoji.simulate('mousemove');

      await waitUntil(() =>
        hasSelector(component, Emoji, (preview = component.find(EmojiPreview))),
      );
      const previewEmojiDescription = preview.find(Emoji).prop('emoji');
      expect(previewEmojiDescription, 'Is media emoji').to.deep.equal(
        mediaEmoji,
      );
      expect(
        preview.find('CachingMediaEmoji').length,
        'Rendered via CachingMediaEmoji',
      ).to.equal(1);
    });
  });
});

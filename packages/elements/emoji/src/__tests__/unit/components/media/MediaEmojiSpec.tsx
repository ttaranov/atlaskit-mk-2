import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider } from '../../../../api/EmojiResource';
import { CachingMediaEmoji } from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiPicker from '../../../../components/picker/EmojiPicker';
import EmojiPickerList from '../../../../components/picker/EmojiPickerList';
import EmojiPreview from '../../../../components/common/EmojiPreview';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';

import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  mediaEmojiId,
  newSiteEmojiRepository,
} from '../../_test-data';
import { hasSelector } from '../../_emoji-selectors';
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

  describe('<ResourcedEmoji/>', () => {
    it('ResourcedEmoji renders media emoji via CachingEmoji', () => {
      const component = mount(
        <ResourcedEmoji emojiProvider={emojiProvider} emojiId={mediaEmojiId} />,
      );
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emojiDescription = component.find(Emoji).prop('emoji');
        expect(emojiDescription, 'Is media emoji').to.deep.equal(mediaEmoji);
        expect(
          component.find(CachingMediaEmoji).length,
          'Rendered via CachingMediaEmoji',
        ).to.equal(1);
      });
    });
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
              component.find(CachingMediaEmoji).length,
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
        list.find(CachingMediaEmoji).length,
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
        preview.find(CachingMediaEmoji).length,
        'Rendered via CachingMediaEmoji',
      ).to.equal(1);
    });
  });

  describe('<EmojiTypeAhead/>', () => {
    it('Media emoji rendered in type ahead', () => {
      const component = mount(<EmojiTypeAhead emojiProvider={emojiProvider} />);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emojiDescription = component.find(Emoji).prop('emoji');
        expect(emojiDescription, 'Is media emoji').to.deep.equal(mediaEmoji);
        expect(
          component.find(CachingMediaEmoji).length,
          'Rendered via CachingMediaEmoji',
        ).to.equal(1);
      });
    });
  });
});

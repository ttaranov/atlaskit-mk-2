import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider } from '../../../../src/api/EmojiResource';
import { CachingMediaEmoji } from '../../../../src/components/common/CachingEmoji';
import Emoji from '../../../../src/components/common/Emoji';
import ResourcedEmoji from '../../../../src/components/common/ResourcedEmoji';
import EmojiPicker from '../../../../src/components/picker/EmojiPicker';
import EmojiPickerList from '../../../../src/components/picker/EmojiPickerList';
import EmojiPreview from '../../../../src/components/common/EmojiPreview';
import EmojiTypeAhead from '../../../../src/components/typeahead/EmojiTypeAhead';

import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  mediaEmojiId,
  newSiteEmojiRepository,
} from '../../../../src/support/test-data';

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
      return waitUntil(() => component.find(Emoji).length > 0).then(() => {
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
      return waitUntil(() => component.find(EmojiPickerList).length > 0).then(
        () => {
          const list = component.find(EmojiPickerList);
          expect(list.length, 'List exists').to.equal(1);
          return waitUntil(() => list.find(Emoji).length > 0).then(() => {
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

    it('Media emoji rendered in picker preview', () => {
      const component = mount(<EmojiPicker emojiProvider={emojiProvider} />);
      return waitUntil(() => component.find(EmojiPickerList).length > 0).then(
        () => {
          const list = component.find(EmojiPickerList);
          expect(list.length, 'List exists').to.equal(1);
          return waitUntil(() => list.find(Emoji).length > 0).then(() => {
            const emoji = component.find(Emoji);
            const emojiDescription = emoji.prop('emoji');
            expect(emojiDescription, 'Is media emoji').to.deep.equal(
              mediaEmoji,
            );
            expect(
              list.find(CachingMediaEmoji).length,
              'Rendered via CachingMediaEmoji',
            ).to.equal(1);
            const preview = component.find(EmojiPreview);
            expect(preview.length, 'Preview').to.equal(1);

            // Hover to force preview
            emoji.simulate('mousemove');

            return waitUntil(() => preview.find(Emoji).length > 0).then(() => {
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
        },
      );
    });
  });

  describe('<EmojiTypeAhead/>', () => {
    it('Media emoji rendered in type ahead', () => {
      const component = mount(<EmojiTypeAhead emojiProvider={emojiProvider} />);
      return waitUntil(() => component.find(Emoji).length > 0).then(() => {
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

import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider } from '../../../../api/EmojiResource';
import { CachingMediaEmoji } from '../../../../components/common/CachingEmoji';
import Emoji from '../../../../components/common/Emoji';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import EmojiTypeAhead from '../../../../components/typeahead/EmojiTypeAhead';

import {
  getEmojiResourcePromiseFromRepository,
  mediaEmoji,
  mediaEmojiId,
  newSiteEmojiRepository,
} from '../../_test-data';
import { hasSelector } from '@atlaskit/util-data-test';
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

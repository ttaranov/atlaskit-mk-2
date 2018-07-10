import { mount } from 'enzyme';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { waitUntil } from '@atlaskit/util-common-test';

import EmojiResource from '../../../../api/EmojiResource';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import CachingEmoji, {
  CachingMediaEmoji,
} from '../../../../components/common/CachingEmoji';
import { imageEmoji, loadedMediaEmoji, mediaEmoji } from '../../_test-data';
import { hasSelector } from '../../_emoji-selectors';

describe('<CachingEmoji />', () => {
  describe('Non-media emoji', () => {
    it('CachingMediaEmoji not used, just an Emoji rendered', () => {
      const component = mount(<CachingEmoji emoji={imageEmoji} />);
      expect(
        component.find(CachingMediaEmoji).length,
        'No CachingMediaEmoji',
      ).to.equal(0);
      expect(component.find(Emoji).length, 'Emoji found').to.equal(1);
    });
  });

  describe('Media emoji', () => {
    let contextOptions;
    let emojiProviderStub;

    beforeEach(() => {
      emojiProviderStub = sinon.createStubInstance(EmojiResource);
      contextOptions = {
        context: {
          emoji: {
            emojiProvider: emojiProviderStub,
          },
        },
        childContextTypes: {
          emoji: PropTypes.object,
        },
      };
    });

    it('Nothing rendered if missing context', () => {
      const component = mount(<CachingEmoji emoji={mediaEmoji} />);
      expect(
        component.find(CachingMediaEmoji).length,
        'No CachingMediaEmoji',
      ).to.equal(1);
      expect(component.find(Emoji).length, 'No Emoji').to.equal(0);
      expect(
        component.find(EmojiPlaceholder).length,
        'EmojiPlaceholder',
      ).to.equal(1);
    });

    it('Renders direct url if optimistic rendering true', () => {
      emojiProviderStub.optimisticMediaRendering.returns(true);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(
        component.find(CachingMediaEmoji).length,
        'CachingMediaEmoji',
      ).to.equal(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length, 'Emoji').to.equal(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription, 'Exact mediaEmoji returned').to.deep.equal(
          mediaEmoji,
        );
      });
    });

    it('Loads emoji via cache (promise) if optimistic rendering false', () => {
      emojiProviderStub.optimisticMediaRendering.returns(false);
      emojiProviderStub.loadMediaEmoji.returns(
        Promise.resolve(loadedMediaEmoji),
      );
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(
        component.find(CachingMediaEmoji).length,
        'CachingMediaEmoji',
      ).to.equal(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length, 'Emoji').to.equal(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription, 'Exact mediaEmoji returned').to.deep.equal(
          loadedMediaEmoji,
        );
      });
    });

    it('Loads emoji via cache (non-promise) if optimistic rendering false', () => {
      emojiProviderStub.optimisticMediaRendering.returns(false);
      emojiProviderStub.loadMediaEmoji.returns(loadedMediaEmoji);
      const component = mount(
        <CachingEmoji emoji={mediaEmoji} />,
        contextOptions,
      );
      expect(
        component.find(CachingMediaEmoji).length,
        'CachingMediaEmoji',
      ).to.equal(1);
      return waitUntil(() => hasSelector(component, Emoji)).then(() => {
        const emoji = component.find(Emoji);
        expect(emoji.length, 'Emoji').to.equal(1);
        const emojiDescription = emoji.prop('emoji');
        expect(emojiDescription, 'Exact mediaEmoji returned').to.deep.equal(
          loadedMediaEmoji,
        );
      });
    });
  });
});

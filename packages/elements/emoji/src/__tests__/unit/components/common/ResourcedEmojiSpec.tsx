import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';
import { waitUntil } from '@atlaskit/util-common-test';
import Tooltip from '@atlaskit/tooltip';

import { EmojiDescription } from '../../../../types';
import Emoji from '../../../../components/common/Emoji';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { EmojiProvider } from '../../../../api/EmojiResource';

import {
  evilburnsEmoji,
  grinEmoji,
  getEmojiResourcePromise,
} from '../../_test-data';

const findEmoji = component => component.update() && component.find(Emoji);
const emojiVisible = component => findEmoji(component).length === 1;
const emojiVisibleById = (component, id) =>
  emojiVisible(component) && findEmoji(component).prop('emoji').id === id;
const emojiPlaceHolderVisible = component =>
  component.update() && component.find(EmojiPlaceholder).length === 1;

describe('<ResourcedEmoji />', () => {
  it('should render emoji', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id, 'Emoji rendered').to.equal(
        grinEmoji.id,
      );
    });
  });

  it('should render emoji with correct data attributes', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-id')!.value,
      ).to.equal(grinEmoji.id);
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-short-name')!.value,
      ).to.equal('shouldnotbeused');
      expect(
        component
          .find('span[data-emoji-id]')
          .getDOMNode()
          .attributes.getNamedItem('data-emoji-text')!.value,
      ).to.equal('shouldnotbeused');
    });
  });

  it('should not wrap with a tooltip if there is no showTooltip prop', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      const tooltip = component.find(Tooltip);
      expect(tooltip).to.have.length(0);
    });
  });

  it('should wrap with tooltip if showTooltip is set to true', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: 'shouldnotbeused', id: grinEmoji.id }}
        showTooltip={true}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      const tooltip = component.find(Tooltip);
      expect(tooltip).to.have.length(1);
    });
  });

  it('should fallback to shortName if no id', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id, 'Emoji rendered').to.equal(
        grinEmoji.id,
      );
    });
  });

  it('should update emoji on shortName change', () => {
    const component = mount(
      <ResourcedEmoji
        emojiProvider={getEmojiResourcePromise()}
        emojiId={{ shortName: grinEmoji.shortName }}
      />,
    );

    return waitUntil(() => emojiVisible(component)).then(() => {
      expect(findEmoji(component).prop('emoji').id, 'Emoji rendered').to.equal(
        grinEmoji.id,
      );
      component.setProps({
        emojiId: { shortName: evilburnsEmoji.shortName },
      });

      return waitUntil(() =>
        emojiVisibleById(component, evilburnsEmoji.id),
      ).then(() => {
        expect(
          findEmoji(component).prop('emoji').id,
          'Emoji rendered',
        ).to.equal(evilburnsEmoji.id);
      });
    });
  });

  it('unknown emoji', () => {
    let resolver;
    // @ts-ignore Unused var never read, should this be deleted?
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise(resolve => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      resolver();
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        expect(true, 'EmojiPlaceholder found').to.equal(true);
      });
    });
  });

  it('placeholder while loading emoji', () => {
    let resolver;
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise(resolve => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: grinEmoji.shortName, id: grinEmoji.id }}
      />,
    );

    return waitUntil(() => !!resolver).then(() => {
      return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
        resolver(resolverResult);
        return waitUntil(() => emojiVisible(component)).then(() => {
          expect(
            findEmoji(component).prop('emoji').id,
            'Emoji rendered',
          ).to.equal(grinEmoji.id);
        });
      });
    });
  });

  it('placeholder should be wrapped with a tooltip if showTooltip is set to true', () => {
    // @ts-ignore Unused var never read, should this be deleted?
    let resolver;
    // @ts-ignore Unused var never read, should this be deleted?
    let resolverResult;
    const config = {
      promiseBuilder: (result: EmojiDescription) => {
        resolverResult = result;
        return new Promise(resolve => {
          resolver = resolve;
        });
      },
    };
    const component = mount(
      <ResourcedEmoji
        emojiProvider={
          getEmojiResourcePromise(config) as Promise<EmojiProvider>
        }
        emojiId={{ shortName: 'doesnotexist', id: 'doesnotexist' }}
        showTooltip={true}
      />,
    );

    return waitUntil(() => emojiPlaceHolderVisible(component)).then(() => {
      const tooltip = component.find(Tooltip);
      expect(tooltip).to.have.length(1);
    });
  });
});

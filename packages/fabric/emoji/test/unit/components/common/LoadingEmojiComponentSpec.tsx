import { mount } from 'enzyme';
import * as React from 'react';
import { expect } from 'chai';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider } from '../../../../src/api/EmojiResource';
import LoadingEmojiComponent, {
  Props,
  State,
} from '../../../../src/components/common/LoadingEmojiComponent';

class TestLoadingComponent extends LoadingEmojiComponent<Props, State> {
  private loadedEmojiProvider: EmojiProvider;

  renderLoaded(loadedEmojiProvider: EmojiProvider) {
    this.loadedEmojiProvider = loadedEmojiProvider;
    return <div />;
  }
}

describe('<LoadingEmojiComponent />', () => {
  describe('#render', () => {
    it('Nothing rendered if Promise not resolved', () => {
      const providerPromise = new Promise<EmojiProvider>(() => {});
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      expect(component.isEmptyRender(), 'Nothing rendered').to.equal(true);
    });

    it('Rendered once Promise resolved', () => {
      const providerPromise = Promise.resolve({} as EmojiProvider);
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      return waitUntil(() => !component.isEmptyRender()).then(() => {
        expect(component.isEmptyRender(), 'Content rendered').to.equal(false);
      });
    });
  });
});

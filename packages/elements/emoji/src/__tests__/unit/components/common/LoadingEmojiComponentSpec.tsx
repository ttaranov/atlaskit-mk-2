import { mount } from 'enzyme';
import * as React from 'react';

import { waitUntil } from '@atlaskit/util-common-test';

import { EmojiProvider } from '../../../../api/EmojiResource';
import LoadingEmojiComponent, {
  Props,
  State,
} from '../../../../components/common/LoadingEmojiComponent';

class TestLoadingComponent extends LoadingEmojiComponent<Props, State> {
  // @ts-ignore Unused var never read, should this be deleted?
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
      expect(component.isEmptyRender()).toBe(true);
    });

    it('Rendered once Promise resolved', () => {
      const providerPromise = Promise.resolve({} as EmojiProvider);
      const component = mount(
        <TestLoadingComponent emojiProvider={providerPromise} />,
      );
      return waitUntil(
        () => component.update() && !component.isEmptyRender(),
      ).then(() => {
        expect(component.isEmptyRender()).toBe(false);
      });
    });
  });
});

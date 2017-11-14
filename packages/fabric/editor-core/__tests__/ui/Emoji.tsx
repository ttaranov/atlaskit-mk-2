import * as React from 'react';
import { mount } from 'enzyme';
import { EmojiProvider, ResourcedEmoji } from '@atlaskit/emoji';
import ProviderFactory from '../../src/providerFactory';
import Emoji from '../../src/ui/Emoji';

describe('Emoji', () => {

  const emojiProvider = Promise.resolve({} as EmojiProvider);

  it('should render "fallback" if there is no emojiProvider prop', () => {
    const component = mount(
      <Emoji
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan.length).toEqual(1);
    expect(fallbackSpan.text()).toEqual('fallback');
    component.unmount();
  });

  it('should still render resourced emoji if allowTextFallback=true', () => {
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('emojiProvider', emojiProvider);

    const component = mount(
      <Emoji
        providers={providerFactory}
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />
    );

    expect(component.find(ResourcedEmoji).length).toBe(1);
    component.unmount();
  });

  it('should render "fallback" if there is no emojiProvider prop and no fallback', () => {
    const component = mount(
      <Emoji
        allowTextFallback={true}
        shortName=":anything:"
      />
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan.length).toEqual(1);
    expect(fallbackSpan.text()).toEqual(':anything:');
    component.unmount();
  });

  it('should render a EmojiWrapper component if emojiProvider supplied', () => {
    const providerFactory = new ProviderFactory();
    providerFactory.setProvider('emojiProvider', emojiProvider);

    const emojiId = { shortName: ':anything:', fallback: 'fallback', id: 'abc' };
    const component = mount(
      <Emoji
        providers={providerFactory}
        {...emojiId}
      />
    );

    const resourcedEmoji = component.find(ResourcedEmoji);
    expect(resourcedEmoji.length).toEqual(1);
    expect(resourcedEmoji.prop('emojiId')).toEqual(emojiId);
    expect(resourcedEmoji.prop('emojiProvider')).toEqual(emojiProvider);
    component.unmount();
  });

});

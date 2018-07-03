import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { EmojiProvider, ResourcedEmoji } from '@atlaskit/emoji';
import ProviderFactory from '../../../providerFactory';
import Emoji from '../../../ui/Emoji';

describe('Emoji', () => {
  const emojiProvider = Promise.resolve({} as EmojiProvider);

  it('should render "fallback" if there is no emojiProvider prop', () => {
    const component = mount(
      <Emoji
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />,
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan.length).to.equal(1);
    expect(fallbackSpan.text()).to.equal('fallback');
    component.unmount();
  });

  it('should still render resourced emoji if allowTextFallback=true', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const component = mount(
      <Emoji
        providers={providerFactory}
        allowTextFallback={true}
        shortName=":anything:"
        fallback="fallback"
      />,
    );

    expect(component.find(ResourcedEmoji)).to.have.length(1);
    component.unmount();
  });

  it('should render "fallback" if there is no emojiProvider prop and no fallback', () => {
    const component = mount(
      <Emoji allowTextFallback={true} shortName=":anything:" />,
    );

    const fallbackSpan = component.find('span');
    expect(fallbackSpan.length).to.equal(1);
    expect(fallbackSpan.text()).to.equal(':anything:');
    component.unmount();
  });

  it('should render a EmojiWrapper component if emojiProvider supplied', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const emojiId = {
      shortName: ':anything:',
      fallback: 'fallback',
      id: 'abc',
    };
    const component = mount(<Emoji providers={providerFactory} {...emojiId} />);

    const resourcedEmoji = component.find(ResourcedEmoji);
    expect(resourcedEmoji.length).to.equal(1);
    expect(resourcedEmoji.prop('emojiId')).to.deep.equal(emojiId);
    expect(resourcedEmoji.prop('emojiProvider')).to.equal(emojiProvider);
    component.unmount();
  });

  it('should pass fitToHeight down to ResourcedEmoji if there is a provider', () => {
    const providerFactory = ProviderFactory.create({ emojiProvider });

    const emojiId = {
      shortName: ':anything:',
      fallback: 'fallback',
      id: 'abc',
    };
    const component = mount(
      <Emoji providers={providerFactory} fitToHeight={32} {...emojiId} />,
    );

    const resourcedEmoji = component.find(ResourcedEmoji);
    expect(resourcedEmoji.length).to.equal(1);
    expect(resourcedEmoji.prop('fitToHeight')).to.deep.equal(32);
    component.unmount();
  });
});

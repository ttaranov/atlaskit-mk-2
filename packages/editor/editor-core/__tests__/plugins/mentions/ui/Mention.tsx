import * as React from 'react';
import { mount } from 'enzyme';
import { ResourcedMention } from '@atlaskit/mention';
import { ProviderFactory } from '@atlaskit/editor-common';
import Mention from '../../../../src/plugins/mentions/ui/Mention';

describe('@atlaskit/editor-core/ui/Mention', () => {
  it('should render resourced mention', () => {
    const mention = mount(
      <Mention id="abcd-abcd-abcd" text="@Oscar Wallhult" />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('id')).toEqual('abcd-abcd-abcd');
    expect(resourcedMention.prop('text')).toEqual('@Oscar Wallhult');
  });

  it('should not render ResourcedMentionWithProfilecard if profilecardProvider is not set', () => {
    const mentionProvider = Promise.resolve({});
    const providerFactory = ProviderFactory.create({ mentionProvider });

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );
    expect(mention.find('WithProfilecardMention').length).toBe(0);
    mention.unmount();
  });

  it('should pass provider into resourced mention', () => {
    const mentionProvider = Promise.resolve({});
    const providerFactory = ProviderFactory.create({ mentionProvider });

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );
    const resourcedMention = mention.find(ResourcedMention);

    expect(resourcedMention.prop('mentionProvider')).toEqual(mentionProvider);
    mention.unmount();
  });

  it('should not render ResourcedMentionWithProfilecard if profilecardProvider promise is rejected', async () => {
    const profilecardProvider = Promise.reject(new Error());
    const providerFactory = ProviderFactory.create({ profilecardProvider });

    const mention = mount(
      <Mention
        id="abcd-abcd-abcd"
        text="@Oscar Wallhult"
        providers={providerFactory}
      />,
    );

    try {
      await profilecardProvider;
    } catch (err) {
      expect(mention.find('WithProfilecardMention').length).toBe(0);
    }
    mention.unmount();
  });

  ['HipChat', 'all', 'here'].forEach(genericUserId => {
    it(`should not render ResourcedMentionWithProfilecard if id is generic (${genericUserId})`, async () => {
      const profilecardProvider = Promise.resolve({});
      const providerFactory = ProviderFactory.create({ profilecardProvider });

      const mention = mount(
        <Mention
          id={genericUserId}
          text="@Oscar Wallhult"
          providers={providerFactory}
        />,
      );
      await profilecardProvider;

      expect(mention.find('WithProfilecardMention').length).toBe(0);
      mention.unmount();
    });
  });
});

jest.mock('react-lazily-render', () => {
  return {
    default: (data: any) => data.content,
  };
});

import * as React from 'react';
import { mount } from 'enzyme';
import { Provider, Client, ResolveResponse, ObjectState } from '../../..';
import { Card } from '../..';
import { from } from 'rxjs/observable/from';
import { CardWithUrl } from '../../types';
import {
  BlockCardResolvingView,
  BlockCardErroredView,
  BlockCardForbiddenView,
  BlockCardUnauthorisedView,
  BlockCardResolvedView,
  InlineCardResolvedView,
  InlineCardResolvingView,
} from '@atlaskit/media-ui';

function createClient(consequesntStates?: ObjectState[]): Client {
  const client = new Client();
  jest
    .spyOn(client, 'startStreaming')
    .mockReturnValue(
      from([
        { status: 'resolving', services: [] } as ObjectState,
        ...(consequesntStates ? consequesntStates : []),
      ]),
    );
  return client;
}

describe('Card', () => {
  // tslint:disable-next-line:no-console
  console.error = jest.fn();

  it('should render the resolving view when resolving', () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    expect(wrapper.find(BlockCardResolvingView).exists()).toBeTruthy();
  });

  it('should render the errored view when errored', async () => {
    const client = createClient([{ status: 'errored' } as ObjectState]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardErroredView).exists()).toBeTruthy();
  });

  it('should render the errored view when not-found', async () => {
    const client = createClient([{ status: 'not-found' } as ObjectState]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardErroredView).exists()).toBeTruthy();
  });

  it('should render the forbidden view when forbidden', async () => {
    const client = createClient([{ status: 'forbidden' } as ObjectState]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardForbiddenView).exists()).toBeTruthy();
  });

  // LB: Should we skip
  it('should render the unauthorized view when unauthorized', async () => {
    const client = createClient([{ status: 'unauthorized' } as ObjectState]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardUnauthorisedView).exists()).toBeTruthy();
  });

  it('should render the resolved view when resolved', async () => {
    const client = createClient([
      { status: 'resolved', data: {} } as ObjectState,
    ]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView)).toHaveLength(1);
  });

  it('should be able to be selected when inline and resolved', async () => {
    const client = createClient([
      { status: 'resolved', data: {} } as ObjectState,
    ]);
    const wrapper = mount(
      <Card
        appearance="inline"
        isSelected={true}
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(InlineCardResolvedView).props()).toEqual(
      expect.objectContaining({
        isSelected: true,
      }),
    );
  });

  it('should be able to be selected when block and resolved', async () => {
    const client = createClient([
      { status: 'resolved', data: {} } as ObjectState,
    ]);
    const wrapper = mount(
      <Card
        appearance="block"
        isSelected={true}
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView).props()).toEqual(
      expect.objectContaining({
        isSelected: true,
      }),
    );
  });

  it('should reload the object state when the url changes', async () => {
    const client = createClient([
      { status: 'resolved', definitionId: 'a', data: {} } as ObjectState,
    ]);

    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView).exists()).toBeTruthy();

    wrapper.setProps({ url: 'https://www.google.com/' }).update();

    expect(client.startStreaming).toHaveBeenCalledWith(
      'https://www.google.com/',
    );

    expect(wrapper.find(BlockCardResolvedView).exists()).toBeTruthy();
  });

  it('should extract view props from data', async () => {
    const client = createClient([
      {
        status: 'resolved',
        services: [],
        data: {
          name: 'The best of EAC',
          summary:
            'The most popular voted pages and posts from EAC as voted for all time.',
        },
      },
    ]);
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    client.resolve('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView).props()).toEqual(
      expect.objectContaining({
        title: { text: 'The best of EAC' },
        description: {
          text:
            'The most popular voted pages and posts from EAC as voted for all time.',
        },
      }),
    );
  });

  it('should render the resolved view when data is provided', async () => {
    const wrapper = mount(
      <Card appearance="block" data={{ name: 'foobar' }} />,
    );
    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView)).toHaveLength(1);
    expect(wrapper.find(BlockCardResolvedView).props()).toEqual(
      expect.objectContaining({
        title: { text: 'foobar' },
      }),
    );
  });

  it('should render the inline view with props when the appearance is inline and the object is resolving', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="inline"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    wrapper.update();
    expect(wrapper.find(InlineCardResolvingView)).toHaveLength(1);
  });

  it('should render the block view with props when the appearance is inline and the object is resolving', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    wrapper.update();
    expect(wrapper.find(BlockCardResolvingView)).toHaveLength(1);
  });

  it('should render the inline view with props when the appearance is inline', async () => {
    const wrapper = mount(
      <Card appearance="inline" data={{ name: 'foobar' }} />,
    );
    wrapper.update();
    expect(wrapper.find(InlineCardResolvedView)).toHaveLength(1);
    expect(wrapper.find(InlineCardResolvedView).props()).toEqual(
      expect.objectContaining({
        title: 'foobar',
      }),
    );
  });

  it('should render the block view with props when the appearance is block', async () => {
    const wrapper = mount(
      <Card appearance="block" data={{ name: 'foobar' }} />,
    );
    wrapper.update();
    expect(wrapper.find(BlockCardResolvedView)).toHaveLength(1);
    expect(wrapper.find(BlockCardResolvedView).props()).toEqual(
      expect.objectContaining({
        title: { text: 'foobar' },
      }),
    );
  });

  it('should not reload when appearance changes', () => {
    const client = createClient();
    const wrapper = mount<CardWithUrl>(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    expect(client.startStreaming).toHaveBeenCalledTimes(1);

    wrapper.setProps({ appearance: 'inline' }).update();

    expect(client.startStreaming).toHaveBeenCalledTimes(1);

    wrapper.setProps({ appearance: 'block' }).update();

    expect(client.startStreaming).toHaveBeenCalledTimes(1);
  });

  it('should render the data passed by a custom data fetch implementation', async () => {
    const specialCaseUrl = 'http://some.jira.com/board/ISS-1234';

    const customResponse = {
      meta: {
        visibility: 'public',
        access: 'granted',
        auth: [],
        definitionId: 'custom-def',
      },
      data: {
        name: 'Doc 1',
      },
    } as ResolveResponse;

    class CustomClient extends Client {
      fetchData(url: string) {
        if (url === specialCaseUrl) {
          return Promise.resolve(customResponse);
        }
        return super.fetchData(url);
      }
    }

    const wrapper = mount(
      <Provider client={new CustomClient()}>
        <Card appearance="block" url={specialCaseUrl} />
      </Provider>,
    );

    // need this delay because of the promise within customFetch
    await new Promise(resolve => setTimeout(resolve, 1));
    wrapper.update();

    expect(wrapper.find(BlockCardResolvedView).exists()).toBeTruthy();
    expect(wrapper.find(BlockCardResolvedView).props()).toEqual(
      expect.objectContaining({
        title: {
          text: 'Doc 1',
        },
      }),
    );
  });
});

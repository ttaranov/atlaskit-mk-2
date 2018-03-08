jest.mock('react-lazily-render', () => {
  return {
    default: ({ content }) => content,
  };
});

import * as React from 'react';
import { mount } from 'enzyme';
import { SmartCardClient } from '../src/SmartCardClient';
import { SmartCardView } from '../src/SmartCardView';
import {
  SmartCard,
  LoadingView,
  LoadedView,
  ErroredView,
} from '../src/SmartCard';
import LazilyRender from 'react-lazily-render';

function createClientWithNoResponse(): SmartCardClient {
  const client = new SmartCardClient();
  jest.spyOn(client, 'fetch').mockReturnValue(Promise.resolve({ data: {} }));
  return client;
}

function createClientWithErrorResponse(): SmartCardClient {
  const client = new SmartCardClient();
  jest
    .spyOn(client, 'fetch')
    .mockReturnValue(Promise.reject(new Error('Oops.')));
  return client;
}

function createClientWithOKResponse(): SmartCardClient {
  const client = new SmartCardClient();
  jest.spyOn(client, 'fetch').mockReturnValue(Promise.resolve({ data: {} }));
  return client;
}

describe('SmartCard', () => {
  it('should render the loading view when loading', () => {
    const client = createClientWithNoResponse();
    const wrapper = mount(
      <SmartCard client={client} url="https://www.atlassian.com/" />,
    );
    expect(wrapper.find(LoadingView).exists()).toBeTruthy();
  });

  it('should render the errored view when errored', async () => {
    const client = createClientWithErrorResponse();
    const wrapper = mount(
      <SmartCard client={client} url="https://www.atlassian.com/" />,
    );
    wrapper.find(LazilyRender).prop('onRender')();
    try {
      // wait for the data to be loaded
      await client.fetch('https://www.atlassian.com/');
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(ErroredView).exists()).toBeTruthy();
    }
  });

  it('should render an error when there is no client passed', async () => {
    const wrapper = mount(<SmartCard url="https://www.atlassian.com/" />);
    wrapper.find(LazilyRender).prop('onRender')();

    wrapper.update();
    expect(wrapper.find(ErroredView).exists()).toBeTruthy();
  });

  it('should render the card when loaded', async () => {
    const client = createClientWithOKResponse();
    const wrapper = mount(
      <SmartCard client={client} url="https://www.atlassian.com/" />,
    );
    wrapper.find(LazilyRender).prop('onRender')();

    // wait for the data to be loaded
    await client.fetch('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(SmartCardView)).toHaveLength(1);
  });

  it('should reload the data when changed', async () => {
    const client = createClientWithOKResponse();
    const wrapper = mount(
      <SmartCard client={client} url="https://www.atlassian.com/" />,
    );
    wrapper.find(LazilyRender).prop('onRender')();

    // wait for the data to be loaded
    await client.fetch('https://www.atlassian.com/');

    wrapper.update();
    expect(wrapper.find(LoadedView).exists()).toBeTruthy();

    // update the URL
    wrapper.setProps({ url: 'https://www.google.com/' });

    // expect it to have started loading again
    wrapper.update();
    expect(wrapper.find(LoadingView).exists()).toBeTruthy();

    // wait for the data to be loaded
    await client.fetch('https://www.atlassian.com/');

    // expect it to have finished loading again
    wrapper.update();
    expect(wrapper.find(LoadedView).exists()).toBeTruthy();
  });
});

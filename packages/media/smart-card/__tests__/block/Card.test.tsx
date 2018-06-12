jest.mock('react-lazily-render', () => {
  return {
    default: ({ content }) => content,
  };
});

import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { mount } from 'enzyme';
import { Client, ObjectState, ObjectStatus } from '../../src/Client';
import { ResolvingView } from '../../src/block/ResolvingView';
import { ResolvedView } from '../../src/block/ResolvedView';
import { UnauthorisedView } from '../../src/block/UnauthorisedView';
import { ForbiddenView } from '../../src/block/ForbiddenView';
import { ErroredView } from '../../src/block/ErroredView';
import { Card } from '../../src/block/Card';

function isNotResolved(state: ObjectState) {
  return state.status !== 'resolved';
}

function createClient(
  status: ObjectStatus = 'resolved',
  data: {} = {},
): Client {
  const client = new Client();
  jest.spyOn(client, 'get').mockReturnValue(
    Observable.create(observer => {
      observer.next({
        status: 'resolving',
      });
      setTimeout(
        () =>
          observer.next({
            status,
            data,
          }),
        10,
      );
    }),
  );
  return client;
}

describe('Card', () => {
  console.error = jest.fn();

  it('should render an error when there is no client provided', async () => {
    expect(() => {
      mount(<Card url="https://www.atlassian.com/" />);
    }).toThrow('@atlaskit/smart-card: No client provided.');
  });

  it('should render the resolving view when resolving', () => {
    const client = createClient();
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );
    expect(wrapper.find(ResolvingView).exists()).toBeTruthy();
  });

  it('should render the errored view when errored', async () => {
    const client = createClient('errored');
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .takeWhile(state => state.status !== 'errored')
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(ErroredView).exists()).toBeTruthy();
    }
  });

  it('should render the errored view when not-found', async () => {
    const client = createClient('not-found');
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .takeWhile(state => state.status !== 'not-found')
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(ErroredView).exists()).toBeTruthy();
    }
  });

  it('should render the forbidden view when forbidden', async () => {
    const client = createClient('forbidden');
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .takeWhile(state => state.status !== 'forbidden')
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(ForbiddenView).exists()).toBeTruthy();
    }
  });

  it('should render the unauthorised view when unauthorised', async () => {
    const client = createClient('unauthorised');
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .takeWhile(state => state.status !== 'unauthorised')
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(UnauthorisedView).exists()).toBeTruthy();
    }
  });

  it('should render the resolved view when resolved', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .takeWhile(isNotResolved)
      .toPromise();

    wrapper.update();
    expect(wrapper.find(ResolvedView)).toHaveLength(1);
  });

  it('should reload the object state when the url changes', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .takeWhile(isNotResolved)
      .toPromise();

    wrapper.update();
    expect(wrapper.find(ResolvedView).exists()).toBeTruthy();

    // update the URL
    wrapper.setProps({ url: 'https://www.google.com/' });

    // expect it to have started loading again
    wrapper.update();
    expect(wrapper.find(ResolvingView).exists()).toBeTruthy();

    // wait for the data to be loaded
    await client
      .get('https://www.google.com/')
      .takeWhile(isNotResolved)
      .toPromise();

    // expect it to have finished loading again
    wrapper.update();
    expect(wrapper.find(ResolvedView).exists()).toBeTruthy();
  });

  it('should extract view props from data', async () => {
    const client = createClient('resolved', {
      name: 'The best of EAC',
      summary:
        'The most popular voted pages and posts from EAC as voted for all time.',
    });
    const wrapper = mount(
      <Card client={client} url="https://www.atlassian.com/" />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .takeWhile(isNotResolved)
      .toPromise();

    wrapper.update();
    expect(wrapper.find(ResolvedView).props()).toEqual({
      title: { text: 'The best of EAC' },
      description: {
        text:
          'The most popular voted pages and posts from EAC as voted for all time.',
      },
    });
  });
});

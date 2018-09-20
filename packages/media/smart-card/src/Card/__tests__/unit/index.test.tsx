jest.mock('react-lazily-render', () => {
  return {
    default: (data: any) => data.content,
  };
});

import * as React from 'react';
import { Observable } from 'rxjs/Observable';
import { takeWhile } from 'rxjs/operators';
import { mount } from 'enzyme';
import { Client, ObjectState, ObjectStatus } from '../../../Client';
import { BlockCard, InlineCard } from '@atlaskit/media-ui';
import { Card } from '../..';
import { Observer } from 'rxjs/Observer';

function isNotResolved(state: ObjectState) {
  return state.status !== 'resolved';
}

function createClient(
  status: ObjectStatus = 'resolved',
  data: {} = {},
): Client {
  const client = new Client();
  jest.spyOn(client, 'get').mockReturnValue(
    Observable.create((observer: Observer<any>) => {
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
  // tslint:disable-next-line:no-console
  console.error = jest.fn();

  it('should render an error when there is no client provided', async () => {
    expect(() => {
      mount(<Card appearance="block" url="https://www.atlassian.com/" />);
    }).toThrow('@atlaskit/smart-card: No client provided.');
  });

  it('should render the resolving view when resolving', () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    expect(wrapper.find(BlockCard.ResolvingView).exists()).toBeTruthy();
  });

  it('should render the errored view when errored', async () => {
    const client = createClient('errored');
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .pipe(takeWhile(state => state.status !== 'errored'))
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(BlockCard.ErroredView).exists()).toBeTruthy();
    }
  });

  it('should render the errored view when not-found', async () => {
    const client = createClient('not-found');
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .pipe(takeWhile(state => state.status !== 'not-found'))
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(BlockCard.ErroredView).exists()).toBeTruthy();
    }
  });

  it('should render the forbidden view when forbidden', async () => {
    const client = createClient('forbidden');
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .pipe(takeWhile(state => state.status !== 'forbidden'))
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(BlockCard.ForbiddenView).exists()).toBeTruthy();
    }
  });

  it.skip('should render the unauthorized view when unauthorized', async () => {
    const client = createClient('unauthorized');
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    try {
      // wait for the data to be loaded
      await client
        .get('https://www.atlassian.com/')
        .pipe(takeWhile(state => state.status !== 'unauthorized'))
        .toPromise();
    } catch (error) {
      wrapper.update();
      expect(wrapper.find(BlockCard.UnauthorisedView).exists()).toBeTruthy();
    }
  });

  it('should render the resolved view when resolved', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvedView)).toHaveLength(1);
  });

  it('should be able to be selected when inline and resolved', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="inline"
        isSelected={true}
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    wrapper.update();
    expect(wrapper.find(InlineCard.ResolvedView).props()).toEqual(
      expect.objectContaining({
        isSelected: true,
      }),
    );
  });

  it('should be able to be selected when block and resolved', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        isSelected={true}
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvedView).props()).toEqual(
      expect.objectContaining({
        isSelected: true,
      }),
    );
  });

  it('should reload the object state when the url changes', async () => {
    const client = createClient();
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvedView).exists()).toBeTruthy();

    // update the URL
    wrapper.setProps({ url: 'https://www.google.com/' });

    // expect it to have started loading again
    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvingView).exists()).toBeTruthy();

    // wait for the data to be loaded
    await client
      .get('https://www.google.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    // expect it to have finished loading again
    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvedView).exists()).toBeTruthy();
  });

  it('should extract view props from data', async () => {
    const client = createClient('resolved', {
      name: 'The best of EAC',
      summary:
        'The most popular voted pages and posts from EAC as voted for all time.',
    });
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );

    // wait for the data to be loaded
    await client
      .get('https://www.atlassian.com/')
      .pipe(takeWhile(isNotResolved))
      .toPromise();

    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvedView).props()).toEqual(
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
    expect(wrapper.find(BlockCard.ResolvedView)).toHaveLength(1);
    expect(wrapper.find(BlockCard.ResolvedView).props()).toEqual(
      expect.objectContaining({
        title: { text: 'foobar' },
      }),
    );
  });

  it('should render the inline view with props when the appearance is inline and the object is resolving', async () => {
    const client = createClient('resolved');
    const wrapper = mount(
      <Card
        appearance="inline"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    wrapper.update();
    expect(wrapper.find(InlineCard.ResolvingView)).toHaveLength(1);
  });

  it('should render the block view with props when the appearance is inline and the object is resolving', async () => {
    const client = createClient('resolved');
    const wrapper = mount(
      <Card
        appearance="block"
        client={client}
        url="https://www.atlassian.com/"
      />,
    );
    wrapper.update();
    expect(wrapper.find(BlockCard.ResolvingView)).toHaveLength(1);
  });

  it('should render the inline view with props when the appearance is inline', async () => {
    const wrapper = mount(
      <Card appearance="inline" data={{ name: 'foobar' }} />,
    );
    wrapper.update();
    expect(wrapper.find(InlineCard.ResolvedView)).toHaveLength(1);
    expect(wrapper.find(InlineCard.ResolvedView).props()).toEqual(
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
    expect(wrapper.find(BlockCard.ResolvedView)).toHaveLength(1);
    expect(wrapper.find(BlockCard.ResolvedView).props()).toEqual(
      expect.objectContaining({
        title: { text: 'foobar' },
      }),
    );
  });
});

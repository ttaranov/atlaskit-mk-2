import { ActivityResource, ActivityItem } from '@atlaskit/activity';
import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import RecentSearch from '../../../../../../plugins/hyperlink/ui/RecentSearch';
import RecentItem from '../../../../../../plugins/hyperlink/ui/RecentSearch/RecentItem';

/**
 * Provides sample data for this suite of tests.
 */
class MockActivityResource extends ActivityResource {
  constructor() {
    super('', '');
  }

  getRecentItems(): Promise<ActivityItem[]> {
    return Promise.resolve([
      {
        objectId: 'recent1',
        name: 'recent item 1',
        container: 'container 1',
        iconUrl:
          'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
        url: 'recent1-url.com',
      },
      {
        objectId: 'recent2',
        name: 'recent item 2',
        container: 'container 2',
        iconUrl:
          'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
        url: 'recent2-url.com',
      },
      {
        objectId: 'recent3',
        name: 'recent item 3',
        container: 'container 3',
        iconUrl:
          'https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png',
        url: 'recent3-url.com',
      },
    ]);
  }
}

const activityProvider = Promise.resolve(new MockActivityResource());
const timeout = () => new Promise(resolve => setTimeout(resolve, 1));

function pressDownArrowInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch.find('input').simulate('keydown', { keyCode: 40 });
}

function pressReturnInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch.find('input').simulate('keydown', { keyCode: 13 });
}

describe('@atlaskit/editor-core/ui/RecentSearch', () => {
  it('should render a list of recent activity items', async () => {
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
      />,
    );
    await timeout();
    wrapper.update();

    expect(wrapper.find(RecentItem)).toHaveLength(3);
    wrapper.unmount();
  });

  it('should filter recent activity items by input text', async () => {
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
      />,
    );
    await timeout();
    wrapper.update();

    (wrapper.instance() as any).updateInput('recent item 1');
    await timeout();
    wrapper.update();

    expect(wrapper.find(RecentItem)).toHaveLength(1);
    expect(
      wrapper
        .find(RecentItem)
        .at(0)
        .prop('item'),
    ).toHaveProperty('name', 'recent item 1');
    wrapper.unmount();
  });

  it('should submit with selected activity item when clicked', async () => {
    const onSubmit = jest.fn();
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
        onSubmit={onSubmit}
      />,
    );
    await timeout();
    wrapper.update();

    wrapper
      .find(RecentItem)
      .at(1)
      .simulate('mousedown');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent2-url.com', 'recent item 2');
    wrapper.unmount();
  });

  it('should submit with selected activity item when enter is pressed', async () => {
    const onSubmit = jest.fn();
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
        onSubmit={onSubmit}
      />,
    );
    await timeout();
    wrapper.update();

    (wrapper.instance() as any).updateInput('recent');
    await timeout();
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent1-url.com', 'recent item 1');
    wrapper.unmount();
  });

  it('should submit with selected activity item when navigated to via keyboard and enter pressed', async () => {
    const onSubmit = jest.fn();
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
        onSubmit={onSubmit}
      />,
    );
    await timeout();
    wrapper.update();

    pressDownArrowInputField(wrapper);
    pressDownArrowInputField(wrapper);
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent2-url.com', 'recent item 2');
    wrapper.unmount();
  });

  it('should submit arbitrary link', async () => {
    const onSubmit = jest.fn();
    const wrapper = mount(
      <RecentSearch
        activityProvider={activityProvider}
        target={document.body}
        placeholder=""
        onSubmit={onSubmit}
      />,
    );
    await timeout();
    wrapper.update();

    (wrapper.instance() as any).updateInput('example.com');
    pressReturnInputField(wrapper);
    await timeout();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('example.com');
    wrapper.unmount();
  });
});

import * as React from 'react';
import { shallow } from 'enzyme';
import PreQueryState, { Props } from '../../../components/common/PreQueryState';
import NoRecentActivity from '../../../components/NoRecentActivity';
import { makeConfluenceObjectResult } from '../_test-util';
import ResultGroupsComponent from '../../../components/common/ResultGroupsComponent';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    resultsGroups: [],
    searchSessionId: '0',
    renderNoRecentActivity: () => <div id="search link" />,
    renderAdvancedSearchGroup: (analyticsData?) => <div id="search-group" />,
    ...partialProps,
  };

  return shallow(<PreQueryState {...props} />);
}

it('should render no recent activity when there is no recent activity', () => {
  const wrapper = render({});

  expect(wrapper.find(NoRecentActivity).exists()).toBe(true);
  expect(wrapper.find(ResultGroupsComponent).exists()).toBe(false);
});

it('should render recent activities when there is recent activity', () => {
  const wrapper = render({
    resultsGroups: [
      {
        items: [makeConfluenceObjectResult()],
        key: 'recentlyViewedPages',
        titleI18nId: 'recentlyViewedPages',
      },
    ],
  });

  expect(wrapper.find(NoRecentActivity).exists()).toBe(false);
  expect(wrapper.find(ResultGroupsComponent).exists()).toBe(true);
});

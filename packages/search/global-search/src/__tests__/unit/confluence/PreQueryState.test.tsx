import * as React from 'react';
import { shallow } from 'enzyme';
import PreQueryState, {
  Props,
} from '../../../components/confluence/PreQueryState';
import NoRecentActivity from '../../../components/NoRecentActivity';
import { makeConfluenceObjectResult } from '../_test-util';
import RecentActivities from '../../../components/confluence/RecentActivities';

function render(partialProps: Partial<Props>) {
  const props: Props = {
    query: '',
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    searchSessionId: '0',
    ...partialProps,
  };

  return shallow(<PreQueryState {...props} />);
}

it('should render no recent activity when there is no recent activity', () => {
  const wrapper = render({
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
  });

  expect(
    wrapper
      .at(1)
      .dive()
      .find(NoRecentActivity)
      .exists(),
  ).toBe(true);
  expect(wrapper.find(RecentActivities).exists()).toBe(false);
});

it('should render recent activities when there is recent activity', () => {
  const wrapper = render({
    recentlyViewedPages: [makeConfluenceObjectResult()],
  });

  expect(wrapper.find(NoRecentActivity).exists()).toBe(false);
  expect(wrapper.find(RecentActivities).exists()).toBe(true);
});

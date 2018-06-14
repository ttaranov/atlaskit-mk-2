import * as React from 'react';
import { mount } from 'enzyme';
import GlobalQuickSearch from '../src/components/GlobalQuickSearchWrapper';
import { HomeQuickSearchContainer } from '../src/components/home/HomeQuickSearchContainer';
import { ConfluenceQuickSearchContainer } from '../src/components/confluence/ConfluenceQuickSearchContainer';

it('should render the home container with context home', () => {
  const wrapper = mount(<GlobalQuickSearch cloudId="123" context="home" />);

  expect(wrapper.find(HomeQuickSearchContainer).exists()).toBe(true);
});

it('should render the confluence container with context confluence', () => {
  const wrapper = mount(
    <GlobalQuickSearch cloudId="123" context="confluence" />,
  );

  expect(wrapper.find(ConfluenceQuickSearchContainer).exists()).toBe(true);
});

it('should pass through the linkComponent prop', () => {
  const MyLinkComponent = () => <div />;
  const wrapper = mount(
    <GlobalQuickSearch
      cloudId="123"
      context="confluence"
      linkComponent={MyLinkComponent}
    />,
  );

  expect(
    wrapper.find(ConfluenceQuickSearchContainer).prop('linkComponent'),
  ).toBe(MyLinkComponent);
});

import * as React from 'react';
import GlobalQuickSearch from '../../components/GlobalQuickSearchWrapper';
import { HomeQuickSearchContainer } from '../../components/home/HomeQuickSearchContainer';
import { ConfluenceQuickSearchContainer } from '../../components/confluence/ConfluenceQuickSearchContainer';
import { mountWithIntl } from './helpers/_intl-enzyme-test-helper';

it('should render the home container with context home', () => {
  const wrapper = mountWithIntl(
    <GlobalQuickSearch cloudId="123" context="home" />,
  );

  expect(wrapper.find(HomeQuickSearchContainer).exists()).toBe(true);
});

it('should render the confluence container with context confluence', () => {
  const wrapper = mountWithIntl(
    <GlobalQuickSearch cloudId="123" context="confluence" />,
  );

  expect(wrapper.find(ConfluenceQuickSearchContainer).exists()).toBe(true);
});

const MyLinkComponent = class extends React.Component<{
  className: string;
  children: React.ReactNode;
}> {
  render() {
    return <div />;
  }
};

it('should pass through the linkComponent prop', () => {
  const wrapper = mountWithIntl(
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

import * as React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import GlobalQuickSearch, {
  LinkComponent,
} from '../src/components/GlobalQuickSearchWrapper';
import { HomeQuickSearchContainer } from '../src/components/home/HomeQuickSearchContainer';
import { ConfluenceQuickSearchContainer } from '../src/components/confluence/ConfluenceQuickSearchContainer';
import { reduceEachTrailingCommentRange } from 'typescript';

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

const MyLinkComponent = class extends React.Component<{
  className: string;
  children: React.ReactNode;
}> {
  render() {
    return <div />;
  }
};

it('should pass through the linkComponent prop', () => {
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

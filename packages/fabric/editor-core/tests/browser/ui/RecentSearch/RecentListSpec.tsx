import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Spinner from '@atlaskit/spinner';
import RecentList from '../../../../src/ui/RecentSearch/RecentList';
import RecentItem from '../../../../src/ui/RecentSearch/RecentItem';

const noop = () => { };
describe('@atlaskit/editor-core/ui/RecentSearch/RecentList', () => {
  it('should render the list when loaded', () => {
    const items = [{
      objectId: '1',
      name: 'name',
      container: 'container',
      url: 'url',
      iconUrl: 'iconUrl'
    }];

    const component = mount(
      <RecentList
        items={items}
        isLoading={false}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />
    );

    expect(component.find(RecentItem)).to.have.lengthOf(1);
    component.unmount();
  });

  it('should render a spinner when loading', () => {
    const component = mount(
      <RecentList
        isLoading={true}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />
    );

    expect(component.find(Spinner)).to.have.lengthOf(1);
    component.unmount();
  });

  it('should not render a spinner when not loading', () => {
    const component = mount(
      <RecentList
        isLoading={false}
        selectedIndex={-1}
        onSelect={noop}
        onMouseMove={noop}
      />
    );

    expect(component.find(Spinner)).to.have.lengthOf(0);
    component.unmount();
  });

  it('should select the item on selectedIndex', () => {
    const items = [{
      objectId: '1',
      name: 'name',
      container: 'container',
      url: 'url',
      iconUrl: 'iconUrl'
    }, {
      objectId: '2',
      name: 'name',
      container: 'container',
      url: 'url',
      iconUrl: 'iconUrl'
    }];

    const component = mount(
      <RecentList
        items={items}
        isLoading={false}
        selectedIndex={1}
        onSelect={noop}
        onMouseMove={noop}
      />
    );

    expect(component.find(RecentItem)).to.have.lengthOf(2);
    expect(component.find(RecentItem).at(0).props()).to.have.property('selected', false);
    expect(component.find(RecentItem).at(1).props()).to.have.property('selected', true);
    component.unmount();
  });
});

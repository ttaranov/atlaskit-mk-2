import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import RecentItem, { Name, ContainerName } from '../../../../src/ui/RecentSearch/RecentItem';

const noop = () => {};
describe('@atlaskit/editor-core/ui/RecentSearch/RecentItem', () => {
  it('should render the item', () => {
    const item = {
      objectId: '1',
      name: 'name',
      container: 'container',
      url: 'url',
      iconUrl: 'iconUrl'
    };

    const component = mount(
      <RecentItem
        item={item}
        selected={false}
        onSelect={noop}
        onMouseMove={noop}
      />
    );

    expect(component.find(Name).text()).to.equal('name');
    expect(component.find(ContainerName).text()).to.equal('container');
    component.unmount();
  });
});

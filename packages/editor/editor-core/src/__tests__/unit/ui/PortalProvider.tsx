import * as React from 'react';
import { mount } from 'enzyme';
import { PortalProvider, PortalRenderer } from '../../../ui/PortalProvider';

const Component = () => <div>My component</div>;

describe.skip('PortalProvider', () => {
  let place;
  let place2;
  beforeEach(() => {
    place = document.body.appendChild(document.createElement('div'));
    place2 = document.body.appendChild(document.createElement('div'));
  });

  afterEach(() => {
    place.parentNode.removeChild(place);
    place2.parentNode.removeChild(place2);
  });

  it('should render a component successfully', () => {
    let portalProviderAPI;
    const wrapper = mount(
      <PortalProvider
        render={api => {
          portalProviderAPI = api;
          return <PortalRenderer portalProviderAPI={api} />;
        }}
      />,
    );

    portalProviderAPI.render(<Component />, place);
    wrapper.update();

    expect(wrapper.find(Component).length).toBe(1);
  });

  it('should render several components successfully', () => {
    let portalProviderAPI;
    const wrapper = mount(
      <PortalProvider
        render={api => {
          portalProviderAPI = api;
          return <PortalRenderer portalProviderAPI={api} />;
        }}
      />,
    );

    portalProviderAPI.render(<Component />, place);
    portalProviderAPI.render(<Component />, place2);
    wrapper.update();
    expect(wrapper.find(Component).length).toBe(2);
  });

  it('should destroy a component successfully', () => {
    let portalProviderAPI;
    const wrapper = mount(
      <PortalProvider
        render={api => {
          portalProviderAPI = api;
          return <PortalRenderer portalProviderAPI={api} />;
        }}
      />,
    );

    portalProviderAPI.render(<Component />, place);
    wrapper.update();

    portalProviderAPI.remove(place);
    wrapper.update();

    expect(wrapper.find(Component).length).toBe(0);
  });
});

import * as React from 'react';
import { shallow } from 'enzyme';
import { Content } from '../../src/newgen/content';
import { ContentWrapper } from '../../src/newgen/styled';

describe('<Content />', () => {
  jest.useFakeTimers();

  const setup = () => {
    const component = shallow(
      <Content onClick={jest.fn()}>
        <div />
        <div />
      </Content>,
    );

    return {
      component,
    };
  };

  it('should render children', () => {
    const { component } = setup();

    expect(component.find('div')).toHaveLength(2);
  });

  it('should handle mouse move', () => {
    const { component } = setup();

    expect(component.state('showControls')).toBeTruthy();
    component.find(ContentWrapper).simulate('mouseMove');
    jest.runOnlyPendingTimers();
    expect(component.state('showControls')).toBeFalsy();
  });

  it('should pass controls visibility down to <ContentWrapper />', () => {
    const { component } = setup();

    expect(component.find(ContentWrapper).prop('showControls')).toBeTruthy();
  });

  it('should clear the timeout when component gets unmounted', () => {
    const { component } = setup();
    const clearTimeout = jest.fn();

    component.instance()['clearTimeout'] = clearTimeout;
    component.unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(1);
  });
});

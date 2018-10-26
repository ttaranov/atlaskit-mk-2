//@flow
import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { name } from '../../../../../package.json';
import Navigator from '../../../../components/navigators/navigator';

const createAnalyticsEventMock = jest.fn();

function NavigatorWithAnalytics(props) {
  return (
    <Navigator createAnalyticsEvent={createAnalyticsEventMock} {...props} />
  );
}

describe(`${name} - navigator`, () => {
  it('should render the node passed as children', () => {
    const wrapper = mount(
      <NavigatorWithAnalytics createAnalyticsEvent={createAnalyticsEventMock}>
        <div>$</div>
      </NavigatorWithAnalytics>,
    );
    expect(wrapper.text()).toBe('$');
  });
  it('should pass in ariaLabel as ariaLabel to button', () => {
    const wrapper = mount(<NavigatorWithAnalytics ariaLabel="pehla" />);
    expect(wrapper.find(Button).prop('ariaLabel')).toBe('pehla');
  });
  it('should pass in isDisabled as ariaLabel to button', () => {
    const wrapper = mount(<NavigatorWithAnalytics isDisabled />);
    expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
  });
  it('should call the provided onClick function with the ariaLabel value', () => {
    const onClickSpy = jest.fn();
    const wrapper = mount(
      <NavigatorWithAnalytics onClick={onClickSpy} ariaLabel="label" />,
    );
    wrapper.simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
});

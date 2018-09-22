//@flow
import React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { name } from '../../../../../package.json';
import Navigator from '../../../../components/navigators/navigator';

describe(`${name} - navigator`, () => {
  it('should render the node passed as children', () => {
    const wrapper = mount(
      <Navigator>
        <div>$</div>
      </Navigator>,
    );
    expect(wrapper.text()).toBe('$');
  });
  it('should pass in label as ariaLabel to button', () => {
    const wrapper = mount(<Navigator label="pehla" />);
    expect(wrapper.find(Button).prop('ariaLabel')).toBe('pehla');
  });
  it('should pass in isDisabled as ariaLabel to button', () => {
    const wrapper = mount(<Navigator isDisabled />);
    expect(wrapper.find(Button).prop('isDisabled')).toBe(true);
  });
  it('should call the provided onClick function with the label value', () => {
    const onClickSpy = jest.fn();
    const wrapper = mount(<Navigator onClick={onClickSpy} label="label" />);
    wrapper.simulate('click');
    expect(onClickSpy).toHaveBeenCalledWith('label');
  });
});

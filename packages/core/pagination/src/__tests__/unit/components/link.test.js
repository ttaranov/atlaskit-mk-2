//@flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import Button from '@atlaskit/button';
import Link from '../../../components/link';
import { name } from '../../../../package.json';

describe(`${name} - Link component`, () => {
  it('renders child props', () => {
    const wrapper = shallow(<Link>1</Link>);
    expect(wrapper.text()).toBe('1');
  });
  it('passes in isSelected props to button', () => {
    const wrapper = mount(<Link isSelected>1</Link>);
    const button = wrapper.find(Button);
    expect(button.prop('isSelected')).toBe(true);
  });
  it('calls onClick on click', () => {
    const onClickSpy = jest.fn();
    const wrapper = mount(<Link onClick={onClickSpy}>1</Link>);
    wrapper.simulate('click');
    expect(onClickSpy).toHaveBeenCalled();
  });
  it('renders subbtle button', () => {
    const wrapper = mount(<Link>1</Link>);
    const button = wrapper.find(Button);
    expect(button.prop('appearance')).toBe('subtle');
  });
  it('passes in selected props to button', () => {
    const wrapper = mount(<Link href="#href">1</Link>);
    const button = wrapper.find(Button);
    expect(button.prop('href')).toBe('#href');
  });
});

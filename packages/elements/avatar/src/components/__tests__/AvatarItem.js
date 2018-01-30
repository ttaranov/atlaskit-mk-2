// @flow
/* eslint-disable  mocha/no-skipped-tests */
import React from 'react';
import { shallow, mount } from 'enzyme';

import AvatarItem from '../AvatarItem';

describe('AvatarItem', () => {
  it('should not fail if avatar prop is not provided', () => {
    expect(() => mount(<AvatarItem />)).not.toThrow();
  });

  it('should be possible to create a component', () => {
    const wrapper = shallow(<AvatarItem />);

    expect(wrapper).not.toBe(undefined);
  });

  it('should be able to render a single child', () => {
    const wrapper = shallow(
      <AvatarItem>
        <div className="test" />
      </AvatarItem>,
    );

    expect(wrapper.find('.test')).toHaveLength(1);
  });

  it('should be able to render all children', () => {
    const length = 5;
    const children = Array.from(Array(length).keys()).map(index => (
      <div key={index} className={`test-${index}`} />
    ));
    const wrapper = shallow(<AvatarItem>{children}</AvatarItem>);

    for (let i = 0; i < length; i++) {
      expect(wrapper.find(`.test-${i}`)).toHaveLength(1);
    }
  });

  describe('onClick property', () => {
    it('should propagate clicks to `onClick` prop', () => {
      const mockCallback = jest.fn();
      const wrapper = mount(<AvatarItem onClick={mockCallback} />);

      wrapper.simulate('click');

      expect(mockCallback.mock.calls).toHaveLength(1);
    });

    it('should propagate correct arguments to `onClick` prop', () => {
      const mockCallback = jest.fn();
      const wrapper = mount(<AvatarItem onClick={mockCallback} />);

      wrapper.simulate('click');

      const args = mockCallback.mock.calls[0][0];
      expect(args).toBeDefined();
      expect(args).toHaveProperty('item');
      expect(args).toHaveProperty('event');
    });

    it('should not propagate clicks to `onClick` prop if disabled', () => {
      const mockCallback = jest.fn();
      const wrapper = mount(<AvatarItem isDisabled onClick={mockCallback} />);

      wrapper.simulate('click');

      expect(mockCallback.mock.calls).toHaveLength(0);
    });
  });
});

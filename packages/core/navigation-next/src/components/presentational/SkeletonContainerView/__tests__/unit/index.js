// @flow
import React from 'react';
import { mount } from 'enzyme';
import SkeletonContainerView from '../../index';

describe('SkeletonContainerView', () => {
  it('should return null if the component was called without a type', () => {
    const wrapper = mount(<SkeletonContainerView />);
    expect(wrapper.html()).toBe(null);
  });

  it('should return product if it receives type as `product`', () => {
    const wrapper = mount(<SkeletonContainerView type={'product'} />);
    expect(wrapper.find('ProductNavigationTheme')).toHaveLength(1);
  });

  it('should return container if it receives type as `container`', () => {
    const wrapper = mount(<SkeletonContainerView type={'container'} />);
    expect(wrapper.find('ContainerNavigationTheme')).toHaveLength(1);
  });
});

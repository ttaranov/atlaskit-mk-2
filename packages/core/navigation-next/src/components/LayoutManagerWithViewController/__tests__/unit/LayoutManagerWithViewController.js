// @flow

import React from 'react';
import { mount } from 'enzyme';

import LayoutManagerWithViewController from '../../LayoutManagerWithViewController';

import {
  DefaultGlobalNavigation,
  ProjectSwitcher,
} from '../../../../../examples/shared/components';

import { NavigationProvider } from '../../../../index';

describe('LayoutManagerWithViewController', () => {
  let wrapper;

  beforeEach(() => {
    jest.spyOn(global.localStorage, 'setItem');
    jest.spyOn(global.localStorage, 'getItem');

    wrapper = mount(
      <NavigationProvider initialPeekViewId="root/index" isDebugEnabled={false}>
        <LayoutManagerWithViewController
          customComponents={{ ProjectSwitcher }}
          globalNavigation={DefaultGlobalNavigation}
        >
          <p>
            Children requires to have `NavigationProvider` as a parent Because
            of `unstated`. This is an issue
          </p>
        </LayoutManagerWithViewController>
      </NavigationProvider>,
    );
  });

  afterEach(() => {
    global.localStorage.setItem.mockRestore();
    global.localStorage.getItem.mockRestore();
  });

  it('should render global navigation based on using `globalNavigation` as a reference', () => {
    expect(wrapper.find(DefaultGlobalNavigation).length).toBe(1);
  });

  describe('LayerInitialised', () => {
    it('should be initialised when `onInitialised` method is called', () => {
      const layerInitialised = wrapper.find('LayerInitialised');

      expect(layerInitialised.props().initialised).toBe(false);

      layerInitialised.props().onInitialised();
      wrapper.update();

      expect(wrapper.find('LayerInitialised').props().initialised).toBe(true);
    });
  });

  it('should render skeleton using `product` context', () => {
    expect(
      wrapper
        .find('SkeletonItem')
        .first()
        .props().theme.context,
    ).toBe('product');
  });
});

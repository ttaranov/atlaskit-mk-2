// @flow
import React from 'react';
import { mount } from 'enzyme';

import UIController from '../UIController';

const initialState = {
  isPeekHinting: true,
  isPeeking: true,
  isCollapsed: true,
  productNavWidth: 100,
};

describe('NavigationNext UI Controller: UIController', () => {
  it('should add the default state if a cache controller was not passed', () => {
    const uiController = new UIController(initialState);
    expect(uiController.state).toEqual({
      isCollapsed: true,
      isPeekHinting: true,
      isPeeking: true,
      isResizing: false,
      productNavWidth: 100,
    });
  });
});

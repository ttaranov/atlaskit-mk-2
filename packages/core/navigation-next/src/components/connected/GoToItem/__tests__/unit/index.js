// @flow

import React from 'react';
import { mount, shallow } from 'enzyme';
import GoToItem, { GoToItemBase } from '../../index';

describe('GoToItemBase', () => {
  let mockNavigationUIController: any;
  let mockNavigationViewController: any;
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockNavigationUIController = {
      state: {},
      unPeek: Function.prototype,
    };
    mockNavigationViewController = {
      state: {},
      setView: jest.fn(),
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(
      <GoToItemBase
        navigationUIController={mockNavigationUIController}
        navigationViewController={mockNavigationViewController}
        goTo="another-view"
        text="Another View"
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});

describe('GoToItem', () => {});

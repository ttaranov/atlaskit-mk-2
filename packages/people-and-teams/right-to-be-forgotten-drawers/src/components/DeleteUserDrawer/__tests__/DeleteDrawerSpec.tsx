import * as React from 'react';
import { shallow } from 'enzyme';

import { catherineHirons } from '../../../mocks/users';
import DeleteUserDrawer from '../DeleteUserDrawer';

const defaultProps = {
  isOpen: false,
  deleteAccount: jest.fn(),
  onClose: jest.fn(),
  user: catherineHirons,
  currentUserId: catherineHirons.id,
};

const render = (props = {}) =>
  shallow(<DeleteUserDrawer {...defaultProps} {...props} />);

test('isOpen snapshot', () => {
  expect(render()).toMatchSnapshot();
});

describe('nextScreen()', () => {
  test('Goes to next screen', () => {
    const wrapper = render();
    const screens = wrapper.instance().screens;
    wrapper.instance().nextScreen();
    wrapper.update();
    expect(
      screens.findIndex(s => s.id === wrapper.state().currentScreenId),
    ).toBe(1);
  });

  test('No-op if on last screen', () => {
    const wrapper = render();
    const screens = wrapper.instance().screens;
    const lastScreenIdx = screens.length - 1;
    wrapper.setState({ currentScreenId: screens[lastScreenIdx].id });
    wrapper.instance().nextScreen();
    wrapper.update();
    expect(
      screens.findIndex(s => s.id === wrapper.state().currentScreenId),
    ).toBe(lastScreenIdx);
  });
});

describe('previousScreen()', () => {
  test('Goes to previous screen', () => {
    const wrapper = render();
    const screens = wrapper.instance().screens;
    const lastScreenIdx = screens.length - 1;
    wrapper.setState({ currentScreenId: screens[lastScreenIdx].id });
    wrapper.instance().previousScreen();
    wrapper.update();
    expect(
      screens.findIndex(s => s.id === wrapper.state().currentScreenId),
    ).toBe(lastScreenIdx - 1);
  });

  test('Goes to next screen', () => {
    const wrapper = render();
    const screens = wrapper.instance().screens;
    wrapper.instance().previousScreen();
    wrapper.update();
    expect(
      screens.findIndex(s => s.id === wrapper.state().currentScreenId),
    ).toBe(0);
  });
});

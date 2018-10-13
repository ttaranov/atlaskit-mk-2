import * as React from 'react';
import { shallow } from 'enzyme';

import { catherineHirons } from '../../../mocks/users';
import RightToBeForgottenDrawer from '../RightToBeForgottenDrawer';

const defaultProps = {
  isOpen: false,
  deleteAccount: jest.fn(),
  onClose: jest.fn(),
  currentUserId: catherineHirons.id,
  screens: ['a', 'b', 'c'],
};

const render = (props = {}) =>
  shallow(<RightToBeForgottenDrawer {...defaultProps} {...props} />);

test('isOpen snapshot', () => {
  expect(render()).toMatchSnapshot();
});

describe('nextScreen()', () => {
  test('Goes to next screen', () => {
    const wrapper = render();

    expect(wrapper.state().currentScreenIdx).toBe(0);

    wrapper.instance().nextScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(1);
  });

  test('No-op if on last screen', () => {
    const wrapper = render();
    const { screens } = defaultProps;
    const lastScreenIdx = screens.length - 1;

    wrapper.setState({ currentScreenIdx: lastScreenIdx });
    wrapper.instance().nextScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(lastScreenIdx);
  });
});

describe('previousScreen()', () => {
  test('Goes to previous screen', () => {
    const wrapper = render();
    const { screens } = defaultProps;
    const lastScreenIdx = screens.length - 1;

    wrapper.setState({ currentScreenIdx: lastScreenIdx });
    wrapper.instance().previousScreen();
    wrapper.update();

    expect(wrapper.state().currentScreenIdx).toBe(lastScreenIdx - 1);
  });

  test('Goes to next screen', () => {
    const wrapper = render();
    wrapper.instance().previousScreen();
    wrapper.update();
    expect(wrapper.state().currentScreenIdx).toBe(0);
  });
});

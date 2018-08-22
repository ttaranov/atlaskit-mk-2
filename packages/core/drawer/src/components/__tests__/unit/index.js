// @flow
import React from 'react';
import { mount } from 'enzyme';

import Drawer from '../../index';

describe('Drawer Transitions', () => {
  beforeEach(() => {
    jest.spyOn(global.window, 'addEventListener');
    jest.spyOn(global.window, 'removeEventListener');
  });

  afterEach(() => {
    global.window.addEventListener.mockRestore();
    global.window.removeEventListener.mockRestore();
  });

  it('should add a keydown listener', () => {
    mount(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );

    const eventHandler = window.addEventListener.mock.calls.find(
      e => e[0] === 'keydown',
    )[1];

    expect(typeof eventHandler).toBe('function');
  });

  it('should remove a keydown listener if the component is unmounted', () => {
    mount(
      <Drawer isOpen width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    ).unmount();

    expect(global.window.removeEventListener).toHaveBeenCalled();
  });

  it('should call onClose if user press ESC', () => {
    const onClose = jest.fn();
    const event = { key: 'Escape' };

    mount(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const eventHandler = window.addEventListener.mock.calls.find(
      e => e[0] === 'keydown',
    )[1];

    eventHandler(event);

    expect(onClose.mock.calls[0][0]).toBe(event);
  });

  it('should call onKeyDown if user press ESC', () => {
    const onKeyDown = jest.fn();
    const event = { key: 'Escape' };

    mount(
      <Drawer isOpen onKeyDown={onKeyDown} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const [eventName, eventHandler] = window.addEventListener.mock.calls.find(
      e => e[0] === 'keydown',
    );

    eventHandler(event);

    expect(eventName).toBe('keydown');
    expect(onKeyDown).toHaveBeenCalledWith(event);
  });

  it("should NOT call onClose if user doesn't press ESC", () => {
    const onClose = jest.fn();
    const event = { key: 'another-key' };

    mount(
      <Drawer isOpen onClose={onClose} width="wide">
        <code>Drawer contents</code>
      </Drawer>,
    );
    const eventHandler = window.addEventListener.mock.calls.find(
      e => e[0] === 'keydown',
    )[1];

    eventHandler(event);

    expect(onClose).not.toHaveBeenCalled();
  });
});

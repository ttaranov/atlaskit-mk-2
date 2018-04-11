import * as React from 'react';
import { mount } from 'enzyme';
import { CSSTransition } from 'react-transition-group';

import Flash from '../../src/internal/flash';

jest.useFakeTimers();

describe('Flash', () => {
  const renderFlash = () => (
    <Flash>
      <span>my background will flash</span>
    </Flash>
  );

  it('should flash background', () => {
    const flash = mount(renderFlash());

    (flash.instance() as Flash).flash();

    flash.update();

    expect(flash.state('flashing')).toBeTruthy();
    expect(flash.find(CSSTransition).prop('in')).toBeTruthy();

    jest.runTimersToTime(700);
    flash.update();

    expect(flash.state('flashing')).toBeFalsy();
    expect(flash.find(CSSTransition).prop('in')).toBeFalsy();
  });

  it('should restart animation when calling flash during an animation', () => {
    const flash = mount(renderFlash());

    (flash.instance() as Flash).flash();
    expect(flash.state('flashing')).toBeTruthy();

    jest.runTimersToTime(350);
    (flash.instance() as Flash).flash();

    expect(flash.state('flashing')).toBeTruthy();
    jest.runTimersToTime(700);

    expect(flash.state('flashing')).toBeFalsy();
  });
});

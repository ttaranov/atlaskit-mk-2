import * as React from 'react';
import { mount } from 'enzyme';
import { CSSTransition } from 'react-transition-group';

import FlashAnimation from '../../../internal/flash-animation';

jest.useFakeTimers();

describe('Flash', () => {
  const renderFlash = () => (
    <FlashAnimation>
      <span>my background will flash</span>
    </FlashAnimation>
  );

  it('should flash background', () => {
    const flash = mount(renderFlash());

    (flash.instance() as FlashAnimation).flash();

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

    (flash.instance() as FlashAnimation).flash();
    expect(flash.state('flashing')).toBeTruthy();

    jest.runTimersToTime(350);
    (flash.instance() as FlashAnimation).flash();

    expect(flash.state('flashing')).toBeTruthy();
    jest.runTimersToTime(700);

    expect(flash.state('flashing')).toBeFalsy();
  });
});

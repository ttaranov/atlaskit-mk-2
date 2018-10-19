import * as React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '../../../newgen/shortcut';

export class KeyboardEventWithKeyCode extends KeyboardEvent {
  constructor(type: string, options: any) {
    super(type, options);
  }
}
/**
 * Skipped two tests in here that are failing due something with emitting key events
 * TODO: JEST-23 Fix these tests
 */
describe('Shortcut', () => {
  const originalEventListener = document.addEventListener;

  afterEach(() => {
    document.addEventListener = originalEventListener;
  });

  it('should de-register the key event listener on unmount', done => {
    document.removeEventListener = (name: string) => {
      expect(name).toEqual('keydown');
      done();
    };

    const el = mount(
      <div>
        <Shortcut keyCode={37} handler={() => {}} />
      </div>,
    );

    el.unmount();
  });

  it.skip('should execute handler', done => {
    mount(
      <div>
        <Shortcut keyCode={37} handler={done} />
      </div>,
    );

    const e = new KeyboardEventWithKeyCode('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 37,
    });
    document.dispatchEvent(e);
  });
});

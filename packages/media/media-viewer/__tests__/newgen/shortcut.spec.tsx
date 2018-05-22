import * as React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '../../src/newgen/shortcut';

describe('Shortcut', () => {
  const originalEventListener = document.addEventListener;

  afterEach(() => {
    document.addEventListener = originalEventListener;
  });

  it('should de-register the key event listener on unmount', done => {
    document.removeEventListener = name => {
      expect(name).toEqual('keydown');
      done();
    };

    const el = mount(
      <div>
        <Shortcut keyCode="Escape" handler={() => {}} />
      </div>,
    );

    el.unmount();
  });

  it('should execute handler', done => {
    mount(
      <div>
        <Shortcut keyCode="Escape" handler={done} />
      </div>,
    );

    const e = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      key: 'Escape',
    });
    document.dispatchEvent(e);
  });
});

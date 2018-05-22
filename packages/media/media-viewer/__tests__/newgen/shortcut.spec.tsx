import * as React from 'react';
import { mount } from 'enzyme';
import { Shortcut } from '../../src/newgen/shortcut';

describe('Shortcut', () => {
  it('should register key event listener on mount', done => {
    document.addEventListener = name => {
      expect(name).toEqual('keydown');
      done();
    };

    const el = mount(
      <div>
        <Shortcut keyCode="Escape" handler={() => {}} />
      </div>,
    );

    el.simulate('keyDown', {
      key: 'Escape',
    });
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
});

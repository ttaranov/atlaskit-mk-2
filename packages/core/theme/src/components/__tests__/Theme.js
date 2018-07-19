// @flow

import React, { Fragment } from 'react';
import { mount } from 'enzyme';
import { Theme } from '../..';

test('no parent', done => {
  mount(
    <Theme>
      {t => {
        expect(t).toEqual({});
        done();
      }}
    </Theme>,
  );
});

test('has parent', done => {
  const backgroundColor = '#fff';
  const textColor = '#000';
  mount(
    <Theme values={{ backgroundColor }}>
      <Theme values={{ textColor }}>
        {t => {
          expect(t).toEqual({ backgroundColor, textColor });
          done();
        }}
      </Theme>
    </Theme>,
  );
});

test('functions', () => {
  const backgroundColor = (state, { mode }) => (mode === 'dark' ? 3 : 1);
  const textColor = (state, { mode }) => (mode === 'dark' ? 4 : 2);
  const MyTheme = ({ mode }: { mode?: string }) => (
    <Theme values={{ backgroundColor, mode, textColor }}>
      {t => (
        <Fragment>
          {t.backgroundColor()}
          {t.textColor()}
        </Fragment>
      )}
    </Theme>
  );
  const tree = mount(
    <div>
      <Theme>
        <MyTheme />
        <MyTheme mode="dark" />
      </Theme>
    </div>,
  );
  expect(tree.text()).toBe('1234');
});

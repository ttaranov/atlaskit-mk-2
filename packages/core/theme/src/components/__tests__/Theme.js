// @flow

import React from 'react';
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
    <Theme theme={t => ({ backgroundColor, ...t })}>
      <Theme theme={t => ({ ...t, textColor })}>
        {t => {
          expect(t).toEqual({ backgroundColor, textColor });
          done();
        }}
      </Theme>
    </Theme>,
  );
});

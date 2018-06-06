// @flow

import React from 'react';
import { shallow } from 'enzyme';
import Appearance from '../components/Appearance';

const theme = {
  key1: ({ appearance }) => `${appearance} -> value1`,
  key2: ({ appearance }) => `${appearance} -> value2`,
};

test('props -> string', done => {
  shallow(
    <Appearance props="custom" theme={theme}>
      {merged => {
        expect(merged).toEqual({
          key1: 'custom -> value1',
          key2: 'custom -> value2',
        });
        done();
      }}
    </Appearance>,
  );
});

test('props -> object', done => {
  shallow(
    <Appearance props={{ key2: 'custom2' }} theme={theme}>
      {merged => {
        expect(merged).toEqual({
          key1: 'default -> value1',
          key2: 'custom2',
        });
        done();
      }}
    </Appearance>,
  );
});

test('props -> function', done => {
  shallow(
    <Appearance props={() => ({ key2: 'custom2' })} theme={theme}>
      {merged => {
        expect(merged).toEqual({
          key1: 'default -> value1',
          key2: 'custom2',
        });
        done();
      }}
    </Appearance>,
  );
});

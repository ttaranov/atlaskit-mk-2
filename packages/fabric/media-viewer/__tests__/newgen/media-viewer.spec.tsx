import * as React from 'react';
import { reducer, State, Action, Component, Spinner } from '../../src/newgen/media-viewer';
import { mount } from 'enzyme';

describe('media-viewer', () => {  

  describe('reducer', () => {
    it('once loaded the name is saved as unkown', () => {
      const initialState: State = {
        type: 'LOADING'
      };
      const action: Action = {
        type: 'LOADED',
        item: { type: 'file', details: {} }
      };
      expect(reducer(initialState, action)).toEqual({
        type: 'LOADED',
        name: 'unkown'
      });
    });

    it('must switch state between INIT and LOAD', () => {
      // TODO
    });
  });

  describe('component', () => {
    it('should render the spinner for the LOADING state', () => {
      const state: State = {
        type: 'LOADING'
      };

      const c = mount(<Component {...state} dispatch={() => {}} />);
      expect(c.find(Spinner)).toHaveLength(1);
    });
  });

});
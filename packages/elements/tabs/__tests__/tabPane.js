// @flow
import React, { Component } from 'react';
import { shallow } from 'enzyme';

import { TabPane } from '../src/styled';
import { name } from '../package.json';

describe(name, () => {
  describe('TabPane', () => {
    describe('exports', () => {
      it('the TabPane component', () => {
        expect(TabPane).not.toBe(undefined);
        expect(<TabPane />).toBeInstanceOf(Object);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<TabPane />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a container wrapping the content', () => {
        const content = <span>My content</span>;
        const wrapper = shallow(<TabPane>{content}</TabPane>);
        expect(wrapper.props().children).toBe(content);
      });
    });
  });
});

// @flow
import React from 'react';
import { shallow } from 'enzyme';
import SubtleLink from '../src/components/SubtleLink';

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
    it('should render a span and a button', () => {
      const wrapper = shallow(
        <SubtleLink analyticsContext={{ component: 'comment-action' }}>
          Like
        </SubtleLink>,
      ).dive();
      expect(wrapper).toMatchSnapshot();
    });
  });
});

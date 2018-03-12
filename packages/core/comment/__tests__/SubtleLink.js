// @flow
import React from 'react';
import { shallow } from 'enzyme';
import Button from '@atlaskit/button';
import { name, version } from '../package.json';
import SubtleLink from '../src/components/SubtleLink';

describe('@atlaskit comments', () => {
  describe('SubtleLink', () => {
    it('should override analytics context of button', () => {
      const wrapper = shallow(
        <SubtleLink analyticsContext={{ component: 'comment-action' }}>
          Like
        </SubtleLink>,
      ).dive();
      const { analyticsContext } = wrapper.find(Button).props();
      expect(analyticsContext).toEqual({
        component: 'comment-action',
        package: name,
        version,
      });
    });
  });
});

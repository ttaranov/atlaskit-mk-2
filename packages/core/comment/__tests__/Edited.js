// @flow
import React from 'react';
import { shallow } from 'enzyme';

import { CommentEdited } from '../src/';
import SubtleLink from '../src/components/SubtleLink';

describe('@atlaskit comments', () => {
  describe('Edited', () => {
    it('should pass props down to SubtleLink', () => {
      const props = {
        onClick: jest.fn(),
        onFocus: jest.fn(),
        onMouseOver: jest.fn(),
      };
      const wrapper = shallow(<CommentEdited {...props} />);
      Object.keys(props).forEach(propName => {
        expect(wrapper.find(SubtleLink).prop(propName)).toBe(props[propName]);
      });
    });

    it('should render a SubtleLink with comment edited context', () => {
      const wrapper = shallow(<CommentEdited>Edited</CommentEdited>);
      const { analyticsContext } = wrapper.find(SubtleLink).props();
      expect(analyticsContext).toEqual({ component: 'comment-edited' });
    });
  });
});

// @flow
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import React from 'react';

import Lozenge from '../src';

const APPEARANCE_ENUM = [
  'default',
  'success',
  'removed',
  'inprogress',
  'new',
  'moved',
];

describe('Lozenge', () => {
  describe('isBold property', () => {
    it('should not be the default', () => {
      expect(mount(<Lozenge />).prop('isBold')).toBe(false);
    });

    it('should change when toggled', () => {
      expect(mount(<Lozenge isBold />).prop('isBold')).toBe(true);
    });
  });

  describe('appearance property', () => {
    it('should be "default" when not set', () => {
      expect(mount(<Lozenge />).prop('appearance')).toBe('default');
    });

    APPEARANCE_ENUM.forEach(value => {
      it(`should change when set to an approved value: ${value}`, () => {
        expect(mount(<Lozenge appearance={value} />).prop('appearance')).toBe(
          value,
        );
      });
    });

    it('should render correctly with text truncated', () => {
      const wrapper = (
        <Lozenge appearance="new">Hello, I should truncate at a point.</Lozenge>
      );
      const Component = renderer.create(wrapper).toJSON();
      expect(Component).toMatchSnapshot();
    });
  });
});

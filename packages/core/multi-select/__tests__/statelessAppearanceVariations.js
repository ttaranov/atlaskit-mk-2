// @flow
import React from 'react';
import { mount } from 'enzyme';
import { FieldBaseStateless } from '@atlaskit/field-base';
import { MultiSelectStatelessBase } from '../src/components/Stateless';

import { name } from '../package.json';

describe(`${name} - stateless`, () => {
  const animStub = window.cancelAnimationFrame;
  beforeEach(() => {
    window.cancelAnimationFrame = () => {};
  });

  afterEach(() => {
    window.cancelAnimationFrame = animStub;
  });

  describe('appearance variations', () => {
    it('should have appearance prop by default', () => {
      const wrapper = mount(<MultiSelectStatelessBase />);
      expect(wrapper.prop('appearance')).toBe('default');
    });

    it('should correctly map appearance prop to FieldBase', () => {
      const defaultMultiSelect = mount(<MultiSelectStatelessBase />);
      const standardFieldBase = defaultMultiSelect.find(FieldBaseStateless);
      const subtleMultiSelect = mount(
        <MultiSelectStatelessBase appearance="subtle" />,
      );
      const subtleFieldBase = subtleMultiSelect.find(FieldBaseStateless);
      expect(standardFieldBase.prop('appearance')).toBe('standard');
      expect(subtleFieldBase.prop('appearance')).toBe('subtle');
    });
  });
});

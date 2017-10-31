// @flow

import React from 'react';
import AkInput from '@atlaskit/input';
import { shallow } from 'enzyme';
import { name } from '../package.json';
import Input from '../src/components/internal/Input';

describe(name, () => {
  describe('Input', () => {
    it('should render an AK Input with the correct props', () => {
      const props = {
        isDisabled: true,
        placeholder: 'placeholder',
        value: 'my-value',
        onChange: () => {},
        onKeyDown: () => {},
        onFocus: () => {},
        onBlur: () => {},
      };
      const wrapper = shallow(<Input
        {...props}
      />);

      const inputProps = wrapper.find(AkInput).props();
      expect(inputProps.disabled).toBe(props.isDisabled);
      expect(inputProps.placeholder).toBe(props.placeholder);
      expect(inputProps.value).toBe(props.value);
      expect(inputProps.onChange).toBe(props.onChange);
      expect(inputProps.onKeyDown).toBe(props.onKeyDown);
      expect(inputProps.onFocus).toBe(props.onFocus);
      expect(inputProps.onBlur).toBe(props.onBlur);
    });
  });
});

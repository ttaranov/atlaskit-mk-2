// @flow
/* eslint-disable no-unused-vars */ // Using while dev mode TODO: remove on release
import React from 'react';
import { shallow, mount } from 'enzyme';
import FieldText from '@atlaskit/field-text';
import Form, {
  FormHeader,
  FormSection,
  Field,
  FieldGroup,
  Validator,
} from '../..';

// TODO: Add tests to cover all components

// Form

// FormHeader

// FormSection

// Field
describe('Field', () => {
  describe('isInvalid prop', () => {
    it('should reflect its value to FieldText', () => {
      expect(
        shallow(
          <Field label="" isInvalid>
            <FieldText label="" />
          </Field>,
        )
          .find(FieldText)
          .props().isInvalid,
      ).toBe(true);
    });
  });
  // FieldGroup

  // Validator
});

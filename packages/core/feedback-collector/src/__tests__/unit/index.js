// @flow

import React from 'react';
import { mount } from 'enzyme';
import Select from '@atlaskit/select';
import { Checkbox } from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';

import FeedbackCollector from '../../components/FeedbackCollector';
import FeedbackForm, { fieldLabel } from '../../components/FeedbackForm';

describe('Feedback Collector unit tests', () => {
  describe('Feedback JSD integration', () => {
    test('Feedback collector should render a component', () => {
      const wrapper = mount(
        <FeedbackCollector
          onClose={() => {}}
          onSubmit={() => {}}
          email={'email'}
          name={'name'}
          requestTypeId={'request_type_id'}
          embeddableKey={'embeddable_key'}
        />,
      );
      expect(wrapper).toBeDefined();
    });
  });

  describe('Feedback Form integration', () => {
    test('FeedbackForm should select only by default', () => {
      const wrapper = mount(
        <FeedbackCollector
          onClose={() => {}}
          onSubmit={() => {}}
          email={'email'}
          name={'name'}
          requestTypeId={'request_type_id'}
          embeddableKey={'embeddable_key'}
        />,
      );

      expect(wrapper.find(Select).length).toBe(1);
      expect(wrapper.find(FieldTextAreaStateless).length).toBe(0);
      expect(wrapper.find(Checkbox).length).toBe(0);
    });

    test('FeedbackForm should render checkboxes and fieldtext when something is selected', () => {
      const wrapper = mount(
        <FeedbackForm
          onClose={() => {}}
          onSubmit={() => {}}
          email={'email'}
          name={'name'}
          requestTypeId={'request_type_id'}
          embeddableKey={'embeddable_key'}
        />,
      );

      wrapper.setState({ type: 'comment' });

      expect(wrapper.find(Select).length).toBe(1);
      expect(wrapper.find(FieldTextAreaStateless).length).toBe(1);
      expect(wrapper.find(Checkbox).length).toBe(2);
    });

    test('should render a field label based on type', () => {
      const wrapper = mount(
        <FeedbackForm
          onClose={() => {}}
          onSubmit={() => {}}
          email={'email'}
          name={'name'}
          requestTypeId={'request_type_id'}
          embeddableKey={'embeddable_key'}
        />,
      );

      Object.keys(fieldLabel).forEach(key => {
        if (key !== 'empty') {
          wrapper.setState({ type: key });
          expect(
            wrapper
              .find(Field)
              .at(0)
              .props().label,
          ).toBe(fieldLabel[key]);
        }
      });
    });
  });
});

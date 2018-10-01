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
  describe('Feedback integration', () => {
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

    describe('Transforming form values into format', () => {
      let wrapper;

      beforeEach(() => {
        wrapper = mount(
          <FeedbackCollector
            email={'email'}
            name={'name'}
            requestTypeId={'request_type_id'}
            embeddableKey={'embeddable_key'}
          />,
        );
      });
      test('value is selected, everything else is empty', () => {
        const formValues = {
          type: 'bug',
          description: '',
          canBeContacted: false,
          enrollInResearchGroup: false,
        };
        const resultValues = {
          fields: [
            {
              id: 'customfield_10042',
              value: {
                id: '10105',
              },
            },
            {
              id: 'summary',
              value: '',
            },
            {
              id: 'description',
              value: '',
            },
            {
              id: 'email',
              value: 'do-not-reply@atlassian.com',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
          ],
        };
        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, everything else is empty', () => {
        const formValues = {
          type: 'comment',
          description: 'some text',
          canBeContacted: false,
          enrollInResearchGroup: false,
        };
        const resultValues = {
          fields: [
            {
              id: 'customfield_10042',
              value: {
                id: '10106',
              },
            },
            {
              id: 'summary',
              value: 'some text',
            },
            {
              id: 'description',
              value: 'some text',
            },
            {
              id: 'email',
              value: 'do-not-reply@atlassian.com',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
          ],
        };
        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, consent to contact is given', () => {
        const formValues = {
          type: 'suggestion',
          description: 'some text',
          canBeContacted: true,
          enrollInResearchGroup: false,
        };

        const resultValues = {
          fields: [
            {
              id: 'customfield_10042',
              value: {
                id: '10107',
              },
            },
            {
              id: 'summary',
              value: 'some text',
            },
            {
              id: 'description',
              value: 'some text',
            },
            {
              id: 'email',
              value: 'email',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
            {
              id: 'customfield_10043',
              value: [
                {
                  id: '10109',
                },
              ],
            },
          ],
        };
        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });

      test('value is selected, description is filled, consent to contact is given, enrolled in research', () => {
        const formValues = {
          type: 'question',
          description: 'some text',
          canBeContacted: true,
          enrollInResearchGroup: true,
        };

        const resultValues = {
          fields: [
            {
              id: 'customfield_10042',
              value: {
                id: '10108',
              },
            },
            {
              id: 'summary',
              value: 'some text',
            },
            {
              id: 'description',
              value: 'some text',
            },
            {
              id: 'email',
              value: 'email',
            },
            {
              id: 'customfield_10045',
              value: 'name',
            },
            {
              id: 'customfield_10043',
              value: [
                {
                  id: '10109',
                },
              ],
            },
            {
              id: 'customfield_10044',
              value: [
                {
                  id: '10110',
                },
              ],
            },
          ],
        };
        expect(wrapper.instance().mapFormToJSD(formValues)).toEqual(
          resultValues,
        );
      });
    });
  });

  describe('Feedback Form integration', () => {
    test('FeedbackForm should select only by default', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
      );

      expect(wrapper.find(Select)).toHaveLength(1);
      expect(wrapper.find(FieldTextAreaStateless)).toHaveLength(0);
      expect(wrapper.find(Checkbox)).toHaveLength(0);
    });

    test('FeedbackForm should render checkboxes and fieldtext when something is selected', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
      );

      wrapper.setState({ type: 'comment' });

      expect(wrapper.find(Select)).toHaveLength(1);
      expect(wrapper.find(FieldTextAreaStateless)).toHaveLength(1);
      expect(wrapper.find(Checkbox)).toHaveLength(2);
    });

    test('should render a field label based on type', () => {
      const wrapper = mount(
        <FeedbackForm onClose={() => {}} onSubmit={() => {}} />,
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

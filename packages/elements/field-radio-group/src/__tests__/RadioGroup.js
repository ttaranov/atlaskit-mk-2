// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Base from '@atlaskit/field-base';

import Radio from '../../src/RadioBase';
import {
  name,
  name as packageName,
  version as packageVersion,
} from '../../package.json';
import FieldRadioGroupStatelessWithAnalytics, {
  FieldRadioGroupStateless,
} from '../RadioGroupStateless';
import type { ItemPropTypeSmart } from '../types';

describe(name, () => {
  describe('FieldRadioGroupStateless (stateless)', () => {
    const sampleItems = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two', isSelected: true },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the FieldRadioGroupStateless component', () => {
        expect(FieldRadioGroupStateless).not.toBe(undefined);
        expect(new FieldRadioGroupStateless()).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(
          <FieldRadioGroupStateless onRadioChange={() => {}} />,
        );
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a FieldBase containing a Radio for each item', () => {
        const wrapper = mount(
          <FieldRadioGroupStateless
            onRadioChange={() => {}}
            items={sampleItems}
          />,
        );
        expect(wrapper.find(Base).length).toBe(1);
        expect(wrapper.find(Base).find(Radio).length).toBe(3);
      });
    });

    describe('props', () => {
      describe('items prop', () => {
        it('renders a Radio with correct props for each item in the array', () => {
          const wrapper = mount(
            <FieldRadioGroupStateless
              onRadioChange={() => {}}
              items={sampleItems}
            />,
          );
          expect(wrapper.find(Radio).length).toBe(sampleItems.length);

          const radios = wrapper.find(Radio);
          for (let i = 0; i < sampleItems.length; i++) {
            const radio = radios.at(i);
            const item: ItemPropTypeSmart = sampleItems[i];
            expect(radio.prop('name')).toBe(item.name);
            expect(radio.prop('value')).toBe(item.value);
            expect(radio.prop('children')).toBe(item.label);
            expect(radio.prop('isDisabled')).toBe(!!item.isDisabled);
            expect(radio.prop('isSelected')).toBe(!!item.isSelected);
          }
        });
      });

      describe('label prop', () => {
        it('is reflected to the FieldBase', () => {
          const label = 'string label content';
          const wrapper = shallow(
            <FieldRadioGroupStateless onRadioChange={() => {}} label={label} />,
          );
          expect(wrapper.find(Base).prop('label')).toBe(label);
        });
      });

      describe('isRequired prop', () => {
        it('is reflected to the FieldBase', () => {
          const isRequired = true;
          const wrapper = shallow(
            <FieldRadioGroupStateless
              onRadioChange={() => {}}
              isRequired={isRequired}
            />,
          );
          expect(wrapper.find(Base).prop('isRequired')).toBe(isRequired);
        });

        it('is reflected to each Radio item', () => {
          const isRequired = true;
          const wrapper = shallow(
            <FieldRadioGroupStateless
              onRadioChange={() => {}}
              isRequired={isRequired}
            />,
          );
          wrapper
            .find(Radio)
            .forEach(radio =>
              expect(radio.prop('isRequired', isRequired)).not.toBe(undefined),
            );
        });
      });

      describe('onRadioChange prop', () => {
        it('is called when a radio item is changed', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <FieldRadioGroupStateless
              onRadioChange={spy}
              items={sampleItems}
            />,
          );
          wrapper
            .find(Radio)
            .first()
            .find('input')
            .simulate('change');
          expect(spy).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('selection', () => {
      function expectRadioSelected(wrapper, index) {
        const radios = wrapper.find(Radio);
        for (let i = 0; i < radios.length; i++) {
          expect(radios.at(i).prop('isSelected')).toBe(index === i);
        }
      }

      function expectNoRadioSelected(wrapper) {
        return expectRadioSelected(wrapper, -1);
      }

      it('selects the radio with isSelected key', () => {
        const items = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2', isSelected: true },
        ];
        const wrapper = shallow(
          <FieldRadioGroupStateless onRadioChange={() => {}} items={items} />,
        );
        expectRadioSelected(wrapper, 2);
      });
      it('does not select an item if not specified', () => {
        const items = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <FieldRadioGroupStateless onRadioChange={() => {}} items={items} />,
        );
        expectNoRadioSelected(wrapper);
      });
      it('can select a radio which is disabled', () => {
        const items = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2', isSelected: true, isDisabled: true },
        ];
        const wrapper = shallow(
          <FieldRadioGroupStateless onRadioChange={() => {}} items={items} />,
        );
        expectRadioSelected(wrapper, 2);
      });
    });
  });
});
describe('analytics - FieldRadioGroupStateless', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<FieldRadioGroupStatelessWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'field-radio-group',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onRadioChange handler', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <FieldRadioGroupStatelessWithAnalytics onRadioChange={spy} />,
    );
    wrapper.find('button').simulate('change');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'change',
      }),
    );
  });

  it('should fire an atlaskit analytics event on change', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <FieldRadioGroupStatelessWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(FieldRadioGroupStatelessWithAnalytics).simulate('change');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'change' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'field-radio-group',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});

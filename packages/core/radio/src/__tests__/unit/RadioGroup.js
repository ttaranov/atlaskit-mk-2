// @flow
import React, { Component } from 'react';
import { mount, shallow } from 'enzyme';

import Radio from '../../RadioBase';
import RadioGroupWithAnalytics, {
  RadioGroupWithoutAnalytics as RadioGroup,
} from '../../RadioGroup';
import { name } from '../../../package.json';
import type { ItemPropTypeSmart } from '../../types';

describe(name, () => {
  describe('AkFieldRadioGroup (stateless)', () => {
    const sampleItems = [
      { name: 'test', value: '1', label: 'one' },
      { name: 'test', value: '2', label: 'two' },
      { name: 'test', value: '3', label: <i>three</i>, isDisabled: true },
    ];

    describe('exports', () => {
      it('the AkFieldRadioGroup component', () => {
        expect(RadioGroup).not.toBe(undefined);
        expect(
          new RadioGroup({ selectedValue: null, defaultSelectedValue: null }),
        ).toBeInstanceOf(Component);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        const wrapper = shallow(<RadioGroup onChange={() => {}} />);
        expect(wrapper).not.toBe(undefined);
        expect(wrapper.instance()).toBeInstanceOf(Component);
      });

      it('should render a FieldBase containing a Radio for each item', () => {
        const wrapper = mount(
          <RadioGroup onChange={() => {}} items={sampleItems} />,
        );
        expect(wrapper.find(Radio).length).toBe(3);
      });
    });

    describe('props', () => {
      describe('items prop', () => {
        it('renders a Radio with correct props for each item in the array', () => {
          const wrapper = mount(
            <RadioGroup onChange={() => {}} items={sampleItems} />,
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
            expect(radio.prop('isChecked')).toBe(!!item.isChecked);
          }
        });
      });

      describe('isRequired prop', () => {
        it('is reflected to each Radio item', () => {
          const isRequired = true;
          const wrapper = shallow(
            <RadioGroup onChange={() => {}} isRequired={isRequired} />,
          );
          wrapper
            .find(Radio)
            .forEach(radio =>
              expect(radio.prop('isRequired', isRequired)).not.toBe(undefined),
            );
        });
      });

      describe('onChange prop', () => {
        it('is called when a radio item is changed', () => {
          const spy = jest.fn();
          const wrapper = mount(
            <RadioGroup onChange={spy} items={sampleItems} />,
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
          { name: 'n', value: '2' },
        ];
        const wrapper = shallow(
          <RadioGroup
            items={items}
            onChange={() => {}}
            selectedValue={items[2].value}
          />,
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
          <RadioGroup onChange={() => {}} items={items} />,
        );
        expectNoRadioSelected(wrapper);
      });
      it('can select a radio which is disabled', () => {
        const items = [
          { name: 'n', value: '0' },
          { name: 'n', value: '1' },
          { name: 'n', value: '2', isDisabled: true },
        ];
        const wrapper = shallow(
          <RadioGroup
            items={items}
            onChange={() => {}}
            selectedValue={items[2].value}
          />,
        );
        expectRadioSelected(wrapper, 2);
      });
    });
  });
});

describe('AkFieldRadioGroupWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(<RadioGroupWithAnalytics onChange={() => {}} />);
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});

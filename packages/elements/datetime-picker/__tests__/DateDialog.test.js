// @flow

import React from 'react';
import { CalendarStateless } from '@atlaskit/calendar';
import Layer from '@atlaskit/layer';
import { shallow } from 'enzyme';
import { name } from '../package.json';
import DateDialog from '../src/components/internal/DateDialog';

const getCalendar = dateDialogWrapper => {
  const layerContent = shallow(dateDialogWrapper.find(Layer).props().content);
  return layerContent.find(CalendarStateless);
};

describe(name, () => {
  describe('DateDialog', () => {
    it('should render a layer containing the children', () => {
      const child = <div>child</div>;
      const wrapper = shallow(<DateDialog>{child}</DateDialog>);

      expect(wrapper.contains(child)).toBe(true);
    });

    it('should render a Calendar in a dialog when isOpen is true', () => {
      const wrapper = shallow(<DateDialog isOpen />);
      expect(getCalendar(wrapper)).toHaveLength(1);
    });

    it('should not render anything in the dialog when isOpen is false', () => {
      const wrapper = shallow(<DateDialog isOpen={false} />);
      expect(wrapper.find(Layer).props().content).toBe(null);
    });

    it('should initialise the calendar date using a provided date value', () => {
      const wrapper = shallow(<DateDialog isOpen value="2017-10-31" />);
      const calendarProps = getCalendar(wrapper).props();

      expect(calendarProps.focused).toBe(31);
      expect(calendarProps.month).toBe(10);
      expect(calendarProps.year).toBe(2017);
    });

    it('should initialise the calendar date using today\'s date if no value is provided', () => {
      const wrapper = shallow(<DateDialog isOpen />);
      const calendarProps = getCalendar(wrapper).props();

      const now = new Date();
      expect(calendarProps.focused).toBe(now.getDate());
      expect(calendarProps.month).toBe(now.getMonth() + 1);
      expect(calendarProps.year).toBe(now.getFullYear());
    });

    it('should update the focused calendar date when the calendar is navigated', () => {
      const wrapper = shallow(<DateDialog isOpen value="2017-10-31" />);

      getCalendar(wrapper).props().onChange({
        day: 1,
        month: 11,
        year: 2017,
      });

      const calendarProps = getCalendar(wrapper).props();
      expect(calendarProps.focused).toBe(1);
      expect(calendarProps.month).toBe(11);
      expect(calendarProps.year).toBe(2017);
    });

    it('should call onUpdate when a valid date is selected', () => {
      const testIso = '2017-12-25';
      const onUpdateMock = jest.fn();
      const wrapper = shallow(<DateDialog isOpen onUpdate={onUpdateMock} />);

      getCalendar(wrapper).props().onSelect({ iso: testIso });

      expect(onUpdateMock.mock.calls.length).toBe(1);
      expect(onUpdateMock.mock.calls[0][0]).toBe(testIso);
    });

    it('should not call onUpdate when a disabled date is selected', () => {
      const testIso = '2017-12-25';
      const onUpdateMock = jest.fn();
      const wrapper = shallow(<DateDialog
        isOpen
        disabled={[testIso]}
        onUpdate={onUpdateMock}
      />);

      getCalendar(wrapper).props().onSelect({ iso: testIso });

      expect(onUpdateMock.mock.calls.length).toBe(0);
    });

    it('should call onTriggerClose when the Escape key is pressed', () => {
      const onTriggerCloseMock = jest.fn();
      const wrapper = shallow(<DateDialog isOpen onTriggerClose={onTriggerCloseMock} />);
      const layerContent = shallow(wrapper.find(Layer).props().content);

      layerContent.find('div').simulate('keyDown', {
        preventDefault: () => {},
        key: 'Escape',
      });

      expect(onTriggerCloseMock.mock.calls.length).toBe(1);
    });

    it('should re-initialize the calendar date when opened', () => {
      const wrapper = shallow(<DateDialog isOpen value="2017-11-30" />, {
        lifecycleExperimental: true, // Required to trigger componentDidUpdate when using setProps. 
      });

      // Navigate to a new date, then open and close the dialog
      getCalendar(wrapper).props().onChange({
        day: 15,
        month: 9,
        year: 2018,
      });
      wrapper.setProps({ isOpen: false });
      wrapper.setProps({ isOpen: true });

      const calendarProps = getCalendar(wrapper).props();
      expect(calendarProps.focused).toBe(30);
      expect(calendarProps.month).toBe(11);
      expect(calendarProps.year).toBe(2017);
    });
  });
});

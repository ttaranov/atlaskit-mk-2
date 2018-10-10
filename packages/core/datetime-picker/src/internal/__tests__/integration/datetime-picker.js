// @flow
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getExampleUrl } from '@atlaskit/webdriver-runner/utils/example';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import * as assert from 'assert';

const urlDateTimePicker = getExampleUrl('core', 'datetime-picker', 'basic');
/* Css used for the test */
const datepickerDefault = 'label[for="react-select-datepicker-1--input"] + div';
const datepickerMenu = '[aria-label="calendar"]';
const date =
  '[aria-label="calendar"] > table > tbody > tr:nth-child(5) > td:nth-child(6)';
const dateValue = `${datepickerDefault} > div > div > div`;
const timepickerDefault = 'label[for="react-select-timepicker-4--input"] + div';
const timePickerMenu = '.timepicker-select__menu-list';
const timeValue = `${timepickerDefault} > div > div > div`;
const timeOption = '[role="option"]';

BrowserTestCase(
  'datetime-picker.js: When DatePicker is focused & backspace pressed, the input should be cleared',
  { skip: ['firefox', 'ie', 'edge'] },
  async client => {
    const dateTimePickerTest = new Page(client);
    await dateTimePickerTest.goto(urlDateTimePicker);
    await dateTimePickerTest.click(datepickerDefault);
    await dateTimePickerTest.waitForSelector(datepickerMenu);
    await dateTimePickerTest.click(date);
    const previousDate = await dateTimePickerTest.getText(dateValue);
    await dateTimePickerTest.keys(['Backspace']);
    expect(await dateTimePickerTest.getText(dateValue)).not.toBe(previousDate);
    if (dateTimePickerTest.log('browser').value) {
      dateTimePickerTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when the input is cleared`,
        );
      });
    }
  },
);

BrowserTestCase(
  'datetime-picker.js: When choosing another day in a Datetime picker focused, the date should be updated to the new value',
  { skip: ['firefox'] },
  async client => {
    const dateTimePickerTest = new Page(client);
    await dateTimePickerTest.goto(urlDateTimePicker);
    await dateTimePickerTest.click(datepickerDefault);
    await dateTimePickerTest.waitForSelector(datepickerMenu);
    await dateTimePickerTest.click(date);
    const previousDate = await dateTimePickerTest.getText(dateValue);
    await dateTimePickerTest.click(datepickerDefault);
    await dateTimePickerTest.keys(['ArrowLeft']);
    await dateTimePickerTest.keys(['ArrowLeft']);
    await dateTimePickerTest.keys(['Enter']);
    expect(await dateTimePickerTest.getText(dateValue)).not.toBe(previousDate);
    if (dateTimePickerTest.log('browser').value) {
      dateTimePickerTest.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when the date is updated`,
        );
      });
    }
  },
);

BrowserTestCase(
  'datetime-picker.js: When entering a new time in Timepicker Editable, the time should be updated to the new value',
  { skip: ['firefox', 'ie', 'safari', 'edge'] }, // Enter key has an issue in those browser
  async client => {
    const timePicker = new Page(client);
    await timePicker.goto(urlDateTimePicker);
    await timePicker.click(timepickerDefault);
    await timePicker.waitForSelector(timePickerMenu);
    const previousTime = await timePicker.getText(timeValue);
    timePicker.keys(['12:45pm']);
    await timePicker.waitForSelector(timeOption);
    // There is small issue there about the Key ENTER pressed too fast
    timePicker.keys(['Enter']);
    expect(await timePicker.getText(timeValue)).not.toBe(previousTime);
    expect(await timePicker.getText(timeValue)).toBe('12:45pm');
    if (timePicker.log('browser').value) {
      timePicker.log('browser').value.forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Console errors :${val.message} when the time is updated`,
        );
      });
    }
  },
);

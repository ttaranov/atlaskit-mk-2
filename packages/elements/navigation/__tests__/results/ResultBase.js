import React from 'react';
import { quickSearchResultTypes } from '../../../src';
import { mountWithRootTheme } from '../_theme-util';

const { ResultBase } = quickSearchResultTypes;

describe('Result Base', () => {
  let resultWrapper;
  beforeEach(() => {
    resultWrapper = mountWithRootTheme(
      <ResultBase text="" resultId="testResult" type="base" name="test" />,
    );
  });

  it('should pass { `resultId`,  `type` } to onClick handler', () => {
    const spy = jest.fn();
    resultWrapper.setProps({ onClick: spy });
    resultWrapper.simulate('click');
    expect(spy).toBeCalledWith({ resultId: 'testResult', type: 'base' });
  });

  it('should pass { `resultId`,  `type` } to onMouseEnter handler', () => {
    const spy = jest.fn();
    resultWrapper.setProps({ onMouseEnter: spy });
    resultWrapper.simulate('mouseenter');
    expect(spy).toBeCalledWith({ resultId: 'testResult', type: 'base' });
  });
});

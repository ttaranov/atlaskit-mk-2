// @flow
import { mount } from 'enzyme';
import React from 'react';
import ResultBase from '../ResultBase';
import { type Context } from '../types';

describe('Result Base', () => {
  let resultWrapper;
  beforeEach(() => {
    const context: Context = {
      registerResult: () => {},
      onMouseEnter: () => {},
      onMouseLeave: () => {},
      sendAnalytics: () => {},
      getIndex: n => Number(n),
    };

    resultWrapper = mount(
      <ResultBase
        text=""
        resultId="testResult"
        type="base"
        name="test"
        isSelected={false}
        isCompact={false}
        onClick={() => {}}
        context={context}
      />,
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
    resultWrapper.setProps({
      context: {
        onMouseEnter: spy,
        registerResult: () => {},
      },
    });
    resultWrapper.simulate('mouseenter');
    expect(spy).toBeCalledWith({ resultId: 'testResult', type: 'base' });
  });
});

// @flow
import React from 'react';
import { mount } from 'enzyme';
import withOpenInNewTab from '../withOpenInNewTab';
import PersonResult from '../PersonResult';
import { ResultContext } from '../../context';

const context = {
  sendAnalytics: jest.fn(),
  onMouseEnter: jest.fn(),
  onMouseLeave: jest.fn(),
  registerResult: jest.fn(),
  getIndex: jest.fn(),
};

const defaultPersonResultProps = {
  resultId: 'resultId',
  name: 'personName',
  presenceMessage: 'message',
  href: 'http://www.example.com/',
};
const renderWithContext = (contextOverrides = {}) => {
  const PersonResulWithOpenInNewTab = withOpenInNewTab(PersonResult);
  return mount(
    <ResultContext.Provider
      value={{
        ...context,
        ...contextOverrides,
      }}
    >
      <PersonResulWithOpenInNewTab {...defaultPersonResultProps} />
    </ResultContext.Provider>,
  );
};
describe('withOpenInNewTab', () => {
  let windowOpenSpy;

  beforeEach(() => {
    windowOpenSpy = jest.spyOn(window, 'open');
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  const assertPersonResult = wrapper => {
    const personResult = wrapper.find(PersonResult);
    expect(personResult.length).toBe(1);
    expect(personResult.props()).toMatchObject(defaultPersonResultProps);
  };

  it('should support missing linkComponent component', () => {
    const wrapper = renderWithContext();
    assertPersonResult(wrapper);
    wrapper.simulate('click');
    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    expect(windowOpenSpy).toBeCalledWith(
      defaultPersonResultProps.href,
      '_blank',
    );
  });

  it('should support custom link component', () => {
    const spy = jest.fn();
    const MyLinkComponent = (props: { children: Object }) => (
      <span role="link" tabIndex="0" onClick={e => spy(props, e)}>
        {props.children}
      </span>
    );

    const wrapper = renderWithContext({ linkComponent: MyLinkComponent });
    assertPersonResult(wrapper);
    wrapper.find(MyLinkComponent).simulate('click');
    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    expect(windowOpenSpy).toBeCalledWith(
      defaultPersonResultProps.href,
      '_blank',
    );
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatchObject({
      href: 'http://www.example.com/',
    });
  });
});

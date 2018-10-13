import * as React from 'react';
import { shallow } from 'enzyme';
import { Request } from '../Request';

let callOrder = [];
const setStateToFulfilledSpy = jest.fn(() => {
  callOrder.push('setStateToFulfilled');
});
const setStateToRejectedSpy = jest.fn(() =>
  callOrder.push('setStateToRejected'),
);
const setStateToPendingSpy = jest.fn(() => callOrder.push('setStateToPending'));

const defaultProps = {
  request: jest.fn(),
  children: jest.fn(),
};

const render = props => shallow(<Request {...defaultProps} {...props} />);

const renderWithSendRequestSpies = props => {
  const wrapper = render(props);
  wrapper.instance().setStateToFulfilled = setStateToFulfilledSpy;
  wrapper.instance().setStateToRejected = setStateToRejectedSpy;
  wrapper.instance().setStateToPending = setStateToPendingSpy;
  return wrapper;
};

afterEach(() => {
  callOrder = [];
});

test('Correct order/flow: Promise fulfills', async () => {
  const requestSpy = jest.fn(() => {
    callOrder.push('request');
    return Promise.resolve('success');
  });
  const wrapper = renderWithSendRequestSpies({ request: requestSpy });

  // Assert call register is empty
  expect(callOrder).toMatchObject([]);

  // Trigger flow being tested
  await wrapper.instance().sendRequest();

  // .toMatchObject() asserts that the arrays contain matching elements, in the
  // correct order and does not permit additional elements.
  expect(callOrder).toMatchObject([
    'setStateToPending',
    'request',
    'setStateToFulfilled',
  ]);
});

test('Correct order/flow: Promise rejects', async () => {
  const requestSpy = jest.fn(() => {
    callOrder.push('request');
    return Promise.reject('💩');
  });
  const wrapper = renderWithSendRequestSpies({ request: requestSpy });

  // Assert call register is empty
  expect(callOrder).toMatchObject([]);

  // Trigger flow being tested
  await wrapper.instance().sendRequest();

  // .toMatchObject() asserts that the arrays contain matching elements, in the
  // correct order and does not permit additional elements.
  expect(callOrder).toMatchObject([
    'setStateToPending',
    'request',
    'setStateToRejected',
  ]);
});

test('can fire on mount without props.variables', async () => {
  const wrapperProps = {
    fireOnMount: true,
    request: jest.fn(),
  };
  render(wrapperProps);

  expect(wrapperProps.request).toHaveBeenCalledTimes(1);
});

test('can fire on mount with props.variables', async () => {
  const wrapperProps = {
    fireOnMount: true,
    variables: ['abc', '123'],
    request: jest.fn(),
  };
  render(wrapperProps);

  expect(wrapperProps.request).toHaveBeenCalledTimes(1);
  // Should call request with props.variables spread
  expect(wrapperProps.request).toHaveBeenCalledWith('abc', '123');
});

test('can refetch without props.variables', async () => {
  let refetch;
  const wrapperProps = {
    children: (state, sendRequest) => {
      refetch = sendRequest;
    },
    request: jest.fn(),
  };
  render(wrapperProps);

  expect(wrapperProps.request).toHaveBeenCalledTimes(0);

  refetch();

  expect(wrapperProps.request).toHaveBeenCalledTimes(1);
  expect(wrapperProps.request).toHaveBeenCalledWith();
});

test('can refetch with props.variables', async () => {
  let refetch;
  const wrapperProps = {
    children: (state, sendRequest) => {
      refetch = sendRequest;
    },
    request: jest.fn(),
    variables: ['abc', '123'],
  };
  render(wrapperProps);

  expect(wrapperProps.request).toHaveBeenCalledTimes(0);

  refetch();

  expect(wrapperProps.request).toHaveBeenCalledTimes(1);
  // Should call request with props.variables spread
  expect(wrapperProps.request).toHaveBeenCalledWith('abc', '123');
});

test('can refetch with override arguments', async () => {
  let refetch;
  const wrapperProps = {
    children: (state, sendRequest) => {
      refetch = sendRequest;
    },
    request: jest.fn(),
    variables: ['abc', '123'],
  };
  render(wrapperProps);

  expect(wrapperProps.request).toHaveBeenCalledTimes(0);

  refetch('xyz', ['7', '8', '9']);

  expect(wrapperProps.request).toHaveBeenCalledTimes(1);
  // Should call request with props.variables spread
  expect(wrapperProps.request).toHaveBeenCalledWith('xyz', ['7', '8', '9']);
});

import { shallow } from 'enzyme';
import * as React from 'react';
import {
  ScrollAnchor,
  ValueContainer,
} from '../../../components/ValueContainer';

describe('ValueContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  const shallowValueContainer = props => shallow(<ValueContainer {...props} />);

  it('should render ValueContainer with children', () => {
    const component = shallowValueContainer({ children: 'some text' });
    expect(
      component
        .children()
        .at(0)
        .text(),
    ).toEqual('some text');
  });

  it('should scroll to bottom when adding new items', () => {
    const component = shallowValueContainer({
      children: 'some text',
      getValue: jest.fn(() => []),
    });
    const scrollIntoView = jest.fn();
    const innerRef = component.find(ScrollAnchor).prop('innerRef');
    if (innerRef && typeof innerRef === 'function') {
      innerRef({ scrollIntoView });
    }

    expect(component.state()).toHaveProperty('valueSize', 0);
    component.setProps({ getValue: jest.fn(() => [1]) });
    jest.runAllTimers();
    expect(component.state()).toHaveProperty('valueSize', 1);
    expect(component.state()).toHaveProperty('previousValueSize', 0);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('should not scroll when removing and item', () => {
    const component = shallowValueContainer({
      children: 'some text',
      getValue: jest.fn(() => [1]),
    });
    const scrollIntoView = jest.fn();
    const innerRef = component.find(ScrollAnchor).prop('innerRef');
    if (innerRef && typeof innerRef === 'function') {
      innerRef({ scrollIntoView });
    }

    expect(component.state()).toHaveProperty('valueSize', 1);
    component.setProps({ getValue: jest.fn(() => []) });
    jest.runAllTimers();
    expect(component.state()).toHaveProperty('valueSize', 0);
    expect(component.state()).toHaveProperty('previousValueSize', 1);

    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

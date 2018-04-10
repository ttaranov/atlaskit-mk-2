import * as React from 'react';
import { mount } from 'enzyme';

import Counter from '../../src/internal/counter';
import { Props, highlightStyle } from '../../src/internal/counter';

const renderCounter = (props: Props) => {
  return mount(<Counter {...props} />);
};

describe('Counter', () => {
  it('should render counter', () => {
    const counter = renderCounter({ value: 10 });
    expect(counter.text()).toEqual('10');
  });

  it('should render over limit label', () => {
    const counter = renderCounter({ value: 100 });
    expect(counter.text()).toEqual('99+');
  });

  it('should render using custom limit and label', () => {
    const counter = renderCounter({
      value: 10,
      limit: 10,
      overLimitLabel: '9+',
    });
    expect(counter.text()).toEqual('9+');
  });

  it('should add highlight class', () => {
    const counter = renderCounter({ value: 10, highlight: true });
    expect(counter.find('div').prop('className')).toContain(highlightStyle);
  });

  it('should set width to avoid resizing', () => {
    const counter = renderCounter({ value: 11 });

    expect(counter.find('div').prop('style')).toHaveProperty('width', 20);
  });
});

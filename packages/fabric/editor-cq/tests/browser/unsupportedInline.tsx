import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import ReactUnsupportedInlineNode from '../../src/nodeviews/ui/unsupportedInline';

describe('unsupportedInline - React component', () => {
  it('should return a node of type span', () => {
    const wrapper = mount(<ReactUnsupportedInlineNode/>);
    expect(wrapper.getDOMNode().tagName).to.equal('SPAN');
  });

  it('should have text content as string "Unsupported content"', () => {
    const wrapper = mount(<ReactUnsupportedInlineNode/>);
    expect(wrapper.text()).to.equal('Unsupported content');
  });
});

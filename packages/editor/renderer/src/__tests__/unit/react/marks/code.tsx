import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Code from '../../../../react/marks/code';

describe('Renderer - React/Marks/Code', () => {
  it('should generate content with a <Code>-tag', () => {
    const mark = mount(<Code>This is code</Code>);
    expect(mark.find(Code).length).to.equal(1);
    mark.unmount();
  });

  it('should output correct html', () => {
    const mark = mount(<Code>This is code</Code>);
    expect(mark.html()).to.include('<code>This is code</code>');
    mark.unmount();
  });

  it('should handle arrays correctly', () => {
    const markWithArray = mount(<Code>{['This ', 'is', ' code']}</Code>);
    expect(markWithArray.html()).to.include('<code>This is code</code>');
    markWithArray.unmount();
  });
});

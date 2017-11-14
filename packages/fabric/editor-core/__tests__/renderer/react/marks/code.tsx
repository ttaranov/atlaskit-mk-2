import * as React from 'react';
import { shallow } from 'enzyme';
import Code from '../../../../src/renderer/react/marks/code';

describe('Renderer - React/Marks/Code', () => {
  const mark = shallow(<Code>This is code</Code>);

  it('should generate content with a <Code>-tag', () => {
    expect(mark.find('Code').length).toEqual(1);
  });

  it('should output correct html', () => {
    expect(mark.html()).to.include('<code>This is code</code>');
  });
});

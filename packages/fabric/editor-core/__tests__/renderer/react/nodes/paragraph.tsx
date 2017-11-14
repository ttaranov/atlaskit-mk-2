import * as React from 'react';
import { shallow } from 'enzyme';
import Paragraph from '../../../../src/renderer/react/nodes/paragraph';

describe('Renderer - React/Nodes/Paragraph', () => {
  const paragraph = shallow(<Paragraph>This is a paragraph</Paragraph>);

  it('should wrap content with <p>-tag', () => {
    expect(paragraph.is('p')).toBe(true);
  });

});

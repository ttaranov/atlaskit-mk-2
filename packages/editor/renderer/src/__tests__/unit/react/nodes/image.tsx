import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Image from '../../../../react/nodes/image';

describe('Renderer - React/Nodes/Image', () => {
  const image = mount(<Image src="https://example.com/image.jpg" />);

  it('should render a <img>-tag', () => {
    expect(image.getDOMNode().tagName).to.equal('IMG');
  });
});

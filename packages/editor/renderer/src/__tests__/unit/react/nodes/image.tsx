import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Image from '../../../../react/nodes/image';

describe('Renderer - React/Nodes/Image', () => {
  const image = shallow(<Image src="https://example.com/image.jpg" />);

  it('should render a <img>-tag', () => {
    expect(image.is('img')).to.equal(true);
  });
});

import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import Paragraph from '../../../../react/nodes/paragraph';

describe('Renderer - React/Nodes/Paragraph', () => {
  it('should wrap content with <p>-tag', () => {
    const paragraph = shallow(<Paragraph>This is a paragraph</Paragraph>);
    expect(paragraph.is('p')).to.equal(true);
  });

  it('should render <br> tags in empty paragraphs', () => {
    const render = mount(
      <>
        <Paragraph />
        <Paragraph>This is a paragraph</Paragraph>
        <Paragraph />
      </>,
    );

    const paragraphs = render.find(Paragraph);

    expect(paragraphs.at(0).html()).to.equal('<p>&nbsp;</p>');
    expect(paragraphs.at(2).html()).to.equal('<p>&nbsp;</p>');
  });
});

import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import RendererEmoji from '../../../../react/nodes/emoji';
import { Emoji } from '@atlaskit/editor-common';

describe('Emoji', () => {
  it('should render Emoji UI component', () => {
    const component = mount(
      <RendererEmoji shortName="shortname" id="id" text="fallback" />,
    );
    expect(component.find(Emoji)).to.have.length(1);
    component.unmount();
  });

  it('should convert text to fallback attribute', () => {
    const component = mount(
      <RendererEmoji shortName="shortname" id="id" text="fallback" />,
    );

    expect(component.find(Emoji).prop('fallback')).to.equal('fallback');
    component.unmount();
  });
});

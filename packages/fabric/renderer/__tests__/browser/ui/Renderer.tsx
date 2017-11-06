import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import Renderer from '../../../src/ui/Renderer';

describe('@atlaskit/renderer/ui/Renderer', () => {
  it('should catch errors and render unsupported content text', () => {
    const doc = {
      type: 'doc',
      content: 'foo',
    };

    const renderer = mount(<Renderer document={doc} />);
    expect(renderer.find('UnsupportedBlockNode')).to.have.length(1);
    renderer.unmount();
  });
});

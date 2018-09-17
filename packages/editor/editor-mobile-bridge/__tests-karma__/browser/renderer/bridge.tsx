import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MobileRenderer from '../../../src/renderer/mobile-renderer-element';

declare var rendererBridge;

describe('Renderer bridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };
  let renderer;

  beforeEach(() => {
    renderer = mount(<MobileRenderer />);
  });

  afterEach(() => {
    renderer.unmount();
  });

  it('sets content', () => {
    rendererBridge.setContent(JSON.stringify(originalContent));
    const getComponentState = renderer.state().document;
    const documentObj = getComponentState && JSON.parse(getComponentState);
    expect(documentObj).to.be.deep.equal(originalContent);
  });
});

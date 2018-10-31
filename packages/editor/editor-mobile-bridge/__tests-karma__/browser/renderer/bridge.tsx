import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import documentWithLink from '../../__fixtures__/document-with-link';

import MobileRenderer from '../../../src/renderer/mobile-renderer-element';

declare var rendererBridge;

describe('Renderer bridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };
  let renderer;
  let eventProperties = {
    preventDefault: () => {},
  };

  beforeEach(() => {
    renderer = mount(<MobileRenderer />);
  });

  afterEach(() => {
    renderer.unmount();
  });

  it('sets content', () => {
    rendererBridge.setContent(JSON.stringify(originalContent));
    const getComponentState = renderer.state().document;
    expect(originalContent).to.be.deep.equal(getComponentState);
  });

  it('Android bridge is called correctly on link click', () => {
    let href = 'https://product-fabric.atlassian.net/browse/FAB-1520';
    let spy = sinon.spy();
    rendererBridge.linkBridge = {
      onLinkClick: spy,
    };

    rendererBridge.setContent(JSON.stringify(documentWithLink(href)));
    renderer.update();

    renderer.find('Link').simulate('click', eventProperties);
    expect(spy.calledOnce).to.equal(true);
    expect(spy.args[0][0]).to.equal(href);
  });

  it('iOS bridge is called correctly on link click', () => {
    let href = 'https://product-fabric.atlassian.net/browse/FAB-1522';
    let spy = sinon.spy();
    window.webkit = {
      messageHandlers: {
        linkBridge: {
          postMessage: spy,
        },
      },
    };

    rendererBridge.setContent(JSON.stringify(documentWithLink(href)));
    renderer.update();

    renderer.find('Link').simulate('click', eventProperties);
    expect(spy.calledOnce).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({
      name: 'linkClick',
      url: href,
    });
  });
});

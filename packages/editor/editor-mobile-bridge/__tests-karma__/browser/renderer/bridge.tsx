import * as React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as sinon from 'sinon';

import documentWithLink from '../../__fixtures__/document-with-link';
import documentWithTask from '../../__fixtures__/document-with-task';

import MobileRenderer from '../../../src/renderer/mobile-renderer-element';

declare var rendererBridge;

const mockAndroidBridgeHandler = (bridgeName, eventName) => spy => {
  window[bridgeName] = {};
  window[bridgeName][eventName] = spy;
};

const mockiOSBridgeHandler = bridgeName => spy => {
  window.webkit = {
    messageHandlers: {
      [bridgeName]: {
        postMessage: spy,
      },
    },
  };
};

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
    mockAndroidBridgeHandler('linkBridge', 'onLinkClick')(spy);

    rendererBridge.setContent(JSON.stringify(documentWithLink(href)));
    renderer.update();

    renderer.find('Link').simulate('click', eventProperties);
    expect(spy.calledOnce).to.equal(true);
    expect(spy.args[0][0]).to.equal(href);
  });

  it('iOS bridge is called correctly on link click', () => {
    let href = 'https://product-fabric.atlassian.net/browse/FAB-1522';
    let spy = sinon.spy();
    mockiOSBridgeHandler('linkBridge')(spy);

    rendererBridge.setContent(JSON.stringify(documentWithLink(href)));
    renderer.update();

    renderer.find('Link').simulate('click', eventProperties);
    expect(spy.calledOnce).to.equal(true);
    expect(spy.args[0][0]).to.deep.equal({
      name: 'onLinkClick',
      url: href,
    });
  });

  it('Android bridge is called correctly on task update', done => {
    let spy = sinon.spy();
    mockAndroidBridgeHandler('taskDecisionBridge', 'updateTask')(spy);

    rendererBridge.setContent(JSON.stringify(documentWithTask));
    renderer.update();

    const taskCheckbox = renderer.find('input[type="checkbox"]').at(0);

    // Toggle on
    taskCheckbox.simulate('change');
    // Toggle off
    taskCheckbox.simulate('change');

    // Wait for next tick for provider to receive updates.
    setTimeout(() => {
      expect(spy.calledTwice).to.equal(true);
      expect(spy.args).to.deep.equal([
        ['6bf53903-9438-42fb-a7f3-a6a41dd33fb8', 'DONE'],
        ['6bf53903-9438-42fb-a7f3-a6a41dd33fb8', 'TODO'],
      ]);
      done();
    }, 0);
  });

  it('iOS bridge is called correctly on task udpate', done => {
    let spy = sinon.spy();
    mockiOSBridgeHandler('taskDecisionBridge')(spy);

    rendererBridge.setContent(JSON.stringify(documentWithTask));
    renderer.update();

    const taskCheckbox = renderer.find('input[type="checkbox"]').at(1);

    // Toggle on
    taskCheckbox.simulate('change');
    // Toggle off
    taskCheckbox.simulate('change');

    // Wait for next tick for provider to receive updates.
    setTimeout(() => {
      expect(spy.calledTwice).to.equal(true);
      expect(spy.args).to.deep.equal([
        // Initial change
        [
          {
            name: 'updateTask',
            taskId: '83aee43e-ca2f-4e1e-b921-896b7c78f531',
            state: 'TODO',
          },
        ],
        // Second change
        [
          {
            name: 'updateTask',
            taskId: '83aee43e-ca2f-4e1e-b921-896b7c78f531',
            state: 'DONE',
          },
        ],
      ]);
      done();
    }, 0);
  });
});

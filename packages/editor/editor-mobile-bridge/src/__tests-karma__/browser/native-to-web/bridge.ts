import * as sinon from 'sinon';
import { toNativeBridge } from '../../../web-to-native';
import mobileEditor from '../../../mobile-editor-element';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { mountEditor } from './utils';

declare var bridge;

describe('NativeToWebBridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };
  let editor;

  beforeEach(() => {
    editor = mount(mobileEditor());
  });

  afterEach(() => {
    editor.unmount();
  });

  it('sets content', async () => {
    bridge.setContent(JSON.stringify(originalContent));

    const value = await bridge.editorActions.getValue();
    expect(value).to.be.deep.equal(originalContent);
  });

  it('gets content', () => {
    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));

    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(originalContent);
  });
});

describe('insert media', () => {
  let editor;
  const getCollection = sinon.stub(toNativeBridge, 'getCollection');
  const getServiceHost = sinon.stub(toNativeBridge, 'getServiceHost');
  beforeEach(async () => {
    getCollection.reset();
    getCollection.returns('FabricSampleCollection');
    getServiceHost.reset();
    getServiceHost.returns('http://www.atlassian.com/');
    editor = await mountEditor();
  });

  afterEach(() => {
    editor.unmount();
  });
  const contentWithMedia = {
    version: 1,
    type: 'doc',
    content: [
      {
        type: 'mediaGroup',
        content: [
          {
            type: 'media',
            attrs: {
              id: 'e94c3f67-5ac3-42b2-bf6a-ce35bb787894',
              collection: 'FabricSampleCollection',
              type: 'file',
            },
          },
        ],
      },
      {
        type: 'paragraph',
        content: [],
      },
    ],
  };
  it('should dispatch media picker events', async () => {
    sendSampleMediaEvents();
    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(contentWithMedia);
  });
  it('should update content on native side', async () => {
    const mock = sinon.mock(toNativeBridge);
    mock
      .expects('updateText')
      .atLeast(1)
      .calledWith(JSON.stringify(contentWithMedia));
    sendSampleMediaEvents();
    mock.verify();
  });
});

function sendSampleMediaEvents() {
  bridge.onMediaPicked(
    'uploads-start',
    '{"files":[{"id":"116ba70f-9e28-41a1-ac81-6cdaef0665a0","name":"IMG_20180406_001117.jpg","type":"file"}]}',
  );
  bridge.onMediaPicked(
    'upload-status-update',
    '{"file":{"id":"116ba70f-9e28-41a1-ac81-6cdaef0665a0","name":"IMG_20180406_001117.jpg","type":"file"},"progress":{"absolute":0.0,"max":100,"portion":0}}',
  );
  bridge.onMediaPicked(
    'upload-processing',
    '{"file":{"id":"116ba70f-9e28-41a1-ac81-6cdaef0665a0","name":"IMG_20180406_001117.jpg","type":"file","publicId":"e94c3f67-5ac3-42b2-bf6a-ce35bb787894"}}',
  );
  bridge.onMediaPicked(
    'upload-end',
    '{"file":{"id":"e94c3f67-5ac3-42b2-bf6a-ce35bb787894","name":"IMG_20180406_001117.jpg","type":"file","publicId":"e94c3f67-5ac3-42b2-bf6a-ce35bb787894"},"public":{}}',
  );
}

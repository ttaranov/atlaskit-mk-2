import mobileEditor from '../../../src/mobile-editor-element';
import { mount } from 'enzyme';
import * as sinon from 'sinon';
import { ContextFactory } from '@atlaskit/media-core';

export async function mountEditor() {
  const place = document.body.appendChild(document.createElement('div'));
  const mediaProviderStub = sinon.stub();
  mediaProviderStub.resolves({
    uploadParams: {
      collection: 'testCollection',
    },
  });
  const editor = mount(mobileEditor({ mediaProvider: mediaProviderStub }), {
    attachTo: place,
  });
  const provider = await editor.props().media.provider;
  return editor;
}

import mobileEditor from '../../../src/mobile-editor-element';
import { mount } from 'enzyme';
import {
  storyMediaProviderFactory,
  sleep,
} from '@atlaskit/editor-test-helpers';

export async function mountEditor() {
  const place = document.body.appendChild(document.createElement('div'));
  const mediaProvider = storyMediaProviderFactory({});
  const provider = await mediaProvider;
  await provider.uploadContext;
  const editor = mount(mobileEditor({ mediaProvider: mediaProvider }), {
    attachTo: place,
  });
  await editor.props().media.provider;
  await sleep(100);
  return editor;
}

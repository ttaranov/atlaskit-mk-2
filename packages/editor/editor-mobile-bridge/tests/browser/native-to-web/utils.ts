import mobileEditor from '../../../src/mobile-editor-element';
import { mount } from 'enzyme';

export async function mountEditor() {
  const place = document.body.appendChild(document.createElement('div'));
  const editor = mount(mobileEditor(), { attachTo: place });
  const provider = await editor.props().media.provider;
  await provider.viewContext;
  await provider.uploadContext;
  return editor;
}

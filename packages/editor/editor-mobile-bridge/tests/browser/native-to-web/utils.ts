import mobileEditor from '../../../src/mobile-editor-element';
import { mount } from 'enzyme';

export function mountEditor(editor) {
  const place = document.body.appendChild(document.createElement('div'));
  return mount(mobileEditor(), { attachTo: place });
}

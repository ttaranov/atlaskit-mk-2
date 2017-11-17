import { name } from '../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import Editor from '../../../src/editor';
import { makeEditor, doc, p, storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import { Plugin, PluginKey } from 'prosemirror-state';
import getPropsPreset from '../../../src/editor/create-editor/get-props-preset';

describe(name, () => {
  describe('<Editor />', () => {
    it('should call destroy() on plugin states when it gets unmounted', () => {
      const mediaProvider = storyMediaProviderFactory({ includeUserAuthProvider: true });
      const wrapper = mount(
        <Editor mediaProvider={mediaProvider} />
      );

      const editorDescr = wrapper.state('editor');
      expect(typeof editorDescr).toBe('object');
      expect(typeof editorDescr.editorView).toBe('object');
      expect(typeof editorDescr.editorView.state).toBe('object');
      expect(typeof editorDescr.editorView.state.plugins).toBe('object');

      const { state } = editorDescr.editorView;
      const spies = editorDescr.editorView.state.plugins
        .map(plugin => plugin.getState(state))
        .filter(state => !!state)
        .filter(state => !!state.destroy)
        .map(state => jest.spyOn(state, 'destroy'))
      ;

      expect(spies.length).toBeGreaterThan(0);
     
      wrapper.unmount();
      spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
    });
  });
});

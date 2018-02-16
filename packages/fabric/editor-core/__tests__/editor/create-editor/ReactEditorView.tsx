import { name } from '../../../package.json';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { TextSelection } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  defaultSchema,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';
import ReactEditorView, {
  EditorViewState,
} from '../../../src/editor/create-editor/ReactEditorView';
import { toJSON } from '../../../src/utils';

describe(name, () => {
  describe('<ReactEditorView />', () => {
    it('should place the initial selection at the end of the document', () => {
      const document = doc(p('hello{endPos}'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{ defaultValue: toJSON(document) }}
          providerFactory={new ProviderFactory()}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.state() as EditorViewState;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.endPos);
    });

    it('should place the initial selection at the start/end when document is empty', () => {
      const document = doc(p('{endPos}'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{}}
          providerFactory={new ProviderFactory()}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.state() as EditorViewState;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.endPos);
    });
  });

  it('should call destroy() on plugin states when it gets unmounted', () => {
    let spies;
    const mediaProvider = storyMediaProviderFactory({
      includeUserAuthProvider: true,
    });
    const wrapper = mount(
      <ReactEditorView
        editorProps={{
          mediaProvider: mediaProvider,
        }}
        providerFactory={ProviderFactory.create({ mediaProvider })}
        onEditorCreated={({ state }) => {
          spies = state.plugins
            .map(plugin => plugin.getState(state))
            .filter(state => !!state && !!state.destroy)
            .map(state => jest.spyOn(state, 'destroy'));
        }}
        onEditorDestroyed={() => {}}
      />,
    );

    expect(spies.length).toBeGreaterThan(0);
    wrapper.unmount();

    spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
  });
});

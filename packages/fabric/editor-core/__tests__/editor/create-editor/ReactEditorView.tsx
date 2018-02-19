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
import ReactEditorView from '../../../src/editor/create-editor/ReactEditorView';
import { toJSON } from '../../../src/utils';
import { patchEditorViewForJSDOM } from '@atlaskit/editor-test-helpers/';

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
      const { editorState } = wrapper.instance() as ReactEditorView;
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
      const { editorState } = wrapper.instance() as ReactEditorView;
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
        onEditorCreated={({ view }) => {
          spies = view.state.plugins
            .map(plugin => plugin.getState(view.state))
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

  describe('when a transaction is dispatched', () => {
    it('should not trigger a re-render', () => {
      const wrapper = mount(
        <ReactEditorView
          editorProps={{}}
          providerFactory={ProviderFactory.create({})}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );

      const editor = wrapper.instance() as ReactEditorView;
      patchEditorViewForJSDOM(editor.view);

      const renderSpy = jest.spyOn(editor, 'render');
      editor.view!.dispatch(editor.view!.state.tr);

      expect(renderSpy).toHaveBeenCalledTimes(0);
    });
  });
});

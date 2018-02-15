import { name } from '../../../package.json';
import { shallow } from 'enzyme';
import * as React from 'react';
import { TextSelection } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import { doc, p, defaultSchema } from '@atlaskit/editor-test-helpers';
import ReactEditorView, {
  EditorViewState,
} from '../../../src/editor/create-editor/ReactEditorView';
import { toJSON } from '../../../src/utils';

describe.only(name, () => {
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
});

import {
  createEditor,
  doc,
  p,
  createEvent,
} from '@atlaskit/editor-test-helpers';
import { focusStateKey } from '../../../../plugins/base/pm-plugins/focus-handler';

const editor = (doc: any) => {
  return createEditor({ doc, pluginKey: focusStateKey });
};

const event = createEvent('event');

describe('isEditorFocused', () => {
  it('should set to `true` when a focus event fires', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));
    plugin.props.handleDOMEvents!.blur(editorView, event);
    plugin.props.handleDOMEvents!.focus(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(true);
  });

  it('should set to `false` when a blur event fires', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));

    plugin.props.handleDOMEvents!.blur(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(false);
  });

  it('should set to `true` when a click event fires and editor is not focused', () => {
    const { plugin, editorView } = editor(doc(p('{<>}')));

    jest.spyOn(editorView, 'hasFocus').mockReturnValue(true);
    plugin.props.handleDOMEvents!.blur(editorView, event);
    plugin.props.handleDOMEvents!.click(editorView, event);

    const isEditorFocused = focusStateKey.getState(editorView.state);
    expect(isEditorFocused).toBe(true);
  });
});

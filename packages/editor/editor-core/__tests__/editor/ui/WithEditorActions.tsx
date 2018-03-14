import { mount } from 'enzyme';
import * as React from 'react';
import EditorContext from '../../../src/editor/ui/EditorContext';
import EditorActions from '../../../src/editor/actions';
import WithEditorActions from '../../../src/editor/ui/WithEditorActions';

describe('WithEditorActions', () => {
  it('should render component with editorActions', () => {
    const editorActions = new EditorActions();
    const component = jest.fn(() => null);
    const wrapper = mount(
      <EditorContext editorActions={editorActions}>
        <WithEditorActions render={component} />
      </EditorContext>,
    );
    expect(component).toBeCalledWith(editorActions);
    wrapper.unmount();
  });

  it('should re-render component after editor is registered in editorActions', () => {
    const mockEditorView: any = {};
    const editorActions = new EditorActions();
    const component = jest.fn(() => null);
    const wrapper = mount(
      <EditorContext editorActions={editorActions}>
        <WithEditorActions render={component} />
      </EditorContext>,
    );
    editorActions._privateRegisterEditor(mockEditorView, {} as any);
    wrapper.update();
    const lastCall: any = component.mock.calls.pop();
    const [actions]: [EditorActions] = lastCall;
    expect(actions._privateGetEditorView()).toBe(mockEditorView);
    wrapper.unmount();
  });
});

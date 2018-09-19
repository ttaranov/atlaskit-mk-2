import * as React from 'react';
import { mount } from 'enzyme';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import { Status } from '@atlaskit/status';
import StatusNodeView from '../../../../../plugins/status/nodeviews/status';
import statusPlugin from '../../../../../plugins/status';
import * as Actions from '../../../../../plugins/status/actions';

describe('Status - NodeView', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [statusPlugin],
    });
  };

  it('should use status component', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.insertStatus({
      text: 'In progress',
      color: 'blue',
      localId: '666',
    })(view.state, view.dispatch);

    const wrapper = mount(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeBefore!}
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe('In progress');
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should call setStatusPickerAt on click', () => {
    const setStatusPickerAtSpy = jest.spyOn(Actions, 'setStatusPickerAt');
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.insertStatus({
      text: 'In progress',
      color: 'blue',
      localId: '666',
    })(view.state, view.dispatch);

    const wrapper = mount(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeBefore!}
      />,
    );
    wrapper.simulate('click');

    expect(setStatusPickerAtSpy).toBeCalled();
  });
});

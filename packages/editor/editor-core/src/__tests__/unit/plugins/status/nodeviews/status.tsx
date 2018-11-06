import * as React from 'react';
import { ReactWrapper } from 'enzyme';
import { Selection } from 'prosemirror-state';
import {
  createEditor,
  doc,
  p,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { Status } from '@atlaskit/status';
import StatusNodeView, {
  Props as StatusNodeViewProps,
  State as StatusNodeViewState,
  StatusContainer,
  messages,
} from '../../../../../plugins/status/nodeviews/status';
import statusPlugin from '../../../../../plugins/status';
import {
  pluginKey,
  SelectionChange,
  StatusState,
} from '../../../../../plugins/status/plugin';
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
    })(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeBefore!}
        getPos={jest.fn()}
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe('In progress');
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
  });

  it('should use status as placeholder when no text', () => {
    const { editorView: view } = editor(doc(p('Status: {<>}')));

    Actions.insertStatus({
      text: '',
      color: 'blue',
      localId: '666',
    })(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeBefore!}
        getPos={jest.fn()}
      />,
    );
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe(
      messages.placeholder.defaultMessage,
    );
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
    })(view);

    const wrapper = mountWithIntl(
      <StatusNodeView
        view={view}
        node={view.state.selection.$from.nodeBefore!}
        getPos={jest.fn()}
      />,
    );
    wrapper.simulate('click');

    expect(setStatusPickerAtSpy).toBeCalled();
  });

  describe('selection', () => {
    let wrapper: ReactWrapper<StatusNodeViewProps, StatusNodeViewState>;
    let getPos: jest.Mock<number>;
    let selectionChanges: SelectionChange;

    const createSelection = (from: number, to?: number): Selection => {
      const actualTo = to === undefined ? from : to;
      return {
        from,
        to: actualTo,
        eq: selection => selection.from === from && selection.to === actualTo,
      } as any;
    };

    beforeEach(() => {
      const { editorView: view } = editor(doc(p('Status: {<>}')));

      const pluginState: StatusState = pluginKey.getState(view.state);
      selectionChanges = pluginState.selectionChanges;

      Actions.insertStatus({
        text: 'In progress',
        color: 'blue',
        localId: '666',
      })(view);

      getPos = jest.fn();

      wrapper = mountWithIntl(
        <StatusNodeView
          view={view}
          node={view.state.selection.$from.nodeBefore!}
          getPos={getPos}
        />,
      );
      expect(wrapper.find(Status).length).toBe(1);
    });

    it('not selected after insert', () => {
      expect(wrapper.state().selected).toBe(false);
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(false);
    });

    it('selection of status', () => {
      getPos.mockReturnValue(1);
      selectionChanges.notifyNewSelection(
        createSelection(1, 2),
        createSelection(0),
      );
      wrapper.update();
      expect(wrapper.state().selected).toBe(true);
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);
    });

    it('collapsed selection immediately after status', () => {
      getPos.mockReturnValue(2);
      selectionChanges.notifyNewSelection(
        createSelection(1),
        createSelection(0),
      );
      wrapper.update();
      expect(wrapper.state().selected).toBe(false);
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(false);
    });

    it('selection including status', () => {
      getPos.mockReturnValue(5);
      selectionChanges.notifyNewSelection(
        createSelection(1, 10),
        createSelection(0),
      );
      wrapper.update();
      expect(wrapper.state().selected).toBe(true);
      expect(wrapper.find(StatusContainer).prop('selected')).toBe(true);
    });
  });
});

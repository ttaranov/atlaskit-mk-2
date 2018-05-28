import { shallow, mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import {
  PanelState,
  stateKey,
} from '../../../../src/plugins/panel/pm-plugins/main';
import PanelEdit from '../../../../src/plugins/panel/ui/PanelEdit';

import {
  doc,
  panel,
  p,
  createEditor,
  createEvent,
} from '@atlaskit/editor-test-helpers';
import panelPlugin from '../../../../src/plugins/panel';
import listPlugin from '../../../../src/plugins/lists';

describe('@atlaskit/editor-core ui/PanelEdit', () => {
  const event = createEvent('event');
  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor<PanelState>({
      doc,
      editorPlugins: [panelPlugin, listPlugin],
      editorProps: {
        analyticsHandler: trackEvent,
      },
      pluginKey: stateKey,
    });

  it('should return null if state variable toolbarVisible is false', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const panelEditOptions = shallow(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    panelEditOptions.setState({ toolbarVisible: false });
    expect(panelEditOptions.html()).toEqual(null);
  });

  it('should not return null if state variable toolbarVisible is true', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const panelEditOptions = shallow(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    panelEditOptions.setState({ toolbarVisible: true });
    expect(panelEditOptions.html()).not.toBe(null);
  });

  it('should have 6 buttons in it', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    panelEditOptions.setState({ toolbarVisible: true });
    expect(panelEditOptions.find('button').length).toEqual(6);
  });

  it('should set toolbarVisible to true when panel is clicked', () => {
    const { plugin, editorView, pluginState, sel } = editor(
      doc(panel()(p('text'))),
    );
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.focus(editorView, event);
    plugin.props.handleClick!(editorView, sel, event);
    pluginState.update(
      editorView.state,
      editorView.domAtPos.bind(editorView),
      true,
    );
    expect(panelEditOptions.state('toolbarVisible')).toBe(true);
    panelEditOptions.unmount();
  });

  it('should set toolbarVisible to false when panel is blur', () => {
    const { plugin, editorView, pluginState } = editor(doc(panel()(p('text'))));
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.blur(editorView, event);
    expect(panelEditOptions.state('toolbarVisible')).not.toBe(true);
    panelEditOptions.unmount();
  });

  it('should continue toolbarVisible to true when panelType is changed', () => {
    const { plugin, editorView, pluginState } = editor(doc(panel()(p('text'))));
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.focus(editorView, event);
    pluginState.changePanelType(editorView, { panelType: 'note' });
    expect(panelEditOptions.state('toolbarVisible')).toBe(true);
    panelEditOptions.unmount();
  });

  it('should set toolbarVisible to false when panel is removed', () => {
    const { plugin, editorView, pluginState } = editor(doc(panel()(p('text'))));
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    plugin.props.handleDOMEvents!.focus(editorView, event);
    pluginState.removePanel(editorView);
    expect(panelEditOptions.state('toolbarVisible')).toBe(false);
    panelEditOptions.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      trackEvent = jest.fn();
      const { plugin, editorView, pluginState, sel } = editor(
        doc(panel()(p('text{<>}'))),
        trackEvent,
      );
      toolbarOption = mount(
        <PanelEdit pluginState={pluginState} editorView={editorView} />,
      );
      plugin.props.handleDOMEvents!.focus(editorView, event);
      plugin.props.handleClick!(editorView, sel, event);
      toolbarOption.update();
    });
    afterEach(() => {
      toolbarOption.unmount();
    });
    ['info', 'note', 'success', 'warning', 'error'].forEach(
      (panelType, index) => {
        it(`should trigger analyticsService.trackEvent when ${panelType} button is clicked`, () => {
          toolbarOption
            .find(AkButton)
            .at(index)
            .simulate('click');
          expect(trackEvent).toHaveBeenCalledWith(
            `atlassian.editor.format.${panelType}.button`,
          );
        });
      },
    );
  });
});

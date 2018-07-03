import { shallow, mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import {
  PanelState,
  pluginKey as stateKey,
} from '../../../../../plugins/panel/pm-plugins/main';
import PanelEdit from '../../../../../plugins/panel/ui/PanelEdit';

import { doc, panel, p, createEditor } from '@atlaskit/editor-test-helpers';
import panelPlugin from '../../../../../plugins/panel';
import listPlugin from '../../../../../plugins/lists';
import { changePanelType } from '../../../../../plugins/panel/actions';

describe('@atlaskit/editor-core ui/PanelEdit', () => {
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
    const pluginState = {
      toolbarVisible: false,
      element: '<div></div>',
      activePanelType: 'info',
    };
    const panelEditOptions = shallow(<PanelEdit pluginState={pluginState} />);
    expect(panelEditOptions.html()).toEqual(null);
  });

  it('should not return null if state variable toolbarVisible is true', () => {
    const pluginState = {
      toolbarVisible: true,
      element: '<div></div>',
      activePanelType: 'info',
    };
    const panelEditOptions = shallow(<PanelEdit pluginState={pluginState} />);
    expect(panelEditOptions.html()).not.toBe(null);
  });

  it('should have 6 buttons in it', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const panelEditOptions = mount(
      <PanelEdit pluginState={pluginState} editorView={editorView} />,
    );
    expect(panelEditOptions.find('button').length).toEqual(6);
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      trackEvent = jest.fn();
      const { editorView, pluginState } = editor(
        doc(panel()(p('text{<>}'))),
        trackEvent,
      );
      toolbarOption = mount(
        <PanelEdit
          pluginState={pluginState}
          editorView={editorView}
          onRemove={() => {}}
          onPanelChange={panelType =>
            changePanelType(panelType)(editorView.state, editorView.dispatch)
          }
        />,
      );
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

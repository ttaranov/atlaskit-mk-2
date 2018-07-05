import { mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import { doc, p, createEditor } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../../src/analytics';
import listPlugin from '../../../../src/plugins/lists';
import tasksAndDecisionsPlugin from '../../../../src/plugins/tasks-and-decisions';
import {
  ListsState,
  stateKey,
} from '../../../../src/plugins/lists/pm-plugins/main';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import DropdownMenu from '../../../../src/ui/DropdownMenu';
import ToolbarLists from '../../../../src/plugins/lists/ui/ToolbarLists';

describe('ToolbarLists', () => {
  const editor = (doc: any) =>
    createEditor<ListsState>({
      doc,
      editorPlugins: [listPlugin, tasksAndDecisionsPlugin],
      pluginKey: stateKey,
    });

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const toolbarLists = mount(
      <ToolbarLists
        disabled={true}
        pluginState={pluginState}
        editorView={editorView}
      />,
    );

    toolbarLists.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).toBe(true);
    });
    toolbarLists.unmount();
  });

  it('should have a dropdown if option isSmall = true', () => {
    const { pluginState, editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarLists
        pluginState={pluginState}
        editorView={editorView}
        isSmall={true}
      />,
    );
    expect(toolbarOption.find(DropdownMenu).length).toEqual(1);
    toolbarOption.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text{<>}')));
      toolbarOption = mount(
        <ToolbarLists
          pluginState={pluginState}
          editorView={editorView}
          enableTaskDecisionToolbar={true}
        />,
      );
      trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    it('should trigger analyticsService.trackEvent when bulleted list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .first()
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.bullet.button',
      );
    });

    it('should trigger analyticsService.trackEvent when numbered list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .at(1)
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.list.numbered.button',
      );
    });

    it('should trigger analyticsService.trackEvent when task list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .filterWhere(node => node.html().indexOf('Create action') > 0)
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.action.trigger.button',
      );
    });

    it('should trigger analyticsService.trackEvent when decision list button is clicked', () => {
      toolbarOption
        .find(AkButton)
        .filterWhere(node => node.html().indexOf('Create decision') > 0)
        .simulate('click');
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.fabric.decision.trigger.button',
      );
    });
  });
});

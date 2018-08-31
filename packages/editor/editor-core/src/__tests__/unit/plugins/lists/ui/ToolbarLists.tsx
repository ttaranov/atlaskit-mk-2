import { mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import { doc, p, createEditor } from '@atlaskit/editor-test-helpers';
import { analyticsService } from '../../../../../analytics';
import listPlugin from '../../../../../plugins/lists';
import tasksAndDecisionsPlugin from '../../../../../plugins/tasks-and-decisions';
import {
  ListsPluginState,
  pluginKey,
} from '../../../../../plugins/lists/pm-plugins/main';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarLists from '../../../../../plugins/lists/ui/ToolbarLists';

describe('ToolbarLists', () => {
  const editor = (doc: any) =>
    createEditor<ListsPluginState>({
      doc,
      editorPlugins: [listPlugin, tasksAndDecisionsPlugin],
      pluginKey,
    });

  it('should render disabled ToolbarButtons if disabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarLists = mount(
      <ToolbarLists disabled={true} editorView={editorView} />,
    );

    toolbarLists.find(ToolbarButton).forEach(node => {
      expect(node.prop('disabled')).toBe(true);
    });
    toolbarLists.unmount();
  });

  it('should have a dropdown if option isSmall = true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarLists editorView={editorView} isSmall={true} />,
    );
    expect(toolbarOption.find(DropdownMenu).length).toEqual(1);
    toolbarOption.unmount();
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView } = editor(doc(p('text{<>}')));
      toolbarOption = mount(
        <ToolbarLists editorView={editorView} allowTasks={true} />,
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
  });
});

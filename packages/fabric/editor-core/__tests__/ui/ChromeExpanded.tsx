import { mount } from 'enzyme';
import * as React from 'react';
import AkButton from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import { doc, p, makeEditor } from '@atlaskit/editor-test-helpers';
import ChromeExpanded from '../../src/ui/ChromeExpanded';
import HyperlinkEdit from '../../src/ui/HyperlinkEdit';
import LanguagePicker from '../../src/ui/LanguagePicker';
import MentionPicker from '../../src/ui/MentionPicker';
import EmojiTypeAhead from '../../src/ui/EmojiTypeAhead';
import PanelEdit from '../../src/ui/PanelEdit';
import ToolbarMention from '../../src/ui/ToolbarMention';
import ToolbarHelp from '../../src/ui/ToolbarHelp';
import HelpDialog from '../../src/ui/HelpDialog';
import ToolbarImage from '../../src/ui/ToolbarImage';
import ToolbarMedia from '../../src/ui/ToolbarMedia';
import { Content } from '../../src/ui/ChromeExpanded/styles';
import { analyticsService } from '../../src/analytics';
import { browser } from '@atlaskit/editor-common';

const noop = () => {};

describe('@atlaskit/editor-core/ui/ChromeExpanded', () => {
  const editor = (doc: any) =>
    makeEditor({
      doc,
    });

  describe('props', () => {
    it('should render enabled save button by default', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded editorView={editorView} onSave={noop} />,
      );

      const button = chrome
        .find(AkButton)
        .filterWhere(node => node.text() === 'Save');
      expect(button.prop('isDisabled')).toBe(false);
    });

    it('should render enabled save button if saveDisabled=false', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={false}
        />,
      );

      const button = chrome
        .find(AkButton)
        .filterWhere(node => node.text() === 'Save');
      expect(button.prop('isDisabled')).toBe(false);
    });

    it('should render Spinner if showSpinner=true and saveDisabled=true', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={true}
          showSpinner={true}
        />,
      );

      const spinnerInsideSave = chrome.find(Spinner).filterWhere(
        node =>
          node
            .parent()
            .parent()
            .text() === 'Save',
      );
      expect(spinnerInsideSave).not.toBe(undefined);
    });

    it("should add maxHeight to content section if it's passed", () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={false}
          maxHeight={75}
        />,
      );

      const wrapper = chrome
        .find(Content)
        .find('div')
        .at(1);
      expect(!!wrapper).toBe(true);
      const props = wrapper.props();
      expect(!!props['style']).toBe(true);
      expect(props['style']!.maxHeight).toEqual('75px');
    });

    it('should not set height if props.height is undefined', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={false}
        />,
      );

      const wrapper = chrome
        .find(Content)
        .find('div')
        .at(1);
      const props = wrapper.props()!;
      expect(props.style!.height).toBe(undefined);
    });

    it('should not set borders if only props.height is set', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={false}
          height={75}
        />,
      );

      const wrapper = chrome
        .find(Content)
        .find('div')
        .at(1);
      const props = wrapper.props()!;
      expect(props.style!.borderBottom).toBe(undefined);
    });

    it('should render disabled save button if saveDisabled=true', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          saveDisabled={true}
        />,
      );

      const button = chrome
        .find(AkButton)
        .filterWhere(node => node.text() === 'Save');
      expect(button.prop('isDisabled')).toBe(true);
    });

    it('should disable UI elements when disabled=true', () => {
      const { editorView } = editor(doc(p()));
      const chrome = mount(
        <ChromeExpanded
          editorView={editorView}
          onSave={noop}
          disabled={true}
        />,
      );

      expect(chrome.find(HyperlinkEdit).length).toBe(0);
      expect(chrome.find(LanguagePicker).length).toBe(0);
      expect(chrome.find(MentionPicker).length).toBe(0);
      expect(chrome.find(EmojiTypeAhead).length).toBe(0);
      expect(chrome.find(PanelEdit).length).toBe(0);
      expect(chrome.find(ToolbarMention).length).toBe(0);
      expect(chrome.find(ToolbarImage).length).toBe(0);
      expect(chrome.find(ToolbarMedia).length).toBe(0);
    });

    describe('analytics', () => {
      let trackEvent;
      let toolbarOption;
      beforeEach(() => {
        const { editorView } = editor(doc(p()));
        toolbarOption = mount(
          <ChromeExpanded
            editorView={editorView}
            onSave={noop}
            onCancel={noop}
            saveDisabled={true}
          />,
        );
        trackEvent = jest.fn();
        analyticsService.trackEvent = trackEvent;
      });

      it('should trigger analyticsService.trackEvent when save button is clicked', () => {
        toolbarOption
          .find(AkButton)
          .filterWhere(n => n.text() === 'Save')
          .simulate('click');
        expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.stop.save');
      });

      it('should trigger analyticsService.trackEvent when cancel button is clicked', () => {
        toolbarOption
          .find(AkButton)
          .filterWhere(n => n.text() === 'Cancel')
          .simulate('click');
        expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.stop.cancel');
      });
    });
  });

  describe('helpDialog', () => {
    let keyEvent;
    beforeEach(() => {
      if (browser.mac) {
        keyEvent = { metaKey: true, key: '/' };
      } else {
        keyEvent = { ctrlKey: true, key: '/' };
      }
    });

    it('should set state variable showHelp true if help dialog is present and Cmd-/ is entered', () => {
      const { editorView } = editor(doc(p()));
      const chromeExpanded = mount(
        <ChromeExpanded
          editorView={editorView}
          helpDialogPresent={true}
          onSave={noop}
          onCancel={noop}
          saveDisabled={true}
        />,
      );
      expect(chromeExpanded.state('showHelp')).toBe(false);
      chromeExpanded.simulate('keyDown', keyEvent);
      expect(chromeExpanded.state('showHelp')).toBe(true);
      const toolbarHelp = chromeExpanded.find(ToolbarHelp);
      expect(toolbarHelp.prop('showHelp')).toBe(true);
    });

    it('should set state variable showHelp true when open help dialog button is clicked', () => {
      const { editorView } = editor(doc(p()));
      const chromeExpanded = mount(
        <ChromeExpanded
          editorView={editorView}
          helpDialogPresent={true}
          onSave={noop}
          onCancel={noop}
          saveDisabled={true}
        />,
      );
      expect(chromeExpanded.state('showHelp')).toBe(false);
      const toolbarHelp = chromeExpanded.find(ToolbarHelp);
      toolbarHelp.find(AkButton).simulate('click');
      expect(chromeExpanded.state('showHelp')).toBe(true);
      const helpDialog = toolbarHelp.find(HelpDialog);
      expect(helpDialog.isEmpty()).toBe(false);
    });

    it('should track analytics when helpDialog is opened using key event Cmd-/', () => {
      const { editorView } = editor(doc(p()));
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const chromeExpanded = mount(
        <ChromeExpanded
          editorView={editorView}
          helpDialogPresent={true}
          onSave={noop}
          onCancel={noop}
          saveDisabled={true}
        />,
      );
      chromeExpanded.simulate('keyDown', keyEvent);
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.help.keyboard');
    });

    it('should reset state variable showHelp if help dialog is present and Escape is entered', () => {
      const { editorView } = editor(doc(p()));
      const chromeExpanded = mount(
        <ChromeExpanded
          editorView={editorView}
          helpDialogPresent={true}
          onSave={noop}
          onCancel={noop}
          saveDisabled={true}
        />,
      );
      chromeExpanded.setState({ showHelp: true });
      expect(chromeExpanded.state('showHelp')).toBe(true);
      chromeExpanded.simulate('keyDown', { key: 'Escape' });
      expect(chromeExpanded.state('showHelp')).toBe(false);
      const toolbarHelp = chromeExpanded.find(ToolbarHelp);
      expect(toolbarHelp.prop('showHelp')).toBe(false);
    });
  });
});

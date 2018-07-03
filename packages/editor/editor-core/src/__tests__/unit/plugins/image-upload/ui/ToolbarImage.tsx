import { mount } from 'enzyme';
import * as React from 'react';
import {
  ImageUploadState,
  stateKey,
} from '../../../../../plugins/image-upload/pm-plugins/main';
import ToolbarImage from '../../../../../plugins/image-upload/ui/ToolbarImage';
import AkButton from '@atlaskit/button';
import {
  doc,
  code_block,
  p,
  createEditor,
} from '@atlaskit/editor-test-helpers';
import imageUpload from '../../../../../plugins/image-upload';
import codeBlockPlugin from '../../../../../plugins/code-block';
import mediaPlugin from '../../../../../plugins/media';

describe('ToolbarImage', () => {
  const editor = (doc: any, analyticsHandler = () => {}) =>
    createEditor<ImageUploadState>({
      doc,
      editorPlugins: [
        imageUpload,
        codeBlockPlugin(),
        mediaPlugin({ allowMediaSingle: true }),
      ],
      editorProps: { analyticsHandler },
      pluginKey: stateKey,
    });

  describe('when plugin is enabled', () => {
    it('sets disabled to false', () => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const toolbarImage = mount(
        <ToolbarImage pluginState={pluginState} editorView={editorView} />,
      );

      expect(toolbarImage.state('disabled')).toBe(false);
      toolbarImage.unmount();
    });
  });

  describe('when selection is inside code block', () => {
    it('sets disabled to false', () => {
      const { editorView, pluginState } = editor(doc(code_block()('text')));
      const toolbarImage = mount(
        <ToolbarImage pluginState={pluginState} editorView={editorView} />,
      );

      expect(toolbarImage.state('disabled')).toBe(false);
      toolbarImage.unmount();
    });
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent', () => {
      const trackEvent = jest.fn();
      const { editorView, pluginState } = editor(doc(p('text')), trackEvent);
      const spy = jest.spyOn(pluginState, 'handleImageUpload');
      spy.mockImplementation(() => true);
      const toolbarOption = mount(
        <ToolbarImage pluginState={pluginState} editorView={editorView} />,
      );
      toolbarOption.find(AkButton).simulate('click');
      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.image.button');
      toolbarOption.unmount();
      spy.mockRestore();
    });
  });
});

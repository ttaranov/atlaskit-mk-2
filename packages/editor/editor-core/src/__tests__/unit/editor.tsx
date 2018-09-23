import { name } from '../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import Editor from '../../editor';
import { EditorView } from 'prosemirror-view';
import Button from '@atlaskit/button';
import { insertText, sendKeyToPm } from '@atlaskit/editor-test-helpers';

describe(name, () => {
  describe('Editor', () => {
    describe('callbacks', () => {
      it('should fire onChange when text is inserted', () => {
        const handleChange = jest.fn();

        const wrapper = mount(<Editor onChange={handleChange} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        insertText(editorView, 'hello', 0);
        expect(handleChange).toHaveBeenCalled();
      });

      describe('Comment appearance', () => {
        it('should fire onSave when Save is clicked', () => {
          const handleSave = jest.fn();
          const wrapper = mount(
            <Editor onSave={handleSave} appearance="comment" />,
          );

          const saveButton = wrapper.find(Button).findWhere(node => {
            return node.type() !== undefined && node.text() === 'Save';
          });

          saveButton.first().simulate('click');
          expect(handleSave).toHaveBeenCalled();
        });

        it('should fire onCancel when Cancel is clicked', () => {
          const cancelled = jest.fn();
          const wrapper = mount(
            <Editor onCancel={cancelled} appearance="comment" />,
          );

          const cancelButton = wrapper.find(Button).findWhere(node => {
            return node.type() !== undefined && node.text() === 'Cancel';
          });

          cancelButton.first().simulate('click');
          expect(cancelled).toHaveBeenCalled();
        });
      });
    });

    describe('save on enter', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(
          <Editor onSave={handleSave} saveOnEnter={true} />,
        );

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });

    describe('submit-editor (save on mod-enter)', () => {
      it('should fire onSave when user presses Enter', () => {
        const handleSave = jest.fn();
        const wrapper = mount(<Editor onSave={handleSave} />);

        const editorView: EditorView = (wrapper.instance() as any).editorActions
          .editorView;

        sendKeyToPm(editorView, 'Mod-Enter');
        expect(handleSave).toHaveBeenCalled();
      });
    });
  });
});

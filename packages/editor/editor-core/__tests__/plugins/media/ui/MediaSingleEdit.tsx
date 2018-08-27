import * as React from 'react';
import { mount } from 'enzyme';
import {
  doc,
  mediaSingle,
  media,
  randomId,
  createEditor,
  bodiedExtension,
  layoutColumn,
  layoutSection,
  p,
} from '@atlaskit/editor-test-helpers';
import { stateKey as pluginKey } from '../../../../src/plugins/media/pm-plugins/main';
import ToolbarButton from '../../../../src/ui/ToolbarButton';
import MediaSingleEdit from '../../../../src/plugins/media/ui/MediaSingleEdit';

describe('@atlaskit/editor-core/ui/MediaSingleEdit', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        media: {
          provider: new Promise(() => {}),
          allowMediaSingle: true,
        },
        allowExtension: true,
        allowLayouts: true,
      },
    });
  it('should have layout options if media single not inside bodied extension', () => {
    const { editorView } = editor(
      doc(
        mediaSingle({ layout: 'center' })(
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'image/png',
            width: 100,
            height: 100,
          })(),
        ),
      ),
    );
    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mount(
      <MediaSingleEdit pluginState={pluginState} />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );
    expect(
      mediaSingleEdit.findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(0);
    mediaSingleEdit.unmount();
  });

  it('should not have layout options if media single inside bodied extension', () => {
    const { editorView } = editor(
      doc(
        bodiedExtension({
          extensionKey: 'extensionKey',
          extensionType: 'bodiedExtension',
        })(
          mediaSingle({ layout: 'center' })(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
              width: 100,
              height: 100,
            })(),
          ),
        ),
      ),
    );
    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mount(
      <MediaSingleEdit pluginState={pluginState} />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );
    expect(
      mediaSingleEdit.findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(3);
    mediaSingleEdit.unmount();
  });

  it('should not have layout options if media single inside layoutSection', () => {
    const { editorView } = editor(
      doc(
        layoutSection()(
          layoutColumn(p('')),
          layoutColumn(
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                __fileMimeType: 'image/png',
                width: 100,
                height: 100,
              })(),
            ),
          ),
        ),
      ),
    );
    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mount(
      <MediaSingleEdit pluginState={pluginState} />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );
    expect(
      mediaSingleEdit.findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(3);
    mediaSingleEdit.unmount();
  });
});

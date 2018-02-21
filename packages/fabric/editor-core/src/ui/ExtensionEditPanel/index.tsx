import * as React from 'react';
import { EditorState } from 'prosemirror-state';
import { Popup } from '@atlaskit/editor-common';
import { pluginKey } from '../../editor/plugins/extension/plugin';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { Toolbar, Separator } from './styles';

export interface Props {
  element: HTMLElement | null;
  editorState: EditorState;
  onEdit: () => void;
  onRemove: () => void;
}

export default (props: Props) => {
  const { element, editorState } = props;
  const meta = pluginKey.getState(editorState);

  // handledExternally means the extension handler will take care of the toolbar
  if (!element || meta.handledExternally) {
    return null;
  }

  return (
    <Popup target={element} offset={[0, 8]} alignX="right">
      <Toolbar>
        <ToolbarButton
          onClick={props.onEdit}
          iconBefore={<EditIcon label="Edit extension" />}
        />
        <Separator />
        <ToolbarButton
          onClick={props.onRemove}
          iconBefore={<RemoveIcon label="Remove extension" />}
        />
      </Toolbar>
    </Popup>
  );
};

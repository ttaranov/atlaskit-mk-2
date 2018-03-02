import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { Toolbar, Separator, ItemWrapper } from './styles';

// Exporting these items so products can build toolbars that look exactly like this.
export {
  Toolbar as ExtensionToolbarWrapper,
  Separator as ExtensionToolbarSeparator,
  ToolbarButton as ExtensionToolbarButton,
  ItemWrapper as ExtensionToolbarItemWrapper,
};

export interface Props {
  element?: HTMLElement | null;
  onEdit: () => void;
  onRemove: () => void;
}

export default (props: Props) => {
  const { element } = props;

  if (!element) {
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

import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Toolbar, Separator } from './styles';
export interface Props {
  element: HTMLElement | null;
  onEdit: () => void;
  onRemove: () => void;
  stickToolbarToBottom?: boolean;
}

export default (props: Props) => {
  const { element, stickToolbarToBottom } = props;
  if (!element) {
    return null;
  }

  return (
    <Popup
      target={element}
      offset={[0, 8]}
      alignX="right"
      stickToBottom={stickToolbarToBottom}
      ariaLabel="Extension options"
    >
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

import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { Toolbar, Separator } from './styles';

// Exporting these items so products can build toolbars that look exactly like this.
export { Toolbar, Separator, ToolbarButton };

export interface Props {
  element?: HTMLElement | null;
  onEdit: () => void;
  onRemove: () => void;
  children?: any;
  mountTo?: HTMLElement | null;
}

export default (props: Props) => {
  const { element, children, mountTo } = props;

  if (!element) {
    return null;
  }

  return (
    <Popup target={element} mountTo={mountTo} offset={[0, 8]} alignX="right">
      <Toolbar>
        {children}
        {children && <Separator />}
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

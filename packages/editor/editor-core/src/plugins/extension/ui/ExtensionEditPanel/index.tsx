import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Toolbar, Separator } from './styles';
export interface Props {
  element: HTMLElement | null;
  onEdit: () => void;
  onRemove: () => void;
  stickToolbarToBottom?: boolean;
  onLayoutChange: (mode) => void;
  layout: string;
}

export default (props: Props) => {
  const { element, stickToolbarToBottom, layout } = props;
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
        <ToolbarButton
          onClick={props.onLayoutChange.bind(this, 'default')}
          iconBefore={<CenterIcon label="Normal mode" />}
          selected={layout === 'default'}
        />
        <ToolbarButton
          onClick={props.onLayoutChange.bind(this, 'full-width')}
          iconBefore={<FullWidthIcon label="Full width" />}
          selected={layout === 'full-width'}
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

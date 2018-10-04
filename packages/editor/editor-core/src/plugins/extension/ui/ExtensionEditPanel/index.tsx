import * as React from 'react';
import { Popup } from '@atlaskit/editor-common';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Toolbar, Separator } from './styles';
export interface Props {
  element: HTMLElement | null;
  onEdit: () => void;
  onRemove: () => void;
  stickToolbarToBottom?: boolean;
  onLayoutChange?: (mode) => void;
  layout?: string;
  showLayoutOptions?: boolean;
}

const extensionIcons = [
  {
    key: 'default',
    icon: CenterIcon,
    label: 'Centered',
  },
  {
    key: 'wide',
    icon: WideIcon,
    label: 'Wide',
  },
  {
    key: 'full-width',
    icon: FullWidthIcon,
    label: 'Full width',
  },
];

export default function ExtensionEditPanel(this: any, props: Props) {
  const { element, stickToolbarToBottom, layout, showLayoutOptions } = props;
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
        {showLayoutOptions &&
          extensionIcons.map((toolbarLayoutOption, value) => {
            const { icon: Icon, key, label } = toolbarLayoutOption;
            return (
              <ToolbarButton
                onClick={props.onLayoutChange!.bind(this, key)}
                iconBefore={<Icon label={label} />}
                selected={layout === key}
                key={key}
              />
            );
          })}
        <Separator />
        <ToolbarButton
          onClick={props.onRemove}
          iconBefore={<RemoveIcon label="Remove extension" />}
        />
      </Toolbar>
    </Popup>
  );
}

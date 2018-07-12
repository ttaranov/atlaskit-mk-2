import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import {
  akColorN70,
  akColorR300,
  akColorR400,
} from '@atlaskit/util-shared-styles';

import UiToolbarButton from '../../../../ui/ToolbarButton';
import UiSeparator from '../../../../ui/Separator';
import UiFloatingToolbar from '../../../../ui/FloatingToolbar';
import { availablePanelType, PanelState } from '../../pm-plugins/main';

const icons = {
  info: InfoIcon,
  note: NoteIcon,
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

const titles = {
  info: 'Info',
  note: 'Note',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

export interface Props {
  editorView: EditorView;
  pluginState: PanelState;
  onRemove: () => void;
  onPanelChange: (type) => void;
}

const ToolbarButton = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
`;

const Separator = styled(UiSeparator)`
  margin: 2px 6px;
`;

// `line-height: 1` to fix extra 1px height from toolbar wrapper
const FloatingToolbar = styled(UiFloatingToolbar)`
  & > div {
    line-height: 1;
  }
  & > div:first-child > button {
    margin-left: 0;
  }
  & > div:last-child > button {
    margin-right: 0;
  }
`;

const ToolbarButtonDestructive = styled(ToolbarButton)`
  &:hover {
    color: ${akColorR300} !important;
  }
  &:active {
    color: ${akColorR400} !important;
  }
  &[disabled]:hover {
    color: ${akColorN70} !important;
  }
`;

function noOp() {}

export default props => {
  const {
    element: target,
    activePanelType,
    toolbarVisible,
  } = props.pluginState;
  const { onRemove = noOp, onPanelChange = noOp } = props;
  return toolbarVisible ? (
    <FloatingToolbar target={target} offset={[0, 12]} fitHeight={32}>
      {availablePanelType.map((panelType, index) => {
        const Icon = icons[panelType];
        return (
          <ToolbarButton
            spacing="compact"
            key={index}
            selected={activePanelType === panelType}
            onClick={onPanelChange.bind(null, { panelType })}
            title={titles[panelType]}
            iconBefore={<Icon label={`Change panel type to ${panelType}`} />}
          />
        );
      })}
      <Separator />
      <ToolbarButtonDestructive
        spacing="compact"
        onClick={onRemove}
        title="Remove panel"
        iconBefore={<RemoveIcon label="Remove panel" />}
      />
    </FloatingToolbar>
  ) : null;
};

import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';

import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { removePanel, changePanelType } from './actions';
import { pluginKey, StatusState } from './pm-plugins/main';

export const getToolbarConfig: FloatingToolbarHandler = state => {
  const panelState: StatusState | undefined = pluginKey.getState(state);
  if (panelState && panelState.toolbarVisible && panelState.element) {
    const { activePanelType } = panelState;
    return {
      title: 'InlineStatus',
      getDomRef: () => panelState.element,
      nodeType: state.schema.nodes.inlineStatus,
      items: [
        {
          type: 'button',
          appearance: 'subtle',
          icon: InfoIcon,
          onClick: changePanelType('info'),
          selected: activePanelType === 'info',
          title: 'Info',
        },
        {
          type: 'button',
          icon: NoteIcon,
          onClick: changePanelType('note'),
          selected: activePanelType === 'note',
          title: 'Note',
        },
        {
          type: 'button',
          icon: SuccessIcon,
          onClick: changePanelType('success'),
          selected: activePanelType === 'success',
          title: 'Success',
        },
        {
          type: 'button',
          icon: WarningIcon,
          onClick: changePanelType('warning'),
          selected: activePanelType === 'warning',
          title: 'Warning',
        },
        {
          type: 'button',
          icon: ErrorIcon,
          onClick: changePanelType('error'),
          selected: activePanelType === 'error',
          title: 'Error',
        },
        // {
        //   type: 'separator',
        // },
        // {
        //   type: 'button',
        //   appearance: 'danger',
        //   icon: RemoveIcon,
        //   onClick: removePanel(),
        //   title: 'Remove table',
        // },
      ],
    };
  }
};

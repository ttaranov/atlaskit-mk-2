import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';

import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { removePanel, changePanelType } from './actions';
import { pluginKey, PanelState } from './pm-plugins/main';

export const getToolbarConfig: FloatingToolbarHandler = state => {
  const panelState: PanelState | undefined = pluginKey.getState(state);
  if (panelState && panelState.toolbarVisible && panelState.element) {
    const { activePanelType } = panelState;
    return {
      title: 'Panel floating controls',
      getDomRef: () => panelState.element,
      nodeType: state.schema.nodes.panel,
      items: [
        {
          type: 'button',
          icon: InfoIcon,
          onClick: changePanelType('info'),
          selected: activePanelType === 'info',
          intlTitle: 'info',
        },
        {
          type: 'button',
          icon: NoteIcon,
          onClick: changePanelType('note'),
          selected: activePanelType === 'note',
          intlTitle: 'note',
        },
        {
          type: 'button',
          icon: SuccessIcon,
          onClick: changePanelType('success'),
          selected: activePanelType === 'success',
          intlTitle: 'success',
        },
        {
          type: 'button',
          icon: WarningIcon,
          onClick: changePanelType('warning'),
          selected: activePanelType === 'warning',
          intlTitle: 'warning',
        },
        {
          type: 'button',
          icon: ErrorIcon,
          onClick: changePanelType('error'),
          selected: activePanelType === 'error',
          intlTitle: 'error',
        },
        {
          type: 'separator',
        },
        {
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onClick: removePanel(),
          intlTitle: 'remove_panel',
        },
      ],
    };
  }
};

import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import Popup from '../Popup';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { Toolbar, Separator } from './styles';
import { MacroProvider } from '../../editor/plugins/macro/types';

export interface Props {
  editorView: EditorView;
  macroElement: HTMLElement | null;
  macroProvider: MacroProvider | null;
  onInsertMacroFromMacroBrowser: (view: EditorView, macroProvider: MacroProvider) => void;
  onRemoveMacro: (view: EditorView) => void;
}

export default class MacroEdit extends React.Component<any, any> {
  render() {
    const { macroElement } = this.props;
    if (!macroElement) {
      return null;
    }

    return (
      <Popup
        target={macroElement}
        offset={[0, 3]}
        alignX="right"
      >
        <Toolbar>
          <ToolbarButton
            onClick={this.onEdit}
            iconBefore={<EditIcon label="Edit macro" />}
          >
            Edit
          </ToolbarButton>
          <Separator />
          <ToolbarButton
            onClick={this.onRemoveMacro}
            iconBefore={<RemoveIcon label="Remove macro" />}
          />
        </Toolbar>
      </Popup>
    );
  }

  private onEdit = () => {
    const {
      editorView,
      macroProvider,
      onInsertMacroFromMacroBrowser
    } = this.props;
    const { nodeAfter } = editorView.state.selection.$from;
    if (nodeAfter) {
      const { macroId, params } = nodeAfter.attrs;
      onInsertMacroFromMacroBrowser(editorView, macroProvider, { macroId, params });
    }
  }

  private onRemoveMacro = () => {
    const { editorView, onRemoveMacro } = this.props;
    onRemoveMacro(editorView);
  }
}

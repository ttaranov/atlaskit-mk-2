import * as React from 'react';
import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { Popup } from '@atlaskit/editor-common';
import ToolbarButton from '../ToolbarButton';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import { Toolbar, Separator } from './styles';
import { MacroProvider, MacroADF } from '../../editor/plugins/macro/types';

export interface Props {
  editorView: EditorView;
  macroElement: HTMLElement | null;
  macroProvider: MacroProvider | null;
  onInsertMacroFromMacroBrowser: (state: EditorState, dispatch: (tr: Transaction) => void, macroProvider: MacroProvider, macroNode?: PmNode) => Promise<MacroADF>;
  onRemoveMacro: (state: EditorState, dispatch: (tr: Transaction) => void) => void;
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
      macroProvider,
      onInsertMacroFromMacroBrowser,
      editorView: { state, dispatch }
    } = this.props;
    const { nodeAfter } = state.selection.$from;
    if (nodeAfter) {
      onInsertMacroFromMacroBrowser(state, dispatch, macroProvider, nodeAfter);
    }
  }

  private onRemoveMacro = () => {
    const { editorView: { state, dispatch }, onRemoveMacro } = this.props;
    onRemoveMacro(state, dispatch);
  }
}

import * as React from 'react';
import { Component } from 'react';
import { splitCell, mergeCells } from 'prosemirror-tables';
import { EditorView } from 'prosemirror-view';

import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import { analyticsService as analytics } from '../../../../../analytics';
import { ToolbarButton } from '../styles';

export interface Props {
  editorView: EditorView;
  mountPoint?: HTMLElement;
  allowMergeCells?: boolean;
}

export interface State {
  isOpen?: boolean;
}

export default class AdvanceMenu extends Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const { mountPoint } = this.props;
    const items = this.createItems();
    if (!items) {
      return null;
    }

    return (
      <DropdownMenu
        mountTo={mountPoint}
        items={items}
        isOpen={isOpen}
        onOpenChange={this.handleOpenChange}
        onItemActivated={this.onItemActivated}
        fitHeight={188}
        fitWidth={136}
      >
        <ToolbarButton
          spacing="compact"
          selected={isOpen}
          title="Toggle advance menu"
          onClick={this.toggleOpen}
          iconBefore={<EditorMoreIcon label="Toggle advance menu" />}
        />
      </DropdownMenu>
    );
  }

  private createItems = () => {
    const {
      allowMergeCells,
      editorView: { state },
    } = this.props;
    const items: any[] = [];

    if (allowMergeCells) {
      items.push({
        content: 'Merge cells',
        value: { name: 'merge' },
        isDisabled: !mergeCells(state),
      });
      items.push({
        content: 'Split cell',
        value: { name: 'split' },
        isDisabled: !splitCell(state),
      });
    }

    return items.length ? [{ items }] : null;
  };

  private onItemActivated = ({ item }) => {
    const {
      editorView: { state, dispatch },
    } = this.props;
    switch (item.value.name) {
      case 'merge':
        analytics.trackEvent('atlassian.editor.format.table.merge.button');
        mergeCells(state, dispatch);
        this.toggleOpen();
        break;
      case 'split':
        analytics.trackEvent('atlassian.editor.format.table.split.button');
        splitCell(state, dispatch);
        this.toggleOpen();
        break;
    }
  };

  private toggleOpen = () => {
    this.handleOpenChange({ isOpen: !this.state.isOpen });
  };

  private handleOpenChange = ({ isOpen }) => {
    this.setState({ isOpen });
  };
}

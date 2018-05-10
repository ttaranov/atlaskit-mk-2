import * as React from 'react';
import { Component } from 'react';
import {
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleNumberColumn,
  toggleSummaryRow,
} from '../../../actions';
import { EditorView } from 'prosemirror-view';
import TableDisplayOptionsIcon from '@atlaskit/icon/glyph/editor/table-display-options';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { akColorB400 } from '@atlaskit/util-shared-styles';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import { analyticsService as analytics } from '../../../../../analytics';
import {
  TriggerWrapper,
  ExpandIconWrapper,
  Spacer,
  DropdownMenuWrapper,
} from '../styles';
import {
  checkIfHeaderRowEnabled,
  checkIfHeaderColumnEnabled,
  checkIfNumberColumnEnabled,
  checkIfSummaryRowEnabled,
} from '../../../utils';

export interface Props {
  editorView: EditorView;
  mountPoint?: HTMLElement;
  allowNumberColumn?: boolean;
  allowHeaderRow?: boolean;
  allowHeaderColumn?: boolean;
}

export interface State {
  isOpen?: boolean;
}

export default class DisplayOptionsMenu extends Component<Props, State> {
  state: State = {
    isOpen: false,
  };

  render() {
    const { isOpen } = this.state;
    const { mountPoint } = this.props;

    return (
      <DropdownMenuWrapper>
        <DropdownMenu
          mountTo={mountPoint}
          items={this.createItems()}
          isOpen={isOpen}
          onOpenChange={this.handleOpenChange}
          onItemActivated={this.onItemActivated}
          fitHeight={188}
          fitWidth={160}
        >
          <ToolbarButton
            selected={isOpen}
            title="Toggle display options menu"
            onClick={this.toggleOpen}
            iconBefore={
              <TriggerWrapper>
                <TableDisplayOptionsIcon label="Toggle display options menu" />
                <ExpandIconWrapper>
                  <ExpandIcon label="expand-dropdown-menu" />
                </ExpandIconWrapper>
              </TriggerWrapper>
            }
          />
        </DropdownMenu>
      </DropdownMenuWrapper>
    );
  }

  private createItems = () => {
    const items: any[] = [];
    const icon = <EditorDoneIcon primaryColor={akColorB400} label="Selected" />;
    const {
      allowHeaderRow,
      allowHeaderColumn,
      allowNumberColumn,
      editorView: { state },
    } = this.props;

    if (allowHeaderRow) {
      items.push({
        elemBefore: checkIfHeaderRowEnabled(state) ? icon : <Spacer />,
        content: 'Header row',
        value: { name: 'header_row' },
      });
    }
    if (allowHeaderColumn) {
      items.push({
        elemBefore: checkIfHeaderColumnEnabled(state) ? icon : <Spacer />,
        content: 'Header column',
        value: { name: 'header_column' },
      });
    }
    if (allowNumberColumn) {
      items.push({
        elemBefore: checkIfNumberColumnEnabled(state) ? icon : <Spacer />,
        content: 'Number column',
        value: { name: 'number_column' },
      });
    }

    items.push({
      elemBefore: checkIfSummaryRowEnabled(state) ? icon : <Spacer />,
      content: 'Summary row',
      value: { name: 'summary_row' },
    });

    return [{ items }];
  };

  private onItemActivated = ({ item }) => {
    const { editorView: { state, dispatch } } = this.props;

    switch (item.value.name) {
      case 'header_row':
        analytics.trackEvent(
          'atlassian.editor.format.table.toggleHeaderRow.button',
        );
        toggleHeaderRow(state, dispatch);
        this.toggleOpen();
        break;
      case 'summary_row':
        toggleSummaryRow(state, dispatch);
        this.toggleOpen();
        break;
      case 'header_column':
        analytics.trackEvent(
          'atlassian.editor.format.table.toggleHeaderColumn.button',
        );
        toggleHeaderColumn(state, dispatch);
        this.toggleOpen();
        break;
      case 'number_column':
        analytics.trackEvent(
          'atlassian.editor.format.table.toggleNumberColumn.button',
        );
        toggleNumberColumn(state, dispatch);
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

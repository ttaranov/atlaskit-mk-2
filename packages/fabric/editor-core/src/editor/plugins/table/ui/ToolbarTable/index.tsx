import * as React from 'react';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import { EditorView } from 'prosemirror-view';
import { TableState } from '../../../../../plugins/table';
import { analyticsService as analytics } from '../../../../../analytics';
import { toggleTable, tooltip } from '../../../../../keymaps';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import EditorWidth from '../../../../../utils/editor-width';
import tableCommands from '../../../../../plugins/table/commands';
import { Wrapper } from './styles';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  editorWidth?: number;
  pluginState?: TableState;
}

export interface State {
  disabled: boolean;
  tableActive?: boolean;
  tableHidden?: boolean;
}

export default class ToolbarTable extends React.Component<Props, State> {
  state: State = { disabled: false };

  componentWillMount() {
    const { pluginState } = this.props;
    if (pluginState) {
      pluginState.subscribe(this.handlePluginStateChange);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.props.pluginState && nextProps.pluginState) {
      nextProps.pluginState.subscribe(this.handlePluginStateChange);
    }
  }

  componentWillUnmount() {
    const { pluginState } = this.props;
    if (pluginState) {
      pluginState.unsubscribe(this.handlePluginStateChange);
    }
  }

  render() {
    const { editorWidth, isDisabled } = this.props;
    const { tableActive, tableHidden } = this.state;
    if (editorWidth && editorWidth < EditorWidth.BreakPoint3) {
      return null;
    }

    return (
      <Wrapper>
        <ToolbarButton
          spacing={editorWidth ? 'default' : 'none'}
          onClick={this.createTable}
          selected={tableActive}
          disabled={isDisabled || tableHidden}
          title={tooltip(toggleTable)}
          iconBefore={<TableIcon label="Insert table" />}
        />
      </Wrapper>
    );
  }

  private handlePluginStateChange = (pluginState: TableState) => {
    const { tableActive, tableHidden } = pluginState;
    this.setState({ tableActive, tableHidden });
  };

  private createTable = () => {
    analytics.trackEvent(`atlassian.editor.format.table.button`);
    const { editorView } = this.props;
    tableCommands.createTable()(editorView.state, editorView.dispatch);
  };
}

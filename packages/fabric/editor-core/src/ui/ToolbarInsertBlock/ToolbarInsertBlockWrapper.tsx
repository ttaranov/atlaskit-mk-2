import * as React from 'react';
import { TableState } from '../../plugins/table';
import { MediaPluginState } from '../../plugins/media';
import { BlockTypeState } from '../../plugins/block-type';
import { BlockType } from '../../plugins/block-type/types';
import { EditorView } from 'prosemirror-view';

export interface Props {
  pluginStateTable?: TableState;
  pluginStateMedia?: MediaPluginState;
  pluginStateBlockType?: BlockTypeState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  render: (pluginsState: State) => React.ReactElement<any>;
}

export interface State {
  tableActive: boolean;
  tableHidden: boolean;
  mediaUploadsEnabled: boolean;
  availableWrapperBlockTypes?: BlockType[];
  showMediaPicker: () => void;
  insertBlockType: (name: string, view: EditorView) => void;
}

// TODO: deprecate me when we move to new architecture
export default class ToolbarInsertBlockWrapper extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      tableActive: false,
      tableHidden: false,
      mediaUploadsEnabled: false,
    } as State;
  }

  componentDidMount() {
    const { pluginStateTable, pluginStateMedia, pluginStateBlockType } = this.props;

    if (pluginStateTable) {
      pluginStateTable.subscribe(this.handlePluginStateTableChange);
    }

    if (pluginStateMedia) {
      pluginStateMedia.subscribe(this.handlePluginStateMediaChange);
      this.setState({
        showMediaPicker: pluginStateMedia.showMediaPicker
      });
    }

    if (pluginStateBlockType) {
      pluginStateBlockType.subscribe(this.handlePluginStateBlockTypeChange);
      const { availableWrapperBlockTypes, insertBlockType } = pluginStateBlockType;
      this.setState({
        availableWrapperBlockTypes,
        insertBlockType
      });
    }
  }

  componentWillReceiveProps(props: Props) {
    const { pluginStateTable, pluginStateMedia, pluginStateBlockType } = props;
    const {
      pluginStateTable: oldPluginStateTable,
      pluginStateMedia: oldPluginStateMedia,
      pluginStateBlockType: oldPluginStateBlockType,
    } = this.props;

    if (!oldPluginStateTable && pluginStateTable) {
      pluginStateTable.subscribe(this.handlePluginStateTableChange);
    }

    if (!oldPluginStateMedia && pluginStateMedia) {
      pluginStateMedia.subscribe(this.handlePluginStateMediaChange);
      this.setState({
        showMediaPicker: pluginStateMedia.showMediaPicker
      });
    }

    if (!oldPluginStateBlockType && pluginStateBlockType) {
      pluginStateBlockType.subscribe(this.handlePluginStateBlockTypeChange);
      const { availableWrapperBlockTypes, insertBlockType } = pluginStateBlockType;
      this.setState({
        availableWrapperBlockTypes,
        insertBlockType
      });
    }
  }

  componentWillUnmount() {
    const { pluginStateTable, pluginStateMedia, pluginStateBlockType } = this.props;

    if (pluginStateTable) {
      pluginStateTable.unsubscribe(this.handlePluginStateTableChange);
    }
    if (pluginStateMedia) {
      pluginStateMedia.unsubscribe(this.handlePluginStateMediaChange);
    }
    if (pluginStateBlockType) {
      pluginStateBlockType.unsubscribe(this.handlePluginStateBlockTypeChange);
    }
  }

  private handlePluginStateTableChange = (pluginState: TableState) => {
    const { tableActive, tableHidden } = pluginState;
    this.setState({ tableActive, tableHidden });
  }

  private handlePluginStateMediaChange = (pluginState: MediaPluginState) => {
    this.setState({
      mediaUploadsEnabled: pluginState.allowsUploads,
      showMediaPicker: pluginState.showMediaPicker
    });
  }

  private handlePluginStateBlockTypeChange = (pluginState: BlockTypeState) => {
    this.setState({
      availableWrapperBlockTypes: pluginState.availableWrapperBlockTypes,
    });
  }

  render() {
    const { render } = this.props;

    return render(this.state);
  }
}

import * as React from 'react';
import { TableState } from '../../plugins/table';
import { MediaPluginState } from '../../plugins/media';
import { MentionsState } from '../../plugins/mentions';
import { BlockTypeState } from '../../plugins/block-type';
import { HyperlinkState } from '../../plugins/hyperlink';
import { BlockType } from '../../plugins/block-type/types';
import { EditorView } from 'prosemirror-view';
import WithEditorActions from '../../editor/ui/WithEditorActions';
import EditorActions from '../../editor/actions';

export interface Props {
  pluginStateTable?: TableState;
  pluginStateMedia?: MediaPluginState;
  pluginStateBlockType?: BlockTypeState;
  pluginStateMentions?: MentionsState;
  pluginStateHyperlink?: HyperlinkState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  render: (
    pluginsState: State,
    editorActions: EditorActions,
  ) => React.ReactElement<any>;
}

export interface State {
  tableActive: boolean;
  tableHidden: boolean;
  tableSupported: boolean;
  mediaUploadsEnabled: boolean;
  mediaSupported: boolean;
  mentionsEnabled: boolean;
  mentionsSupported: boolean;
  availableWrapperBlockTypes?: BlockType[];
  linkDisabled: boolean;
  showLinkPanel: (editorView: EditorView) => void;
  showMediaPicker: () => void;
  insertBlockType: (name: string, view: EditorView) => void;
  insertMentionQuery: () => void;
}

// TODO: delete me when we move to new architecture
export default class ToolbarInsertBlockWrapper extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);

    this.state = {
      tableActive: false,
      tableHidden: true,
      mediaUploadsEnabled: false,
      mediaSupported: false,
      mentionsEnabled: false,
      mentionsSupported: false,
      linkDisabled: false,
    } as State;
  }

  componentDidMount() {
    const {
      pluginStateTable,
      pluginStateMedia,
      pluginStateBlockType,
      pluginStateMentions,
      pluginStateHyperlink,
    } = this.props;

    if (pluginStateTable) {
      pluginStateTable.subscribe(this.handlePluginStateTableChange);
      this.setState({
        tableSupported: true,
      });
    }

    if (pluginStateMedia) {
      pluginStateMedia.subscribe(this.handlePluginStateMediaChange);
      this.setState({
        showMediaPicker: pluginStateMedia.showMediaPicker,
        mediaSupported: true,
      });
    }

    if (pluginStateBlockType) {
      pluginStateBlockType.subscribe(this.handlePluginStateBlockTypeChange);
      const {
        availableWrapperBlockTypes,
        insertBlockType,
      } = pluginStateBlockType;
      this.setState({
        availableWrapperBlockTypes,
        insertBlockType,
      });
    }

    if (pluginStateMentions) {
      pluginStateMentions.subscribe(this.handlePluginStateMentionsChange);
      const {
        enabled: mentionsEnabled,
        insertMentionQuery,
      } = pluginStateMentions;
      this.setState({
        mentionsEnabled,
        insertMentionQuery,
        mentionsSupported: true,
      });
    }

    if (pluginStateHyperlink) {
      pluginStateHyperlink.subscribe(this.handlePluginStateHyperlinkChange);
      this.setState({
        linkDisabled:
          !pluginStateHyperlink.linkable || pluginStateHyperlink.active,
        showLinkPanel: pluginStateHyperlink.showLinkPanel,
      });
    }
  }

  componentWillReceiveProps(props: Props) {
    const {
      pluginStateTable,
      pluginStateMedia,
      pluginStateBlockType,
      pluginStateMentions,
    } = props;
    const {
      pluginStateTable: oldPluginStateTable,
      pluginStateMedia: oldPluginStateMedia,
      pluginStateBlockType: oldPluginStateBlockType,
      pluginStateMentions: oldPluginStateMentions,
    } = this.props;

    if (!oldPluginStateTable && pluginStateTable) {
      pluginStateTable.subscribe(this.handlePluginStateTableChange);
      this.setState({
        tableSupported: true,
      });
    }

    if (!oldPluginStateMedia && pluginStateMedia) {
      pluginStateMedia.subscribe(this.handlePluginStateMediaChange);
      this.setState({
        showMediaPicker: pluginStateMedia.showMediaPicker,
        mediaSupported: true,
      });
    }

    if (!oldPluginStateBlockType && pluginStateBlockType) {
      pluginStateBlockType.subscribe(this.handlePluginStateBlockTypeChange);
      const {
        availableWrapperBlockTypes,
        insertBlockType,
      } = pluginStateBlockType;
      this.setState({
        availableWrapperBlockTypes,
        insertBlockType,
      });
    }

    if (!oldPluginStateMentions && pluginStateMentions) {
      pluginStateMentions.subscribe(this.handlePluginStateMentionsChange);
      const {
        enabled: mentionsEnabled,
        insertMentionQuery,
      } = pluginStateMentions;
      this.setState({
        mentionsEnabled,
        insertMentionQuery,
        mentionsSupported: true,
      });
    }
  }

  componentWillUnmount() {
    const {
      pluginStateTable,
      pluginStateMedia,
      pluginStateBlockType,
    } = this.props;

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
  };

  private handlePluginStateMediaChange = (pluginState: MediaPluginState) => {
    this.setState({
      mediaUploadsEnabled: pluginState.allowsUploads,
      showMediaPicker: pluginState.showMediaPicker,
    });
  };

  private handlePluginStateBlockTypeChange = (pluginState: BlockTypeState) => {
    this.setState({
      availableWrapperBlockTypes: pluginState.availableWrapperBlockTypes,
    });
  };

  private handlePluginStateMentionsChange = (pluginState: MentionsState) => {
    this.setState({
      mentionsEnabled: pluginState.enabled,
    });
  };

  private handlePluginStateHyperlinkChange = (pluginState: HyperlinkState) => {
    this.setState({
      linkDisabled: !pluginState.linkable || pluginState.active,
    });
  };

  render() {
    const { render } = this.props;

    return (
      <WithEditorActions render={actions => render(this.state, actions)} />
    );
  }
}

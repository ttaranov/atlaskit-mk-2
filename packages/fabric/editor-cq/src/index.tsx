import {
  AnalyticsHandler,
  AnalyticsProperties,
  analyticsService,
  Chrome,
  blockTypePlugins,
  codeBlockPlugins,
  hyperlinkPlugins,
  listsPlugins,
  rulePlugins,
  textFormattingPlugins,
  clearFormattingPlugins,
  panelPlugins,
  mentionsPlugins,
  tablePlugins,
  tableStateKey,
  pastePlugins,
  blockTypeStateKey,
  codeBlockStateKey,
  hyperlinkStateKey,
  listsStateKey,
  textFormattingStateKey,
  clearFormattingStateKey,
  panelStateKey,
  mentionsStateKey,
  version as coreVersion,
  mediaPluginFactory,
  mediaStateKey,
  MediaProvider,
  // Plugin,
  ProviderFactory,
  MediaPluginState,
  MediaState,
  textColorStateKey,
  textColorPlugins,


  // nodeviews
  nodeViewFactory,
  ReactMediaGroupNode,
  ReactMediaNode,
  ReactMentionNode,
  reactNodeViewPlugins,

  // error-reporting
  ErrorReporter,
  ErrorReportingHandler,
  ConfluenceTransformer,
  CONFlUENCE_LANGUAGE_MAP as LANGUAGE_MAP
} from '@atlaskit/editor-core';
// import { bitbucketSchema as schema } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { EditorState, TextSelection, Plugin } from 'prosemirror-state';
import { Node as PMNode, Slice } from 'prosemirror-model'
import { keymap } from 'prosemirror-keymap';
import { history } from 'prosemirror-history';
import { baseKeymap } from 'prosemirror-commands';
import * as React from 'react';
import { PureComponent } from 'react';
import { MentionProvider } from '@atlaskit/mention';
import { version, name } from './version';
import { default as schema } from './schema';
import ReactJIRAIssueNode from './nodeviews/ui/jiraIssue';
import ReactUnsupportedBlockNode from './nodeviews/ui/unsupportedBlock';
import ReactUnsupportedInlineNode from './nodeviews/ui/unsupportedInline';
export { version };

export interface Props {
  disabled?: boolean;
  isExpandedByDefault?: boolean;
  defaultValue?: string;
  expanded?: boolean;
  onCancel?: (editor?: Editor) => void;
  onChange?: (editor?: Editor) => void;
  onSave?: (editor?: Editor) => void;
  onExpanded?: (editor?: Editor) => void;
  placeholder?: string;
  uploadErrorHandler?: (state: MediaState) => void;
  analyticsHandler?: AnalyticsHandler;
  errorReporter?: ErrorReportingHandler;
  mediaProvider?: Promise<MediaProvider>;
  mentionProvider?: Promise<MentionProvider>;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  tablesEnabled?: boolean;
}

export interface State {
  editorView?: EditorView;
  isExpanded?: boolean;
  isMediaReady: boolean;
  schema: typeof schema;
  showSpinner: boolean;
}

export default class Editor extends PureComponent<Props, State> {
  state: State;
  version = `${version} (editor-core ${coreVersion})`;
  mentionProvider: Promise<MentionProvider>;
  editorView?: EditorView;

  private transformer = new ConfluenceTransformer(schema);
  private providerFactory: ProviderFactory;
  private mediaPlugins: Plugin[];

  constructor(props: Props) {
    super(props);

    this.state = {
      schema,
      isExpanded: (props.expanded !== undefined) ? props.expanded : props.isExpandedByDefault,
      isMediaReady: true,
      showSpinner: false,
    };

    this.providerFactory = new ProviderFactory();
    analyticsService.handler = props.analyticsHandler || ((name) => {});

    const { mentionProvider, mediaProvider, uploadErrorHandler } = props;

    if (mentionProvider) {
      this.mentionProvider = mentionProvider;
      this.providerFactory.setProvider('mentionProvider', mentionProvider);
    }

    if (mediaProvider) {
      this.providerFactory.setProvider('mediaProvider', mediaProvider);
    }

    const errorReporter = new ErrorReporter();
    if (props.errorReporter) {
      errorReporter.handler = props.errorReporter;
    }

    this.mediaPlugins = mediaPluginFactory(schema, {
      uploadErrorHandler,
      errorReporter,
      providerFactory: this.providerFactory,
    });
  }

  /**
   * Focus the content region of the editor.
   */
  focus(): void {
    const { editorView } = this.state;

    if (editorView && !editorView.hasFocus()) {
      try {
        editorView.focus();
      } catch (ex) {}
    }
  }

  /**
   * Clear the content of the editor, making it an empty document.
   */
  clear(): void {
    const { editorView } = this.state;

    if (editorView) {
      const { state } = editorView;
      const tr = state.tr
        .setSelection(TextSelection.create(state.doc, 0, state.doc.nodeSize - 2))
        .deleteSelection();

      editorView.dispatch(tr);
    }
  }

  /**
   * Check if the user has entered any significant content.
   * (i.e. text)
   */
  isEmpty(): boolean {
    const { editorView } = this.state;

    return editorView && editorView.state.doc
      ? !!editorView.state.doc.textContent
      : false;
  }

  /**
   * The current value of the editor, encoded as CXTML.
   */
  get value(): Promise<string | undefined> {
    const { editorView } = this.state;
    const mediaPluginState = mediaStateKey.getState(editorView!.state) as MediaPluginState;

    return (async () => {
      await mediaPluginState.waitForPendingTasks();
      this.setState({ showSpinner: false });

      return editorView && editorView.state.doc
          ? this.transformer.encode(editorView.state.doc)
          : this.props.defaultValue;
    })();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { props, providerFactory } = this;
    const { mediaProvider } = nextProps;

    if (props.mediaProvider !== mediaProvider) {
      providerFactory.setProvider('mediaProvider', mediaProvider);
    }

    if (nextProps.expanded !== this.props.expanded) {
      this.setState({ isExpanded: nextProps.expanded });

      const { onExpanded } = this.props;
      if (onExpanded) {
        onExpanded(this);
      }
    }

    if (nextProps.disabled !== this.props.disabled) {
      const { editorView } = this.state;

      if (editorView) {
        // TODO: fix any
        (editorView.dom as any).contentEditable = String(!nextProps.disabled);

        if (!nextProps.disabled) {
          editorView.focus();
        }
      }
    }
  }

  componentWillUnmount() {
    this.providerFactory.destroy();

    const { editorView } = this.state;
    if (editorView) {
      if (editorView.state) {
        mediaStateKey.getState(editorView.state).destroy();
      }

      editorView.destroy();
    }
  }

  render() {
    const {
      disabled = false,
      tablesEnabled,
      popupsBoundariesElement,
      popupsMountPoint
    } = this.props;
    const { editorView, isExpanded, isMediaReady, showSpinner } = this.state;
    const handleCancel = this.props.onCancel ? this.handleCancel : undefined;
    const handleSave = this.props.onSave ? this.handleSave : undefined;
    const editorState = editorView && editorView.state;

    const blockTypeState = editorState && blockTypeStateKey.getState(editorState);
    const codeBlockState = editorState && codeBlockStateKey.getState(editorState);
    const clearFormattingState = editorState && clearFormattingStateKey.getState(editorState);
    const hyperlinkState = editorState && hyperlinkStateKey.getState(editorState);
    const listsState = editorState && listsStateKey.getState(editorState);
    const mediaState = editorState && this.mediaPlugins && this.props.mediaProvider && mediaStateKey.getState(editorState);
    const textFormattingState = editorState && textFormattingStateKey.getState(editorState);
    const panelState = editorState && panelStateKey.getState(editorState);
    const mentionsState = editorState && mentionsStateKey.getState(editorState);
    const tableState = tablesEnabled && editorState && tableStateKey.getState(editorState);
    const textColorState = editorState && textColorStateKey.getState(editorState);

    return (
      <Chrome
        children={<div ref={this.handleRef} />}
        disabled={disabled}
        editorView={editorView!}
        isExpanded={isExpanded}
        feedbackFormUrl="yes"
        onCancel={handleCancel}
        onSave={handleSave}
        onCollapsedChromeFocus={this.handleCollapsedChromeFocus}
        placeholder={this.props.placeholder}
        pluginStateBlockType={blockTypeState}
        pluginStateCodeBlock={codeBlockState}
        pluginStateHyperlink={hyperlinkState}
        pluginStateLists={listsState}
        pluginStateTextFormatting={textFormattingState}
        pluginStateClearFormatting={clearFormattingState}
        pluginStateMedia={mediaState}
        pluginStatePanel={panelState}
        pluginStateTable={tableState}
        pluginStateTextColor={textColorState}
        packageVersion={version}
        packageName={name}
        mentionProvider={this.mentionProvider}
        pluginStateMentions={mentionsState}
        saveDisabled={!isMediaReady}
        showSpinner={showSpinner}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsMountPoint={popupsMountPoint}
      />
    );
  }

  private handleCollapsedChromeFocus = () => {
    const { onExpanded } = this.props;
    this.setState({ isExpanded: true });

    if (onExpanded) {
      onExpanded(this);
    }
  }

  private handleRef = (place: Element | null) => {
    const { schema } = this.state;
    const { mediaPlugins } = this;
    const { tablesEnabled, defaultValue } = this.props;

    if (place) {
      const doc = this.transformer.parse(defaultValue || '');
      const cqKeymap = {
        'Mod-Enter': this.handleSave,
      };

      const editorState = EditorState.create({
        schema,
        doc,
        plugins: [
          ...pastePlugins(schema),
          ...mentionsPlugins(schema, this.providerFactory),
          ...clearFormattingPlugins(schema),
          ...hyperlinkPlugins(schema),
          ...rulePlugins(schema),
          ...mediaPlugins,
          ...panelPlugins(schema),
          // block type plugin needs to be after hyperlink plugin until we implement keymap priority
          // because when we hit shift+enter, we would like to convert the hyperlink text before we insert a new line
          // if converting is possible
          ...blockTypePlugins(schema),
          // The following order of plugins blockTypePlugins -> listBlock -> codeBlockPlugins
          // this is needed to ensure that all block types are supported inside lists
          // this is needed until we implement keymap priority :(
          ...listsPlugins(schema),
          ...textFormattingPlugins(schema),
          ...codeBlockPlugins(schema),
          ...reactNodeViewPlugins(schema),
          ...textColorPlugins(schema),
          ...(tablesEnabled ? tablePlugins() : []),
          history(),
          keymap(cqKeymap),
          keymap(baseKeymap),
        ]
      });

      const codeBlockState = codeBlockStateKey.getState(editorState);
      const supportedLanguages = Object.keys(LANGUAGE_MAP).map(name => LANGUAGE_MAP[name]);
      codeBlockState.setLanguages(supportedLanguages);

      const editorView = new EditorView(place, {
        state: editorState,
        editable: (state: EditorState) => !this.props.disabled,
        dispatchTransaction: (tr) => {
          const newState = editorView.state.apply(tr);
          editorView.updateState(newState);
          this.handleChange(tr.docChanged);
        },
        nodeViews: {
          jiraIssue: nodeViewFactory(this.providerFactory, { jiraIssue: ReactJIRAIssueNode }),
          confluenceUnsupportedBlock: nodeViewFactory(this.providerFactory, { confluenceUnsupportedBlock: ReactUnsupportedBlockNode }, true),
          confluenceUnsupportedInline: nodeViewFactory(this.providerFactory, { confluenceUnsupportedInline: ReactUnsupportedInlineNode }),
          mediaGroup: nodeViewFactory(this.providerFactory, {
            mediaGroup: ReactMediaGroupNode,
            media: ReactMediaNode,
          }, true),
          mention: nodeViewFactory(this.providerFactory, { mention: ReactMentionNode }),
        },
        handleDOMEvents: {
          paste(view: EditorView, event: ClipboardEvent) {
            analyticsService.trackEvent('atlassian.editor.paste');
            return false;
          }
        },
        handlePaste(view: EditorView, event: any, slice: Slice): boolean {
          const { clipboardData } = event;
          const html = clipboardData && clipboardData.getData('text/html');
          // we let table plugin to handle pasting of html that contain tables, because the logic is pretty complex
          if (html && !html.match(/<table[^>]+>/g)) {
            const doc = this.transformer.parse(html.replace(/^<meta[^>]+>/, ''));
            view.dispatch(
              view.state.tr.replaceSelection(new Slice(doc.content, slice.openStart, slice.openEnd))
            );
            return true;
          }
          return false;
        },
      });

      analyticsService.trackEvent('atlassian.editor.start');

      this.editorView = editorView;
      this.setState({ editorView }, () => {
        this.focus();
      });

      this.sendUnsupportedNodeUsage(doc);
    } else {
      this.setState({ editorView: undefined });
    }
  }

  private handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel(this);
    }
  }

  private handleChange = async (docChanged: boolean) => {
    const { onChange } = this.props;
    if (onChange && docChanged) {
      onChange(this);
    }

    const { editorView } = this.state;
    const mediaPluginState = mediaStateKey.getState(editorView!.state) as MediaPluginState;

    this.setState({ isMediaReady: false });
    await mediaPluginState.waitForPendingTasks();
    this.setState({ isMediaReady: true });
  }

  private handleSave = () => {
    this.setState({ showSpinner: true });
    const { onSave } = this.props;
    if (onSave) {
      onSave(this);
    }
  }

  /**
   * Traverse document nodes to find the number of unsupported ones
   */
  private sendUnsupportedNodeUsage(doc: PMNode) {
    const { unsupportedInline, unsupportedBlock } = schema.nodes;

    traverseNode(doc);

    function traverseNode(node: PMNode) {
      let cxhtml = '';
      if (node.attrs && node.attrs.cxhtml) {
        cxhtml = node.attrs.cxhtml;
      }

      const data: AnalyticsProperties = {
        type: node.type.name,
        cxhtml: node.attrs.cxhtml as string,
        text: node.text || ''
      };

      if (node.type === unsupportedInline) {
        analyticsService.trackEvent('atlassian.editor.confluenceUnsupported.inline', data);
      } else if (node.type === unsupportedBlock) {
        analyticsService.trackEvent('atlassian.editor.confluenceUnsupported.block', data);
      } else {
        node.content.forEach(traverseNode);
      }
    }
  }

}

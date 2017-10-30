import * as assert from 'assert';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { Schema } from 'prosemirror-model';
import {
  EditorState,
  Plugin,
  TextSelection,
} from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import {
  AnalyticsHandler,
  analyticsService,
  analyticsDecorator as analytics,
  Chrome,
  blockTypePlugins,
  clearFormattingPlugins,
  codeBlockPlugins,
  hyperlinkPlugins,
  mentionsPlugins,
  rulePlugins,
  textFormattingPlugins,
  textColorPlugins,
  listsPlugins,
  blockTypeStateKey,
  clearFormattingStateKey,
  codeBlockStateKey,
  hyperlinkStateKey,
  mentionsStateKey,
  textFormattingStateKey,
  textColorStateKey,
  listsStateKey,
  tablePlugins,
  tableStateKey,
  pastePlugins,
  ProviderFactory,
  version as coreVersion,

  MediaProvider,
  MediaState,
  MediaPluginState,
  mediaPluginFactory,
  mediaStateKey,

  // nodeviews
  nodeViewFactory,
  ReactMentionNode,
  ReactMediaNode,
  ReactMediaGroupNode,
  reactNodeViewPlugins,

  // error-reporting
  ErrorReporter,
  ErrorReportingHandler,

  // transformers
  JIRATransformer,
  JSONTransformer,

  createJIRASchema,
} from '@atlaskit/editor-core';

import { MentionProvider } from '@atlaskit/mention';
import { ActivityProvider } from '@atlaskit/activity';
import Button, { ButtonGroup } from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';
import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';

import {
  isSchemaWithCodeBlock,
  isSchemaWithLinks,
  isSchemaWithMentions,
  isSchemaWithMedia,
  isSchemaWithTextColor,
  getMediaContextInfo,
  isSchemaWithTables,
} from './util';

import { version, name } from './version';
export { version };

// tslint:disable-next-line:variable-name
const FooterWrapper = styled.div`
  display: flex;
  padding: 12px 0 0 0;
`;

// tslint:disable-next-line:variable-name
const FooterSlot = styled.div`
  flex-grow: 1;
`;

export interface FooterProps {
  saveDisabled: boolean;
}

export interface Props {
  isDisabled?: boolean;
  isExpandedByDefault?: boolean;
  defaultValue?: string;
  onCancel?: (editor?: Editor) => void;
  onChange?: (editor?: Editor) => void;
  onSave?: (editor?: Editor) => void;
  onExpanded?: (editor?: Editor) => void;
  placeholder?: string;
  analyticsHandler?: AnalyticsHandler;
  allowLists?: boolean;
  allowLinks?: boolean;
  allowCodeBlock?: boolean;
  allowAdvancedTextFormatting?: boolean;
  allowBlockQuote?: boolean;
  allowSubSup?: boolean;
  allowTextColor?: boolean;
  allowTables?: boolean;
  mentionProvider?: Promise<MentionProvider>;
  mentionEncoder?: (userId: string) => string;
  mediaProvider?: Promise<MediaProvider>;
  activityProvider?: Promise<ActivityProvider>;
  uploadErrorHandler?: (state: MediaState) => void;
  errorReporter?: ErrorReportingHandler;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  renderFooter?: (props: FooterProps) => React.ReactElement<any>;
}

export interface State {
  editorView?: EditorView;
  editorState?: EditorState;
  isMediaReady: boolean;
  isExpanded?: boolean;
  schema: Schema;
}

export default class Editor extends PureComponent<Props, State> {
  private providerFactory: ProviderFactory;
  private mediaPlugins: Plugin[];

  // we don't need mediaContextInfo for HTML parsing (which must be synchronous)
  // but we need it for encoding (which is asynchronous)
  private transformer: JIRATransformer;
  private transformerWithMediaContext: JIRATransformer;

  state: State;
  version = `${version} (editor-core ${coreVersion})`;

  constructor(props: Props) {
    super(props);

    const {
      allowLists, allowLinks, allowAdvancedTextFormatting,
      allowCodeBlock, allowBlockQuote, allowSubSup, allowTextColor, allowTables,

      analyticsHandler,

      mentionProvider,
      mediaProvider, uploadErrorHandler,

      isExpandedByDefault: isExpanded
    } = props;

    const schema = createJIRASchema({
      allowLists: !!allowLists,
      allowMentions: !!mentionProvider,
      allowLinks: !!allowLinks,
      allowAdvancedTextFormatting: !!allowAdvancedTextFormatting,
      allowCodeBlock: !!allowCodeBlock,
      allowBlockQuote: !!allowBlockQuote,
      allowSubSup: !!allowSubSup,
      allowTextColor: !!allowTextColor,
      allowMedia: !!mediaProvider,
      allowTables: !!allowTables
    });

    this.state = { isExpanded, schema, isMediaReady: true };
    this.providerFactory = new ProviderFactory();
    this.transformer = new JIRATransformer(schema);

    if (mentionProvider) {
      this.providerFactory.setProvider('mentionProvider', mentionProvider);
    }

    if (mediaProvider) {
      this.providerFactory.setProvider('mediaProvider', mediaProvider);

      const errorReporter = new ErrorReporter();
      if (props.errorReporter) {
        errorReporter.handler = props.errorReporter;
      }

      this.mediaPlugins = mediaPluginFactory(schema, {
        uploadErrorHandler,
        errorReporter,
        providerFactory: this.providerFactory
      });
    }

    analyticsService.handler = analyticsHandler || ((name) => { });
  }

  async componentWillMount() {
    const mediaContextInfo = await getMediaContextInfo();
    const { mentionEncoder } = this.props;
    const { schema } = this.state;

    this.transformerWithMediaContext = new JIRATransformer(schema, { mention: mentionEncoder }, mediaContextInfo);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isDisabled !== this.props.isDisabled) {
      const { editorView } = this.state;
      if (editorView) {
        (editorView.dom as HTMLElement).contentEditable = String(!nextProps.isDisabled);

        if (!nextProps.isDisabled && !editorView.hasFocus()) {
          editorView.focus();
        }
      }
    }
  }

  componentWillUnmount() {
    const { editorView } = this.state;

    if (editorView) {
      if (editorView.state) {
        const mediaState = mediaStateKey.getState(editorView.state);
        if (mediaState) {
          mediaState.destroy();
        }
      }

      editorView.destroy();
    }

    this.providerFactory.destroy();
  }

  /**
   * Focus the content region of the editor.
   */
  focus(): void {
    const { editorView } = this.state;

    if (editorView && !editorView.hasFocus() && !this.props.isDisabled) {
      try {
        editorView.focus();
      } catch (err) {}
    }
  }

  /**
   * Expand the editor chrome
   */
  expand = () => {
    const { onExpanded } = this.props;
    const { schema } = this.state;

    this.setState({ isExpanded: true, schema });

    if (onExpanded) {
      onExpanded(this);
    }
  }

  /**
   * Collapse the editor chrome
   */
  collapse = () => {
    const { schema } = this.state;

    this.setState({ isExpanded: false, schema });
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
  isDirty(): boolean {
    const { editorView } = this.state;

    return editorView && editorView.state.doc
      ? !!editorView.state.doc.textContent
      : false;
  }

  /**
   * The current value of the editor, encoded as HTML.
   */
  get value(): Promise<string | undefined> {
    const { editorView } = this.state;
    const mediaPluginState = editorView && mediaStateKey.getState(editorView.state) as MediaPluginState;

    return (async () => {
      if (mediaPluginState) {
        await mediaPluginState.waitForPendingTasks();
      }

      return editorView && editorView.state.doc
        ? this.transformerWithMediaContext.encode(editorView.state.doc)
        : this.props.defaultValue;
    })();
  }

  render() {
    const { editorView, isExpanded, isMediaReady } = this.state;
    const {
      isDisabled = false,
      mentionProvider, mediaProvider, activityProvider,
      popupsBoundariesElement, popupsMountPoint,
      renderFooter,
      onSave, onCancel
    } = this.props;
    const editorState = editorView && editorView.state;

    const listsState = editorState && listsStateKey.getState(editorState);
    const blockTypeState = editorState && blockTypeStateKey.getState(editorState);
    const clearFormattingState = editorState && clearFormattingStateKey.getState(editorState);
    const codeBlockState = editorState && codeBlockStateKey.getState(editorState);
    const textFormattingState = editorState && textFormattingStateKey.getState(editorState);
    const textColorState = editorState && textColorStateKey.getState(editorState);
    const hyperlinkState = editorState && hyperlinkStateKey.getState(editorState);
    const mentionsState = editorState && mentionsStateKey.getState(editorState);
    const mediaState = editorState && mediaProvider && this.mediaPlugins && mediaStateKey.getState(editorState);
    const tableState = editorState && tableStateKey.getState(editorState);
    const iconAfter = !isMediaReady
      ? <Spinner isCompleting={false} />
      : undefined;
    const saveButtonAppearance = !isMediaReady
      ? 'default'
      : 'primary';

    return (
      <div>
        <Chrome
          disabled={isDisabled}
          children={<div ref={this.handleRef} />}
          editorView={editorView!}
          isExpanded={isExpanded}
          mentionProvider={mentionProvider}
          activityProvider={activityProvider}
          onCollapsedChromeFocus={this.expand}
          placeholder={this.props.placeholder}
          pluginStateBlockType={blockTypeState}
          pluginStateCodeBlock={codeBlockState}
          pluginStateLists={listsState}
          pluginStateTextFormatting={textFormattingState}
          pluginStateTextColor={textColorState}
          pluginStateClearFormatting={clearFormattingState}
          pluginStateMentions={mentionsState}
          pluginStateHyperlink={hyperlinkState}
          pluginStateMedia={mediaState}
          pluginStateTable={tableState}
          packageVersion={version}
          packageName={name}
          saveDisabled={!isMediaReady}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsMountPoint={popupsMountPoint}
        />
        {
          isExpanded && (
            <FooterWrapper>
              {(onSave || onCancel) && (
                <ButtonGroup>
                  {onSave && <Button isDisabled={isDisabled || !isMediaReady} iconAfter={iconAfter} appearance={saveButtonAppearance} onClick={this.handleSave}>Save</Button>}
                  {onCancel && <Button isDisabled={isDisabled} appearance="subtle" onClick={this.handleCancel}>Cancel</Button>}
                </ButtonGroup>
              )}

              {renderFooter && (<FooterSlot>{renderFooter({ saveDisabled: !isMediaReady })}</FooterSlot>)}
            </FooterWrapper>
          )
        }
      </div>
    );
  }

  @analytics('atlassian.editor.stop.cancel')
  private handleCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel(this);
    }
    return true;
  }

  private handleChange = async () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this);
    }


    const { editorView } = this.state;
    const mediaPluginState = mediaStateKey.getState(editorView!.state) as MediaPluginState;

    if (mediaPluginState) {
      this.setState({ isMediaReady: false });
      await mediaPluginState.waitForPendingTasks();
      this.setState({ isMediaReady: true });
    }
  }

  @analytics('atlassian.editor.stop.save')
  private handleSave = () => {
    const { onSave } = this.props;
    if (onSave) {
      onSave(this);
    }
    return true;
  }

  private handleRef = (place: Element | null) => {
    const { schema } = this.state;

    if (place) {
      const jiraKeymap = {
        'Mod-Enter': this.handleSave,
      };

      const editorState = EditorState.create({
        schema,
        doc: this.transformer.parse(this.props.defaultValue || ''),
        plugins: [
          ...pastePlugins(schema),
          ...(isSchemaWithLinks(schema) ? hyperlinkPlugins(schema) : []),
          ...(isSchemaWithMentions(schema) ? mentionsPlugins(schema, this.providerFactory) : []),
          ...clearFormattingPlugins(schema),
          ...rulePlugins(schema),
          ...(isSchemaWithMedia(schema) ? this.mediaPlugins : []),
          ...(isSchemaWithTextColor(schema) ? textColorPlugins(schema) : []),
          // block type plugin needs to be after hyperlink plugin until we implement keymap priority
          // because when we hit shift+enter, we would like to convert the hyperlink text before we insert a new line
          // if converting is possible
          ...blockTypePlugins(schema),
          // The following order of plugins blockTypePlugins -> listBlock
          // this is needed to ensure that all block types are supported inside lists
          // this is needed until we implement keymap proirity :(
          ...listsPlugins(schema),
          ...textFormattingPlugins(schema),
          ...(isSchemaWithCodeBlock(schema) ? codeBlockPlugins(schema) : []),
          ...reactNodeViewPlugins(schema),
          ...(isSchemaWithTables(schema) ? tablePlugins() : []),
          history(),
          keymap(jiraKeymap),
          keymap(baseKeymap), // should be last :(
        ]
      });

      const editorView = new EditorView(place, {
        state: editorState,
        editable: (state: EditorState) => !this.props.isDisabled,
        dispatchTransaction: (tr) => {
          const newState = editorView.state.apply(tr);
          editorView.updateState(newState);
          this.handleChange();
        },
        nodeViews: {
          mention: nodeViewFactory(this.providerFactory, { mention: ReactMentionNode }),
          mediaGroup: nodeViewFactory(this.providerFactory, {
            mediaGroup: ReactMediaGroupNode,
            media: ReactMediaNode,
          }, true),
        },
        handleDOMEvents: {
          paste(view: EditorView, event: ClipboardEvent) {
            analyticsService.trackEvent('atlassian.editor.paste');
            return false;
          }
        }
      });

      analyticsService.trackEvent('atlassian.editor.start');

      this.setState({ editorView }, this.focus);
    } else {
      this.setState({ editorView: undefined });
    }
  }
}

export const parseIntoAtlassianDocument = (html: string, schema: Schema) => {
  assert.strictEqual(typeof html, 'string', 'First parseIntoAtlassianDocument() argument is not a string');

  const jsonTransformer = new JSONTransformer();
  const jiraTransformer = new JIRATransformer(schema);

  const doc = jiraTransformer.parse(html);
  return jsonTransformer.encode(doc) as any;
};

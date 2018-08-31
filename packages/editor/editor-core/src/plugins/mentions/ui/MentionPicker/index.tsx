import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  AnalyticsEventPayload,
  WithAnalyticsEventProps,
} from '@atlaskit/analytics-next-types';
import {
  ContextIdentifierProvider,
  Popup,
  akEditorFloatingDialogZIndex,
} from '@atlaskit/editor-common';
import {
  ELEMENTS_CHANNEL,
  isSpecialMention,
  MentionDescription,
  MentionPicker as AkMentionPicker,
  MentionProvider,
  ContextMentionResource,
} from '@atlaskit/mention';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import { Component } from 'react';
import * as uuid from 'uuid';
import { analyticsService } from '../../../../analytics';
import {
  getInsertTypeForKey,
  InsertType,
} from '../../../../analytics/fabric-analytics-helper';
import { MentionsState } from '../../pm-plugins/main';
import {
  buildTypeAheadCancelPayload,
  buildTypeAheadInsertedPayload,
} from '../analytics';
import { promiseAllWithNonFailFast } from '../../../../utils/promise-util';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

export interface Props {
  editorView?: EditorView;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  mentionProvider: Promise<MentionProvider>;
  pluginKey: PluginKey;
  presenceProvider?: any;
  reversePosition?: boolean;
  target?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export interface State {
  query?: string;
  queryActive: boolean;
  anchorElement?: HTMLElement;
  mentionProvider?: MentionProvider;
  contextIdentifierProvider?: ContextIdentifierProvider;
  focused: boolean;
}

export interface StateForRender extends State {
  mentionProvider: MentionProvider;
}

const shouldRenderPicker = (state: State): state is StateForRender => {
  const { focused, anchorElement, queryActive, mentionProvider } = state;
  return !!(focused && anchorElement && queryActive && mentionProvider);
};

export class MentionPicker extends Component<
  Props & WithAnalyticsEventProps,
  State
> {
  state: State = {
    queryActive: false,
    focused: false,
  };
  content?: HTMLElement;
  private pluginState?: MentionsState;
  private picker?: AkMentionPicker;
  private pickerOpenTime: number;
  private pickerElapsedTime: number;
  private insertType?: InsertType;
  private nextCount: number = 0;
  private previousCount: number = 0;
  private mentions?: MentionDescription[];
  private sessionId: string = uuid();

  componentWillMount() {
    this.pickerOpenTime = 0;
    this.pickerElapsedTime = 0;
    this.setPluginState(this.props);
  }

  componentDidMount() {
    this.refreshMentionProvider();
    this.setPluginState(this.props);
  }

  componentWillUnmount() {
    const { pluginState } = this;

    if (pluginState) {
      pluginState.unsubscribe(this.handlePluginStateChange);
    }
    this.unsubscribeMentionProvider();
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    if (!this.pluginState) {
      this.setPluginState(nextProps);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.hasChanged('contextIdentifierProvider', nextProps) ||
      this.hasChanged('mentionProvider', nextProps)
    ) {
      this.refreshMentionProvider(nextProps);
    }
  }

  refreshMentionProvider = (
    { mentionProvider, contextIdentifierProvider }: Props = this.props,
  ) => {
    const errors: any[] = [];

    return promiseAllWithNonFailFast(
      [
        contextIdentifierProvider || Promise.resolve(undefined),
        mentionProvider,
      ],
      error => errors.push(error),
    ).then(([contextIdentifierProvider, mentionProvider]) => {
      this.resolveResourceProvider(mentionProvider, contextIdentifierProvider);
    });
  };

  private getSessionId(): string {
    return this.sessionId;
  }

  private hasChanged = (name: keyof Props, nextProps: Props): boolean =>
    this.props[name] !== nextProps[name];

  private unsubscribeMentionProvider() {
    if (this.state.mentionProvider) {
      this.state.mentionProvider.unsubscribe('MentionPickerPlugin');
    }
  }

  private endSession = () => {
    this.nextCount = 0;
    this.previousCount = 0;
    this.sessionId = uuid();
    this.insertType = undefined;
    this.setState({ mentionProvider: undefined });
  };

  private setPluginState(props: Props) {
    const { editorView, pluginKey } = props;
    if (!editorView) {
      return;
    }

    const pluginState: MentionsState = pluginKey.getState(editorView.state);

    if (pluginState) {
      this.pluginState = pluginState;

      pluginState.subscribe(this.handlePluginStateChange);
      pluginState.onSelectPrevious = this.handleSelectPrevious;
      pluginState.onSelectNext = this.handleSelectNext;
      pluginState.onSelectCurrent = this.handleSelectCurrent;
      pluginState.onDismiss = this.handleDismiss;
      pluginState.onSpaceTyped = this.handleSpaceTyped;
    }
  }

  private handleMentionResults = (mentions: MentionDescription[]) => {
    this.mentions = mentions;
  };

  private resolveResourceProvider(
    mentionProvider?: MentionProvider,
    contextIdentifierProvider?: ContextIdentifierProvider,
  ) {
    if (mentionProvider) {
      const wrappedMentionProvider = new ContextMentionResource(
        mentionProvider,
        { sessionId: this.getSessionId(), ...contextIdentifierProvider },
      );
      this.setState({
        mentionProvider: wrappedMentionProvider,
        contextIdentifierProvider,
      });
      mentionProvider.subscribe(
        'MentionPickerPlugin',
        this.handleMentionResults,
      );
    } else {
      this.setState({ mentionProvider: undefined, contextIdentifierProvider });
    }
  }

  private handlePluginStateChange = (state: MentionsState) => {
    const { anchorElement, query, focused, queryActive } = state;
    // If queryActive is true it means that the user is in a TypeAhead session.
    // If it was false before, it means that a new session has started,
    // so we need to create a MentionProvider with the analytics context information.
    if (queryActive && !this.state.queryActive) {
      this.refreshMentionProvider();
    }
    this.setState({ anchorElement, query, queryActive, focused });
  };

  private handleOnOpen = () => {
    this.pickerOpenTime = Date.now();
  };

  private calculateElapsedTime = () => {
    this.pickerElapsedTime = Date.now() - this.pickerOpenTime;
  };

  private handleOnClose = (): boolean => {
    this.calculateElapsedTime();

    analyticsService.trackEvent('atlassian.fabric.mention.picker.close', {
      duration: this.pickerElapsedTime || 0,
    });

    return true;
  };

  private fireEvent = <T extends AnalyticsEventPayload>(payload: T): void => {
    if (this.props.createAnalyticsEvent) {
      this.props.createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);
    }
  };

  private sendCancelledEvent = () =>
    this.fireEvent(
      buildTypeAheadCancelPayload(
        this.pickerElapsedTime,
        this.previousCount,
        this.nextCount,
        this.getSessionId(),
        this.pluginState && this.pluginState.lastQuery,
      ),
    );

  private sendSelectedAnalyticsEvent = (
    mention: MentionDescription,
    insertType: InsertType,
  ) =>
    this.fireEvent(
      buildTypeAheadInsertedPayload(
        this.pickerElapsedTime,
        this.previousCount,
        this.nextCount,
        this.getSessionId(),
        insertType,
        mention,
        this.mentions,
        this.pluginState && this.pluginState.lastQuery,
      ),
    );

  private handleDismiss = () => {
    this.handleOnClose();
    this.sendCancelledEvent();
    this.endSession();
  };

  render() {
    if (!shouldRenderPicker(this.state)) {
      return null;
    }

    const {
      popupsBoundariesElement,
      popupsMountPoint,
      presenceProvider,
      popupsScrollableElement,
    } = this.props;

    const { anchorElement, query, mentionProvider } = this.state;
    const sessionId = this.getSessionId();
    return (
      <Popup
        target={anchorElement}
        fitHeight={300}
        fitWidth={340}
        zIndex={akEditorFloatingDialogZIndex}
        boundariesElement={popupsBoundariesElement}
        mountTo={popupsMountPoint}
        scrollableElement={popupsScrollableElement}
        offset={[0, 3]}
      >
        <FabricElementsAnalyticsContext data={{ sessionId }}>
          <AkMentionPicker
            resourceProvider={mentionProvider}
            presenceProvider={presenceProvider}
            onSelection={this.handleSelectedMention}
            onOpen={this.handleOnOpen}
            onClose={this.handleOnClose}
            query={query}
            ref={this.handleMentionPickerRef}
          />
        </FabricElementsAnalyticsContext>
      </Popup>
    );
  }

  private handleMentionPickerRef = ref => {
    this.picker = ref;
  };

  private handleSelectedMention = (mention: MentionDescription) => {
    this.calculateElapsedTime();
    this.pluginState!.insertMention(mention);
    this.fireMentionInsertAnalytics(mention);
  };

  private handleSelectPrevious = (): boolean => {
    if (this.picker) {
      (this.picker as AkMentionPicker).selectPrevious();
    }
    this.previousCount++;

    return true;
  };

  private handleSelectNext = (): boolean => {
    if (this.picker) {
      (this.picker as AkMentionPicker).selectNext();
    }
    this.nextCount++;

    return true;
  };

  private handleSelectCurrent = (key): boolean => {
    if (this.getMentionsCount() > 0 && this.picker) {
      this.insertType = getInsertTypeForKey(key);

      (this.picker as AkMentionPicker).chooseCurrentSelection();
    } else {
      this.insertType = undefined;
      this.pluginState!.dismiss();
    }

    this.handleOnClose();
    return true;
  };

  private fireMentionInsertAnalytics = (mention: MentionDescription) => {
    const { accessLevel } = mention;
    const lastQuery = this.pluginState && this.pluginState.lastQuery;

    const contextIdentifier = this.state.contextIdentifierProvider || {};
    const mode: InsertType = this.insertType || InsertType.SELECTED;
    analyticsService.trackEvent('atlassian.fabric.mention.picker.insert', {
      mode,
      isSpecial: isSpecialMention(mention) || false,
      accessLevel: accessLevel || '',
      queryLength: lastQuery ? lastQuery.length : 0,
      duration: this.pickerElapsedTime || 0,
      mentionee: mention.id,
      ...contextIdentifier,
    });

    this.sendSelectedAnalyticsEvent(mention, mode);
    this.endSession();
  };

  private getMentionsCount = (): number =>
    (this.mentions && this.mentions.length) || 0;

  handleSpaceTyped = (): void => {
    analyticsService.trackEvent('atlassian.fabric.mention.picker.space', {});
  };
}

export default withAnalyticsEvents()(MentionPicker);

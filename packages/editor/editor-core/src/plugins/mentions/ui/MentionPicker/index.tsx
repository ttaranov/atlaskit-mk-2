import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ContextIdentifierProvider, Popup } from '@atlaskit/editor-common';
import {
  ELEMENTS_CHANNEL,
  isSpecialMention,
  MentionDescription,
  MentionPicker as AkMentionPicker,
  MentionProvider,
} from '@atlaskit/mention';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import * as React from 'react';
import { PureComponent } from 'react';
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

export interface Props {
  editorView?: EditorView;
  contextIdentifierProvider: Promise<ContextIdentifierProvider>;
  mentionProvider: Promise<MentionProvider>;
  pluginKey: PluginKey;
  presenceProvider?: any;
  reversePosition?: boolean;
  target?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  createAnalyticsEvent: Function;
}

export interface State {
  query?: string;
  queryActive?: boolean;
  anchorElement?: HTMLElement;
  mentionProvider?: MentionProvider;
  contextIdentifierProvider?: ContextIdentifierProvider;
  focused?: boolean;
}

export class MentionPicker extends PureComponent<Props, State> {
  state: State = {};
  content?: HTMLElement;
  private pluginState?: MentionsState;
  private picker?: AkMentionPicker;
  private pickerOpenTime: number;
  private pickerElapsedTime: number;
  private insertType?: InsertType;
  private nextCount: number = 0;
  private previousCount: number = 0;
  private mentions?: MentionDescription[];

  componentWillMount() {
    this.pickerOpenTime = 0;
    this.pickerElapsedTime = 0;
    this.setPluginState(this.props);
  }

  componentDidMount() {
    this.resolveResourceProvider(this.props.mentionProvider);
    this.resolveContextIdentifierProvider(this.props.contextIdentifierProvider);
  }

  componentWillUnmount() {
    const { pluginState } = this;

    if (pluginState) {
      pluginState.unsubscribe(this.handlePluginStateChange);
    }
    this.unsubscribeMentionProvider();
  }

  componentWillUpdate(nextProps: Props) {
    if (!this.pluginState) {
      this.setPluginState(nextProps);
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.mentionProvider !== this.props.mentionProvider) {
      this.resolveResourceProvider(nextProps.mentionProvider);
    }
    if (
      nextProps.contextIdentifierProvider !==
      this.props.contextIdentifierProvider
    ) {
      this.resolveContextIdentifierProvider(
        nextProps.contextIdentifierProvider,
      );
    }
  }

  private unsubscribeMentionProvider() {
    if (this.state.mentionProvider) {
      this.state.mentionProvider.unsubscribe('MentionPickerPlugin');
    }
  }

  private resetCounters = () => {
    this.nextCount = 0;
    this.previousCount = 0;
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

  private resolveResourceProvider(resourceProvider): void {
    this.unsubscribeMentionProvider();
    if (resourceProvider) {
      resourceProvider.then((mentionProvider: MentionProvider) => {
        this.setState({ mentionProvider });
        mentionProvider.subscribe(
          'MentionPickerPlugin',
          this.handleMentionResults,
        );
      });
    } else {
      this.setState({ mentionProvider: undefined });
    }
  }

  private resolveContextIdentifierProvider(contextIdentifierPromise): void {
    if (contextIdentifierPromise) {
      contextIdentifierPromise.then(
        (contextIdentifierProvider: ContextIdentifierProvider) => {
          this.setState({ contextIdentifierProvider });
        },
      );
    } else {
      this.setState({ contextIdentifierProvider: undefined });
    }
  }

  private handlePluginStateChange = (state: MentionsState) => {
    const { anchorElement, query, focused, queryActive } = state;
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

  private fireEvent = payload =>
    this.props.createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);

  private sendCancelledEvent = () => {
    this.fireEvent(
      buildTypeAheadCancelPayload(
        this.pickerElapsedTime,
        this.previousCount,
        this.nextCount,
        this.pluginState && this.pluginState.lastQuery,
      ),
    );
    this.resetCounters();
  };

  private sendSelectedAnalyticsEvent = (
    mention: MentionDescription,
    insertType: InsertType,
  ) => {
    this.fireEvent(
      buildTypeAheadInsertedPayload(
        this.pickerElapsedTime,
        this.previousCount,
        this.nextCount,
        insertType,
        mention,
        this.mentions,
        this.pluginState && this.pluginState.lastQuery,
      ),
    );
    this.resetCounters();
  };

  private handleDismiss = () => {
    this.handleOnClose();
    this.sendCancelledEvent();
  };

  render() {
    const {
      focused,
      anchorElement,
      query,
      queryActive,
      mentionProvider,
    } = this.state;
    const {
      popupsBoundariesElement,
      popupsMountPoint,
      presenceProvider,
      popupsScrollableElement,
    } = this.props;

    if (!focused || !anchorElement || !queryActive || !mentionProvider) {
      return null;
    }

    return (
      <Popup
        target={anchorElement}
        fitHeight={300}
        fitWidth={340}
        zIndex={500}
        boundariesElement={popupsBoundariesElement}
        mountTo={popupsMountPoint}
        scrollableElement={popupsScrollableElement}
        offset={[0, 3]}
      >
        <AkMentionPicker
          resourceProvider={mentionProvider}
          presenceProvider={presenceProvider}
          onSelection={this.handleSelectedMention}
          onOpen={this.handleOnOpen}
          onClose={this.handleOnClose}
          query={query}
          ref={this.handleMentionPickerRef}
        />
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

    const contextIdentifier = this.state.contextIdentifierProvider
      ? ({
          objectId: this.state.contextIdentifierProvider.objectId,
          containerId: this.state.contextIdentifierProvider.containerId,
        } as ContextIdentifierProvider)
      : {};

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
    this.insertType = undefined;
  };

  private getMentionsCount = (): number =>
    (this.mentions && this.mentions.length) || 0;

  handleSpaceTyped = (): void => {
    analyticsService.trackEvent('atlassian.fabric.mention.picker.space', {});
  };
}

export default withAnalyticsEvents()(MentionPicker);

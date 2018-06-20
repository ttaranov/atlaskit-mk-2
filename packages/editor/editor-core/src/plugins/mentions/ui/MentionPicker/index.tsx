import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Popup, ContextIdentifierProvider } from '@atlaskit/editor-common';
import {
  MentionPicker as AkMentionPicker,
  MentionProvider,
  MentionDescription,
  isSpecialMention,
} from '@atlaskit/mention';
import { analyticsService } from '../../../../analytics';
import {
  getInsertTypeForKey,
  InsertType,
} from '../../../../analytics/fabric-analytics-helper';
import { MentionsState } from '../../pm-plugins/main';

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
}

export interface State {
  query?: string;
  queryActive?: boolean;
  anchorElement?: HTMLElement;
  mentionProvider?: MentionProvider;
  contextIdentifierProvider?: ContextIdentifierProvider;
  focused?: boolean;
}

export default class MentionPicker extends PureComponent<Props, State> {
  state: State = {};
  content?: HTMLElement;
  private pluginState?: MentionsState;
  private picker?: AkMentionPicker;
  private pickerOpenTime: number;
  private pickerElapsedTime: number;
  private insertType?: InsertType;

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
      pluginState.onDismiss = this.handleOnClose;
      pluginState.onSpaceTyped = this.handleSpaceTyped;
    }
  }

  private resolveResourceProvider(resourceProvider): void {
    if (resourceProvider) {
      resourceProvider.then((mentionProvider: MentionProvider) => {
        this.setState({ mentionProvider });
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

    return true;
  };

  private handleSelectNext = (): boolean => {
    if (this.picker) {
      (this.picker as AkMentionPicker).selectNext();
    }

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

    analyticsService.trackEvent('atlassian.fabric.mention.picker.insert', {
      mode: this.insertType || InsertType.SELECTED,
      isSpecial: isSpecialMention(mention) || false,
      accessLevel: accessLevel || '',
      queryLength: lastQuery ? lastQuery.length : 0,
      duration: this.pickerElapsedTime || 0,
      mentionee: mention.id,
      ...contextIdentifier,
    });

    this.insertType = undefined;
  };

  private getMentionsCount(): number {
    return (this.picker && this.picker.mentionsCount()) || 0;
  }

  handleSpaceTyped = (): void => {
    analyticsService.trackEvent('atlassian.fabric.mention.picker.space', {});
  };
}

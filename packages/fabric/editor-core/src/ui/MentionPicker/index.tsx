import {
  MentionPicker as AkMentionPicker,
  MentionProvider,
  MentionDescription,
  isSpecialMention,
} from '@atlaskit/mention';
import * as React from 'react';
import { PureComponent } from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MentionsState } from '../../plugins/mentions';
import { Popup } from '@atlaskit/editor-common';
import { analyticsService } from '../../analytics';
import * as keymaps from '../../keymaps';

const MentionAnalyticsPrefix = 'atlassian.fabric.mention';

enum InsertType {
  SELECTED = 'selected',
  ENTER = 'enter',
  SHIFT_ENTER = 'shift-enter',
  SPACE = 'space',
  AUTO = 'auto',
  TAB = 'tab',
}

function createInsertTypeMap(): object {
  const map = {};
  map[keymaps.space.common] = InsertType.SPACE;
  map[keymaps.enter.common] = InsertType.ENTER;
  map[keymaps.insertNewLine.common] = InsertType.SHIFT_ENTER;
  map[keymaps.tab.common] = InsertType.TAB;
  return Object.freeze(map);
}

const insertTypeMap: object = createInsertTypeMap();

export interface Props {
  editorView?: EditorView;
  mentionProvider: Promise<MentionProvider>;
  pluginKey: PluginKey;
  presenceProvider?: any;
  reversePosition?: boolean;
  target?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
}

export interface State {
  query?: string;
  anchorElement?: HTMLElement;
  mentionProvider?: MentionProvider;
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
      pluginState.onSelectPreviousMentionAuto = this.handlePreviousMentionAuto;
      pluginState.onDismiss = this.handleOnClose;
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

  private handlePluginStateChange = (state: MentionsState) => {
    const { anchorElement, query, focused } = state;
    this.setState({ anchorElement, query, focused });
  };

  private handleOnOpen = () => {
    this.pickerOpenTime = Date.now();
  };

  private calculateElapsedTime = () => {
    this.pickerElapsedTime = Date.now() - this.pickerOpenTime;
  };

  private handleOnClose = (): boolean => {
    this.calculateElapsedTime();

    analyticsService.trackEvent(`${MentionAnalyticsPrefix}.picker.close`, {
      duration: this.pickerElapsedTime || 0,
    });

    return true;
  };

  render() {
    const { focused, anchorElement, query, mentionProvider } = this.state;
    const {
      popupsBoundariesElement,
      popupsMountPoint,
      presenceProvider,
    } = this.props;

    if (!focused || !anchorElement || query === undefined || !mentionProvider) {
      return null;
    }

    return (
      <Popup
        target={anchorElement}
        fitHeight={300}
        fitWidth={340}
        boundariesElement={popupsBoundariesElement}
        mountTo={popupsMountPoint}
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
    this.fireMentionInsertAnalytics(mention, this.insertType);
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
      this.insertType = insertTypeMap[key];

      (this.picker as AkMentionPicker).chooseCurrentSelection();
    } else {
      this.insertType = undefined;
      this.pluginState!.dismiss();
    }

    this.handleOnClose();
    return true;
  };

  private handlePreviousMentionAuto = (mention: MentionDescription) => {
    this.calculateElapsedTime();
    this.insertType = InsertType.AUTO;
    this.fireMentionInsertAnalytics(mention, InsertType.AUTO);
  };

  private fireMentionInsertAnalytics = (
    mention: MentionDescription,
    insertType: InsertType = InsertType.SELECTED,
  ) => {
    const { accessLevel } = mention;
    const lastQuery = this.pluginState!.lastQuery;

    analyticsService.trackEvent(`${MentionAnalyticsPrefix}.picker.insert`, {
      mode: insertType,
      isSpecial: isSpecialMention(mention) || false,
      accessLevel: accessLevel || '',
      queryLength: lastQuery ? lastQuery.length : 0,
      duration: this.pickerElapsedTime || 0,
    });

    this.insertType = undefined;
  };

  private getMentionsCount(): number {
    return (this.picker && this.picker.mentionsCount()) || 0;
  }
}

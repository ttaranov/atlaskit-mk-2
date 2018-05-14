import OpenIcon from '@atlaskit/icon/glyph/editor/open';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import { ActivityProvider } from '@atlaskit/activity';
import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import {
  addFakeTextCursor,
  removeFakeTextCursor,
} from '../../../fake-text-cursor/cursor';
import PanelTextInput from '../../../../ui/PanelTextInput';
import ToolbarButton from '../../../../ui/ToolbarButton';
import FloatingToolbar from '../../../../ui/FloatingToolbar';
import Separator from '../../../../ui/Separator';
import { HyperlinkState } from '../../pm-plugins/main';
import { normalizeUrl } from '../../utils';
import RecentSearch from '../RecentSearch';
import { ResolvedPos, MarkType } from 'prosemirror-model';

const TEXT_NODE = 3;

export interface Props {
  pluginState: HyperlinkState;
  editorView: EditorView;
  activityProvider?: Promise<ActivityProvider>;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export interface State {
  target?: HTMLElement;
  activeElement?: HTMLElement;
  // URL of the hyperlink. The presence of this attribute causes an "open"
  // hyperlink to be rendered in the popup.
  href?: string;
  text?: string;
  oldText?: string;
  // Href before editing
  oldHref?: string;
  // Surprisingly not all hyperlinks can be unlinked. For example when the
  // storage format is Markdown, you can't represent some a URL as plain text
  // using standard markdown syntax alone.
  unlinkable?: boolean;
  textInputPlaceholder?: string;
  textInputValue?: string;
  editorFocused?: boolean;
  inputActive?: boolean;
  active?: boolean;
  showToolbarPanel?: boolean;
}

const floatingStyleOverride = {
  maxHeight: '284px',
  minHeight: '40px',
  height: 'initial',
};

export default class HyperlinkEdit extends PureComponent<Props, State> {
  state: State = {
    unlinkable: true,
    editorFocused: false,
    inputActive: false,
    active: false,
    showToolbarPanel: false,
  };

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  setInputActive = () => {
    this.setState({
      inputActive: true,
    });
    if (this.state.editorFocused) {
      const { editorView } = this.props;
      addFakeTextCursor(editorView.state, editorView.dispatch);
    }
  };

  resetInputActive = () => {
    this.setState({
      inputActive: false,
    });
    if (!this.state.editorFocused) {
      const { editorView } = this.props;
      removeFakeTextCursor(editorView.state, editorView.dispatch);
    }
  };

  private getOffsetParent() {
    return this.props.popupsMountPoint
      ? this.props.popupsMountPoint.offsetParent
      : (this.props.editorView.dom as HTMLElement).offsetParent;
  }

  private posHasMark = (pos: ResolvedPos, markType: MarkType) =>
    pos.marks().some(mark => mark.type === markType);

  private getPopupTarget(): HTMLElement | null {
    const { editorView } = this.props;
    const { state } = editorView;
    let node;
    const { empty, $from, $to } = state.selection;
    const { link } = state.schema.marks;
    if (!empty && !this.posHasMark($from, link)) {
      for (let i = $from.pos; i <= $to.pos; i++) {
        if (this.posHasMark(state.doc.resolve(i), link)) {
          node = editorView.domAtPos(i).node;
        }
      }
    }
    if (!node) {
      node = editorView.domAtPos(state.selection.$from.pos).node;
    }
    const activeElement = node as HTMLElement;
    return activeElement.nodeType === TEXT_NODE
      ? (activeElement.parentElement as HTMLElement)
      : activeElement;
  }

  /**
   * Dynamic offsets for hyperlink editing popup
   * because we need to show it next to cursor even without clear target for popup.
   */
  private adjustPosition = position => {
    const { inputActive } = this.state;
    const { pluginState } = this.props;

    if (!pluginState.active || inputActive) {
      const editorRoot = this.getOffsetParent();

      if (!editorRoot) {
        return position;
      }

      const coordinates = pluginState.getCoordinates(
        this.props.editorView,
        editorRoot,
      );

      if (position.left) {
        position.left = Math.round(coordinates.left);
      }

      if (position.top) {
        position.top = Math.round(coordinates.top);
      }

      if (position.bottom) {
        position.bottom = Math.round(coordinates.bottom);
      }

      if (position.right) {
        position.right = Math.round(coordinates.right);
      }
    }

    return position;
  };

  render() {
    const {
      href,
      oldHref,
      unlinkable,
      active,
      editorFocused,
      inputActive,
      showToolbarPanel,
    } = this.state;
    const {
      popupsBoundariesElement,
      popupsMountPoint,
      activityProvider,
    } = this.props;
    const renderRecentSearch = activityProvider && !oldHref;

    if ((active || showToolbarPanel) && (editorFocused || inputActive)) {
      const popupTarget = this.getPopupTarget();
      if (!popupTarget) {
        return null;
      }
      const showOpenButton = !!oldHref;
      const showUnlinkButton = unlinkable && active && oldHref;

      return (
        <FloatingToolbar
          target={popupTarget}
          offset={[0, 3]}
          fitHeight={renderRecentSearch ? 284 : 40}
          onPositionCalculated={this.adjustPosition}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsMountPoint={popupsMountPoint}
          stylesOverride={floatingStyleOverride}
        >
          {showOpenButton && (
            <ToolbarButton
              href={href}
              target="_blank"
              iconBefore={<OpenIcon label="Open link" />}
            />
          )}
          {showUnlinkButton && (
            <ToolbarButton
              onClick={this.handleUnlink}
              iconBefore={<UnlinkIcon label="Unlink" />}
            />
          )}
          {showUnlinkButton && <Separator />}
          {this.renderInput()}
        </FloatingToolbar>
      );
    } else {
      return null;
    }
  }

  private renderInput() {
    const { href, oldHref, text, oldText } = this.state;
    const { editorView, pluginState, activityProvider } = this.props;
    const normalizedOldText = oldText && normalizeUrl(oldText);

    // insert new link with recently viewed dropdown
    if (activityProvider && !oldHref) {
      return (
        <RecentSearch
          editorView={editorView}
          pluginState={pluginState}
          activityProvider={activityProvider}
        />
      );
    }

    // edit link text
    if (normalizedOldText && href === normalizedOldText) {
      return (
        <PanelTextInput
          placeholder="Text to display"
          defaultValue={!text && href === normalizedOldText ? '' : text}
          onSubmit={this.updateLinkText}
          onChange={this.updateText}
          onMouseDown={this.setInputActive}
          onBlur={this.handleOnBlur}
          onCancel={this.handleOnBlur}
        />
      );
    }

    // edit link href when text has not been set
    return (
      <PanelTextInput
        placeholder="Paste link"
        autoFocus={!href || href.length === 0}
        defaultValue={href}
        onSubmit={this.updateLinkHref}
        onChange={this.updateHref}
        onMouseDown={this.setInputActive}
        onBlur={this.handleOnBlur}
        onCancel={this.handleOnBlur}
      />
    );
  }

  // ED-1323 `onBlur` covers all the use cases (click outside, tab, etc) for this issue
  private handleOnBlur = () => {
    const { editorView, pluginState } = this.props;
    const { href, text } = this.state;
    if (editorView.state.selection.empty && !pluginState.active) {
      pluginState.hideLinkPanel(editorView.state, editorView.dispatch);
    } else if (!href || href.length === 0) {
      pluginState.removeLink(editorView);
    } else {
      if (text && pluginState.text !== text) {
        pluginState.updateLinkText(text, editorView);
        this.setState({ text: '' });
      }
      if (href && pluginState.href !== href) {
        pluginState.updateLink({ href }, editorView);
      }
    }
    this.resetInputActive();
  };

  private handleUnlink = () => {
    this.props.pluginState.removeLink(this.props.editorView);
  };

  private handlePluginStateChange = (pluginState: HyperlinkState) => {
    const { inputActive } = this.state;
    const hrefNotPreset =
      pluginState.active &&
      (!pluginState.href || pluginState.href.length === 0);

    this.setState({
      active: pluginState.active,
      target: pluginState.element,
      activeElement: pluginState.activeElement,
      href: pluginState.href,
      oldText: pluginState.text,
      oldHref: pluginState.href,
      textInputValue: pluginState.text,
      editorFocused: pluginState.editorFocused,
      inputActive: hrefNotPreset || inputActive,
      showToolbarPanel: pluginState.showToolbarPanel,
    });
  };

  private updateHref = (href: string) => {
    this.setState({ href });
  };

  private updateText = (text: string) => {
    this.setState({ text });
  };

  private updateLinkText = (text: string) => {
    if (text && text.length > 0 && text !== this.state.oldText) {
      const { editorView, pluginState } = this.props;
      pluginState.updateLinkText(text, editorView);
      this.setState({ text: '' });
    }
  };

  private updateLinkHref = (href: string) => {
    const { editorView, pluginState } = this.props;
    if (this.state.oldHref) {
      pluginState.updateLink({ href }, editorView);
    } else {
      pluginState.addLink({ href }, editorView);
    }
    editorView.focus();
  };
}

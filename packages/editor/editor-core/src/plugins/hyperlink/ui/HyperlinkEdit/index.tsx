import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { ResolvedPos, MarkType } from 'prosemirror-model';
import styled from 'styled-components';

import { ActivityProvider } from '@atlaskit/activity';
import OpenIcon from '@atlaskit/icon/glyph/editor/open';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';

import { removeFakeTextCursor } from '../../../fake-text-cursor/cursor';
import PanelTextInput from '../../../../ui/PanelTextInput';
import UiToolbarButton from '../../../../ui/ToolbarButton';
import UiFloatingToolbar from '../../../../ui/FloatingToolbar';
import UiSeparator from '../../../../ui/Separator';
import { HyperlinkState } from '../../pm-plugins/main';
import { normalizeUrl } from '../../utils';
import RecentSearch from '../RecentSearch';

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

// `line-height: 1` to fix extra 1px height from toolbar wrapper
const FloatingToolbar = styled(UiFloatingToolbar)`
  max-height: 350px;
  min-height: 32px;
  height: initial;
  & > div {
    line-height: 1;
  }
  & > div > button:last-child {
    margin-right: 0;
  }
  .normal& input {
    min-width: 244px;
    margin-right: 2px;
  }
  .recent-search& {
    padding: 8px 0 0;
    input {
      padding: 0 8px 8px;
    }
  }
`;

// `a&` because `Button` uses it and it produces a more specific selector `a.xyz`
const ToolbarButton = styled(UiToolbarButton)`
  width: 24px;
  padding: 0;
  margin: 0 2px;
  a& {
    width: 24px;
    margin: 0 2px;
  }
`;

// Need fixed height because parent has height inherit and `height: 100%` doesn't work because of that
const Separator = styled(UiSeparator)`
  margin: 2px 6px;
  height: 20px;
`;

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
      // Current position is fake cursor so we will look for the DOM right after our selection
      // Since putting cursor at the end of the link doesn't show the popup so it's safe
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
    const { pluginState } = this.props;

    if (!pluginState.active) {
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
          alignX="left"
          target={popupTarget}
          offset={[0, 12]}
          fitHeight={renderRecentSearch ? 350 : 32}
          onPositionCalculated={this.adjustPosition}
          popupsBoundariesElement={popupsBoundariesElement}
          popupsMountPoint={popupsMountPoint}
          className={renderRecentSearch ? 'recent-search' : 'normal'}
        >
          {this.renderInput()}
          {(showOpenButton || showUnlinkButton) && <Separator />}
          {showOpenButton && (
            <ToolbarButton
              spacing="compact"
              href={href}
              target="_blank"
              title="Open link"
              iconBefore={<OpenIcon label="Open link" />}
            />
          )}
          {showUnlinkButton && (
            <ToolbarButton
              spacing="compact"
              onClick={this.handleUnlink}
              title="Unlink"
              iconBefore={<UnlinkIcon label="Unlink" />}
            />
          )}
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

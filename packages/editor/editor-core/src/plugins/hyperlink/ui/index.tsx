import * as React from 'react';
import { Node, Mark } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  setLinkText,
  removeLink,
  hideLinkToolbar,
  setLinkHref,
  insertLink,
} from '../commands';
import HyperlinkEdit from './HyperlinkEdit';
import { findDomRefAtPos } from 'prosemirror-utils';
import { ActivityProvider } from '@atlaskit/activity';
import RecentSearch from './RecentSearch';
import { normalizeUrl } from '../utils';
import { InsertStatus, HyperlinkState } from '../pm-plugins/main';

export class AddDisplayTextToolbar extends React.PureComponent<{
  pos: number;
  node: Node;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const existingLink = (node.type.schema.marks.link.isInSet(
      node.marks,
    ) as Mark).attrs.href;
    const unlink = () =>
      removeLink(pos)(view.state, view.dispatch) && view.focus();
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch) && view.focus();
    const updateLinkText = (text: string) =>
      setLinkText(pos, text)(view.state, view.dispatch) && view.focus();
    const updateLinkTextOrHideToolbar = (text: string) =>
      updateLinkText(text) || hideToolbar();
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(pos, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        alwaysOpenLinkAt={existingLink}
        placeholder="Text to display"
        onSubmit={updateLinkText}
        onBlur={updateLinkTextOrHideToolbar}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}

export class EditLinkHrefToolbar extends React.PureComponent<{
  pos: number;
  node: Node;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const existingLink = (node.type.schema.marks.link.isInSet(
      node.marks,
    ) as Mark).attrs.href;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch) && view.focus();
    const updateLinkHref = (href: string) =>
      setLinkHref(pos, href)(view.state, view.dispatch) && view.focus();
    const updateLinkHrefOrHideToolbar = (href: string) =>
      updateLinkHref(href) || hideToolbar();
    const unlink = () =>
      removeLink(pos)(view.state, view.dispatch) && view.focus();
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(pos, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        defaultValue={existingLink}
        placeholder="Paste link"
        onSubmit={updateLinkHref}
        onBlur={updateLinkHrefOrHideToolbar}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}

export class InsertLinkToolbar extends React.PureComponent<{
  from: number;
  to: number;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch) && view.focus();
    const addLink = (href: string) =>
      insertLink(from, to, href)(view.state, view.dispatch) && view.focus();
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(from, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        autoFocus={true}
        placeholder="Paste link"
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}

export class ActivityPoweredInsertLinkToolbar extends React.PureComponent<{
  from: number;
  to: number;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  activityProvider: Promise<ActivityProvider>;
}> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      activityProvider,
    } = this.props;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch) && view.focus();
    const addLink = (href: string, text?: string) =>
      insertLink(from, to, href, text)(view.state, view.dispatch) &&
      view.focus();
    return (
      <RecentSearch
        target={findDomRefAtPos(from, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        autoFocus={true}
        activityProvider={activityProvider}
        placeholder="Paste link or search recently viewed"
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}

export interface Props {
  hyperlinkState?: HyperlinkState;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  activityProvider?: Promise<ActivityProvider>;
}
export default function HyperlinkToolbar(props: Props) {
  const {
    hyperlinkState,
    view,
    popupsMountPoint,
    popupsBoundariesElement,
    activityProvider,
  } = props;
  if (hyperlinkState && hyperlinkState.activeLinkMark) {
    if (hyperlinkState.activeLinkMark.type === InsertStatus.EDIT_LINK_TOOLBAR) {
      const { node, pos } = hyperlinkState.activeLinkMark;
      const mark = view.state.schema.marks.link.isInSet(node.marks) as Mark;
      const isLinkTextTheSameAsTheLinkUrl =
        mark.attrs.href === normalizeUrl(node.text!);
      const Toolbar = isLinkTextTheSameAsTheLinkUrl
        ? AddDisplayTextToolbar
        : EditLinkHrefToolbar;
      return (
        <Toolbar
          pos={pos}
          node={node}
          view={view}
          popupsMountPoint={popupsMountPoint}
          popupsBoundariesElement={popupsBoundariesElement}
        />
      );
    } else if (
      hyperlinkState.activeLinkMark.type === InsertStatus.INSERT_LINK_TOOLBAR
    ) {
      const { from, to } = hyperlinkState.activeLinkMark;
      if (activityProvider) {
        return (
          <ActivityPoweredInsertLinkToolbar
            from={from}
            to={to}
            view={view}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            activityProvider={activityProvider}
          />
        );
      } else {
        return (
          <InsertLinkToolbar
            from={from}
            to={to}
            view={view}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
          />
        );
      }
    }
  }
  return null;
}

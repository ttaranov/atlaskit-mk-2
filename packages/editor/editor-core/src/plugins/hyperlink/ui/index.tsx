import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import { Node, Mark } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { findDomRefAtPos } from 'prosemirror-utils';
import { ActivityProvider } from '@atlaskit/activity';

import {
  setLinkText,
  removeLink,
  hideLinkToolbar,
  setLinkHref,
  insertLink,
} from '../commands';
import HyperlinkEdit from './HyperlinkEdit';
import RecentSearch from './RecentSearch';
import { normalizeUrl } from '../utils';
import { InsertStatus, HyperlinkState } from '../pm-plugins/main';

export const messages = defineMessages({
  linkPlaceholder: {
    id: 'fabric.editor.linkPlaceholder',
    defaultMessage: 'Paste link',
    description: 'Create a new link by pasting a URL.',
  },
  linkTextPlaceholder: {
    id: 'fabric.editor.linkTextPlaceholder',
    defaultMessage: 'Text to display',
    description:
      'Enter the text you’d like to display for the link (instead of the URL).',
  },
  linkPlaceholderWithSearch: {
    id: 'fabric.editor.linkPlaceholderWithSearch',
    defaultMessage: 'Paste link or search recently viewed',
    description:
      'Create a new link by pasting a URL or searching pages you’ve recently visited.',
  },
});

export interface CommonProps {
  pos: number;
  node: Node;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export class AddDisplayTextToolbar extends React.PureComponent<
  CommonProps & InjectedIntlProps
> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      intl: { formatMessage },
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
        placeholder={formatMessage(messages.linkTextPlaceholder)}
        onSubmit={updateLinkText}
        onBlur={updateLinkTextOrHideToolbar}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}
export const AddDisplayTextToolbarWithIntl = injectIntl(AddDisplayTextToolbar);

export class EditLinkHrefToolbar extends React.PureComponent<
  CommonProps & InjectedIntlProps
> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      intl: { formatMessage },
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
        placeholder={formatMessage(messages.linkPlaceholder)}
        onSubmit={updateLinkHref}
        onBlur={updateLinkHrefOrHideToolbar}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}
export const EditLinkHrefToolbarWithIntl = injectIntl(EditLinkHrefToolbar);

export class InsertLinkToolbar extends React.PureComponent<
  {
    from: number;
    to: number;
    view: EditorView;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
  } & InjectedIntlProps
> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      intl: { formatMessage },
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
        placeholder={formatMessage(messages.linkPlaceholder)}
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}
export const InsertLinkToolbarWithIntl = injectIntl(InsertLinkToolbar);

export class ActivityPoweredInsertLinkToolbar extends React.PureComponent<
  {
    from: number;
    to: number;
    view: EditorView;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    activityProvider: Promise<ActivityProvider>;
  } & InjectedIntlProps
> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      activityProvider,
      intl: { formatMessage },
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
        placeholder={formatMessage(messages.linkPlaceholderWithSearch)}
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}
export const ActivityPoweredInsertLinkToolbarWithIntl = injectIntl(
  ActivityPoweredInsertLinkToolbar,
);

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
        ? AddDisplayTextToolbarWithIntl
        : EditLinkHrefToolbarWithIntl;
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
          <ActivityPoweredInsertLinkToolbarWithIntl
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
          <InsertLinkToolbarWithIntl
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

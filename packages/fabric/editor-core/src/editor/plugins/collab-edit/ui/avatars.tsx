import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import Avatar, { AvatarGroup } from '@atlaskit/avatar';
import { EditorView } from 'prosemirror-view';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { pluginKey as collabEditPluginKey } from '../plugin';
import { getAvatarColor } from '../utils';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

export interface Props {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
}

// Workaround for https://ecosystem.atlassian.net/browse/AK-3872
// tslint:disable-next-line:variable-name
const AvatarContainer: any = styled.div`
  padding-right: ${akGridSizeUnitless}px;
  margin-right: ${akGridSizeUnitless}px;
`;

const itemAppear = keyframes`
0% {
  transform: scale(0);
}

50% {
  transform: scale(1.1);
}

100% {
  transform: scale(1);
}
`;

// tslint:disable-next-line:variable-name
const AvatarItem: any = styled.div`
  position: relative;
  align-self: center;

  & > div {
    animation: ${itemAppear} 500ms 1;
    animation-fill-mode: both;
  }

  &:before {
    content: '${(props: any) => props.avatar}';
    display: block;
    position: absolute;
    right: -1px;
    bottom: -1px;
    width: 13px;
    height: 13px;
    z-index: 10;
    border-radius: 3px;
    background: ${(props: any) => props.badgeColor};
    color: #fff;
    font-size: 9px;
    line-height: 0;
    padding-top: 7px;
    text-align: center;
    box-shadow: 0 0 1px #fff;
    box-sizing: border-box;

    animation: ${itemAppear} 250ms 1;
    animation-fill-mode: both;
    animation-delay: 400ms;
  }
`;

declare interface ItemProps {
  name: string;
  sessionId: string;
  email: string;
  src: string;
}

function Item(props: ItemProps) {
  const color = getAvatarColor(props.sessionId).color.solid;
  const avatar = props.name.substr(0, 1).toUpperCase();

  return (
    <AvatarItem badgeColor={color} avatar={avatar}>
      <Avatar {...props} />
    </AvatarItem>
  );
}

export default class Avatars extends React.Component<Props, any> {
  private renderAvatars = state => {
    if (!state.data) {
      return null;
    }
    const { sessionId, activeParticipants } = state.data;
    const avatars = activeParticipants
      .map(p => ({
        email: p.email,
        key: p.sessionId,
        name: p.name,
        src: p.avatar,
        sessionId: p.sessionId,
        size: 'medium',
      }))
      .sort(p => (p.sessionId === sessionId ? -1 : 1));

    if (!avatars.length) {
      return null;
    }

    return (
      <AvatarContainer>
        <AvatarGroup
          appearance="stack"
          size="medium"
          data={avatars}
          // Breaks CSS when avatar renders as button, seems like a dependency problem
          // onAvatarClick={this.onAvatarClick}
          avatar={Item}
        />
      </AvatarContainer>
    );
  };

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ data: collabEditPluginKey }}
        render={this.renderAvatars}
      />
    );
  }
}

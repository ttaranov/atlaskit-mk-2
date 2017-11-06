import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import Avatar, { AvatarGroup } from '@atlaskit/avatar';
import { EditorView } from 'prosemirror-view';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { pluginKey as collabEditPluginKey } from '../plugin';
import { getAvatarColor } from '../utils';

export interface Props {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
}

// tslint:disable-next-line:variable-name
const AvatarContainer: any = styled.div`
  position: absolute;
  right: 0;
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
    right: -2px;
    bottom: -2px;
    width: 13px;
    height: 6px;
    z-index: 10;
    border-radius: 3px;
    background: ${(props: any) => props.badgeColor};
    color: #fff;
    font-size: 9px;
    line-height: 0;
    padding-top: 7px;
    text-align: center;
    box-shadow: 0 0 1px #fff;


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
  private onAvatarClick = (data) => {
  }

  private renderAvatars = ({ data }) => {
    const { sessionId, activeParticipants } = data;
    const avatars = activeParticipants.map(p => ({
      email: p.email,
      key: p.sessionId,
      name: p.name,
      src: p.avatar,
      sessionId: p.sessionId
    })).sort(p => p.sessionId === sessionId ? -1 : 1);

    return (
      <AvatarContainer>
        <AvatarGroup
          appearance="stack"
          size="medium"
          data={avatars}
          onAvatarClick={this.onAvatarClick}
          avatar={Item}
        />
      </AvatarContainer>
    );
  }

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

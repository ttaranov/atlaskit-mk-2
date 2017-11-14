import * as React from 'react';
import { PureComponent } from 'react';
import {
  MentionProvider,
  ResourcedMention,
} from '@atlaskit/mention';

import { MentionUserType as UserType } from '../../schema';
import { MentionEventHandlers } from '../EventHandlers';
import ResourcedMentionWithProfilecard from './mention-with-profilecard';
import { ProfilecardProvider } from './types';

export interface Props {
  id: string;
  text: string;
  accessLevel?: string;
  userType?: UserType;
  mentionProvider?: Promise<MentionProvider>;
  profilecardProvider?: Promise<ProfilecardProvider>;
  eventHandlers?: MentionEventHandlers;
  portal?: HTMLElement;
}

export interface State {
  profilecardProvider: ProfilecardProvider | null;
}

const GENERIC_USER_IDS = ['HipChat', 'all', 'here'];
const noop = () => {};

export default class MentionWithProviders extends PureComponent<Props, State> {
  state: State = { profilecardProvider: null };

  componentWillMount() {
    this.updateProfilecardProvider(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.profilecardProvider !== this.props.profilecardProvider) {
      this.updateProfilecardProvider(nextProps);
    }
  }

  private async updateProfilecardProvider(props: Props) {
    if (props.profilecardProvider) {
      try {
        const resolvedProfilecardProvider = await props.profilecardProvider;
        this.setState({ profilecardProvider: resolvedProfilecardProvider });
      } catch (err) {
        this.setState({ profilecardProvider: null });
      }
    } else {
      this.setState({ profilecardProvider: null });
    }
  }

  render() {
    const {
      accessLevel,
      userType,
      eventHandlers,
      id,
      mentionProvider,
      portal,
      text,
    } = this.props;

    const { profilecardProvider } = this.state;

    const actionHandlers = {};
    ['onClick', 'onMouseEnter', 'onMouseLeave'].forEach(handler => {
      actionHandlers[handler] = eventHandlers && eventHandlers[handler] || noop;
    });

    // tslint:disable-next-line:variable-name
    const MentionComponent = (profilecardProvider && GENERIC_USER_IDS.indexOf(id) === -1)
      ? ResourcedMentionWithProfilecard
      : ResourcedMention;

    return (
      <MentionComponent
        id={id}
        text={text}
        accessLevel={accessLevel}
        userType={userType}
        mentionProvider={mentionProvider}
        profilecardProvider={profilecardProvider}
        portal={portal}
        {...actionHandlers}
      />
    );
  }
}

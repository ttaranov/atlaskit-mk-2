// @flow
import React, { PureComponent } from 'react';
import { colors } from '@atlaskit/theme';
import AkSpinner from '@atlaskit/spinner';
import AkAvatar from '@atlaskit/avatar';
import AkButton from '@atlaskit/button';

import ErrorMessage from './components/ErrorMessage';
import HeightTransitionWrapper from './components/HeightTransitionWrapper';
import IconLabel from './components/IconLabel';
import presences from './internal/presences';

import {
  ProfileCardErrorType,
  PresenceTypes,
  ProfileCardAction,
} from '../types';

import {
  CardContainer,
  SpinnerContainer,
  ProfileImage,
  CardContent,
  DetailsGroup,
  FullNameLabel,
  JobTitleLabel,
  AppTitleLabel,
  ActionsFlexSpacer,
  ActionButtonGroup,
  DeactivatedInfo,
} from './styled/Card';

type Props = {
  isCensored: boolean,
  isActive: boolean,
  isBot: boolean,
  avatarUrl: string,
  fullName: string,
  meta: string,
  nickname: string,
  email: string,
  location: string,
  timestring: string,
  presence: PresenceTypes,
  actions: ProfileCardAction[],
  isLoading: boolean,
  hasError: boolean,
  errorType: ProfileCardErrorType,
  clientFetchProfile: Function,
  analytics: Function,
  presenceMessage: string,
};

export default class Profilecard extends PureComponent<Props> {
  static defaultProps = {
    isCurrentUser: false,
    isCensored: false,
    isActive: true,
    isBot: false,
    isNotMentionable: false,
    presence: 'none',
    actions: [],
    isLoading: false,
    hasError: false,
    analytics: () => {},
    presenceMessage: '',
  };

  constructor(options) {
    super(options);

    this._timeOpen = null;

    this.clientFetchProfile = (...args) => {
      this.props.analytics('profile-card.reload', {});
      this.props.clientFetchProfile(...args);
    };
  }

  componentDidMount() {
    this._timeOpen = Date.now();
    this.props.analytics('profile-card.view', {});
  }

  _durationSince = from => {
    const fromParsed = parseInt(from, 10) || 0;
    return fromParsed > 0 ? Date.now() - fromParsed : null;
  };

  renderActionsButtons() {
    if (this.props.actions.length === 0) {
      return null;
    }

    return (
      <ActionButtonGroup>
        {this.props.actions.map((action, idx) => (
          <AkButton
            appearance={idx === 0 ? 'default' : 'subtle'}
            compact
            key={action.label}
            onClick={(...args) => {
              this.props.analytics('profile-card.click', {
                id: action.id || null,
                duration: this._durationSince(this._timeOpen),
              });
              action.callback(...args);
            }}
          >
            {action.label}
          </AkButton>
        ))}
      </ActionButtonGroup>
    );
  }

  renderErrorMessage() {
    return (
      <ErrorMessage
        reload={this.props.clientFetchProfile && this.clientFetchProfile}
        errorType={this.props.errorType}
      />
    );
  }

  renderCardDetailsDefault() {
    const validPresence = presences[this.props.presence];

    return (
      <DetailsGroup>
        <FullNameLabel noMeta={!this.props.meta}>
          {this.props.fullName}
        </FullNameLabel>
        {this.props.meta && <JobTitleLabel>{this.props.meta}</JobTitleLabel>}
        <IconLabel icon={this.props.presence}>
          {(!!validPresence && this.props.presenceMessage) || validPresence}
        </IconLabel>
        <IconLabel icon="email">{this.props.email}</IconLabel>
        <IconLabel icon="mention">
          {this.props.nickname && `@${this.props.nickname}`}
        </IconLabel>
        <IconLabel icon="time">{this.props.timestring}</IconLabel>
        <IconLabel icon="location">{this.props.location}</IconLabel>
      </DetailsGroup>
    );
  }

  renderCardDetailsDeactivated() {
    const userName = this.props.isCensored
      ? this.props.nickname
      : this.props.fullName;

    return (
      <DetailsGroup>
        <FullNameLabel noMeta>{userName}</FullNameLabel>
        <DeactivatedInfo>This user is no longer available</DeactivatedInfo>
      </DetailsGroup>
    );
  }

  renderCardDetailsCensored() {
    return (
      <DetailsGroup>
        <FullNameLabel noMeta>{this.props.nickname}</FullNameLabel>
      </DetailsGroup>
    );
  }

  renderCardDetailsApp() {
    return (
      <DetailsGroup>
        <FullNameLabel>{this.props.fullName}</FullNameLabel>
        <AppTitleLabel>App</AppTitleLabel>
        <IconLabel icon="mention">
          {this.props.nickname && `@${this.props.nickname}`}
        </IconLabel>
      </DetailsGroup>
    );
  }

  renderCardDetails() {
    if (this.props.isBot) {
      return this.renderCardDetailsApp();
    } else if (!this.props.isActive) {
      return this.renderCardDetailsDeactivated();
    } else if (this.props.isCensored) {
      return this.renderCardDetailsCensored();
    }

    return this.renderCardDetailsDefault();
  }

  renderProfilecard() {
    this.props.analytics('profile-card.loaded', {
      duration: this._durationSince(this._timeOpen),
    });

    return (
      <CardContainer>
        <ProfileImage>
          <AkAvatar
            size="xlarge"
            src={this.props.isActive ? this.props.avatarUrl : null}
            borderColor={colors.N0}
          />
        </ProfileImage>
        <CardContent>
          {this.renderCardDetails()}
          <ActionsFlexSpacer />
          {this.renderActionsButtons()}
        </CardContent>
      </CardContainer>
    );
  }

  render() {
    let cardContent = null;

    if (this.props.hasError) {
      this.props.analytics('profile-card.error', {});

      cardContent = this.renderErrorMessage();
    } else if (this.props.isLoading) {
      cardContent = (
        <SpinnerContainer>
          <AkSpinner />
        </SpinnerContainer>
      );
    } else if (this.props.fullName) {
      cardContent = this.renderProfilecard();
    }

    return <HeightTransitionWrapper>{cardContent}</HeightTransitionWrapper>;
  }
}

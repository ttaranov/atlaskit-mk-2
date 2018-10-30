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

import type { ProfilecardProps } from './types';

import {
  ActionButtonGroup,
  ActionsFlexSpacer,
  AppTitleLabel,
  CardContainer,
  CardContent,
  DeactivatedInfo,
  DetailsGroup,
  FullNameLabel,
  JobTitleLabel,
  ProfileImage,
  SpinnerContainer,
} from './styled/Card';

export default class Profilecard extends PureComponent<ProfilecardProps, void> {
  static defaultProps = {
    isActive: true,
    isBot: false,
    isNotMentionable: false,
    presence: 'none',
    actions: [],
    isLoading: false,
    hasError: false,
    analytics: () => {},
    clientFetchProfile: () => {},
    presenceMessage: '',
  };

  _timeOpen: any;
  clientFetchProfile: Function;

  constructor(props: ProfilecardProps) {
    super(props);

    this._timeOpen = null;

    this.clientFetchProfile = (...args: any) => {
      this.callAnalytics('profile-card.reload', {});
      this.callClientFetchProfile(...args);
    };
  }

  callClientFetchProfile = (...args: any) => {
    if (this.props.clientFetchProfile) {
      this.props.clientFetchProfile(...args);
    }
  };

  callAnalytics = (id: string, options: any) => {
    if (this.props.analytics) {
      this.props.analytics(id, options);
    }
  };

  componentDidMount() {
    this._timeOpen = Date.now();
    this.callAnalytics('profile-card.view', {});
  }

  _durationSince = (from: number) => {
    const fromParsed = parseInt(from, 10) || 0;
    return fromParsed > 0 ? Date.now() - fromParsed : null;
  };

  renderActionsButtons() {
    if (this.props.actions && this.props.actions.length === 0) {
      return null;
    }

    return (
      <ActionButtonGroup>
        {this.props.actions &&
          this.props.actions.map((action, idx) => (
            <AkButton
              appearance={idx === 0 ? 'default' : 'subtle'}
              compact
              key={action.label}
              onClick={(...args) => {
                this.callAnalytics('profile-card.click', {
                  id: action.id || null,
                  duration: this._durationSince(this._timeOpen),
                });
                if (action.callback) {
                  action.callback(...args);
                }
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
    const validPresence = presences[this.props.presence || 'none'];

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
    return (
      <DetailsGroup>
        <FullNameLabel noMeta>{this.props.fullName}</FullNameLabel>
        <DeactivatedInfo>This user is no longer available</DeactivatedInfo>
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
    }

    return this.renderCardDetailsDefault();
  }

  renderProfilecard() {
    this.callAnalytics('profile-card.loaded', {
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
      this.callAnalytics('profile-card.error', {});

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

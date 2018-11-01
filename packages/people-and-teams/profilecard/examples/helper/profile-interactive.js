// @flow
import React, { Component } from 'react';
import uid from 'uid';
import styled from 'styled-components';
import { AtlasKitThemeProvider, colors, themed } from '@atlaskit/theme';
import { profiles } from '../../mock-helpers';
import { AkProfilecard } from '../../src';

import type { PresenceTypes } from '../../src/types';

const StoryWrapper = styled.div`
  label {
    color: ${themed({ light: colors.N800, dark: colors.N0 })};
    margin-right: 10px;
    -webkit-user-select: none;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    float: left;
  }
`;

const ProfileCardWrapper = styled.div`
  height: 340px;
`;

const handleActionClick = title => () => {
  console.log(`${title} button clicked`);
};

const getTimeString = showWeekday => {
  return showWeekday ? 'Thu 9:56am' : '9:56am';
};

type Props = {};

type State = {
  avatarUrl: string,
  email: string,
  presence: PresenceTypes,
  fullName: string,
  nickname: string,
  meta: string,
  location: string,
  timeString: string,

  isBot: boolean,
  isActive: boolean,

  hasDarkTheme: boolean,
  hasWeekday: boolean,
  hasAvatar: boolean,
  hasMeta: boolean,
  hasLocation: boolean,
  hasTime: boolean,
  hasLongName: boolean,
  hasLongRole: boolean,
  hasAltActions: boolean,
  hasNoActions: boolean,
  hasLoadingState: boolean,
  hasErrorState: boolean,
  hasLongPresenceMessage: string,
};

export default class ProfilecardInteractive extends Component<Props, State> {
  state = {
    avatarUrl: profiles[4].User.avatarUrl,
    email: 'nlindsey@example.com',
    presence: 'available',
    fullName: 'Natalie Lindsey',
    nickname: 'natalie',
    meta: 'Senior Developer',
    location: 'Sydney, Australia',
    timeString: getTimeString(),

    isBot: false,
    isActive: true,

    hasDarkTheme: false,
    hasWeekday: false,
    hasAvatar: true,
    hasMeta: true,
    hasLocation: true,
    hasTime: true,
    hasLongName: false,
    hasLongRole: false,
    hasAltActions: false,
    hasNoActions: false,
    hasLoadingState: false,
    hasErrorState: false,
    hasLongPresenceMessage: '',
  };

  actions = [
    {
      label: 'View profile',
      id: 'view-profile',
      callback: handleActionClick('View profile'),
    },
  ];

  createCheckboxBooleanAttribute(attribute: string) {
    const id = `label-${uid()}`;
    return (
      <label htmlFor={id}>
        <input
          checked={this.state[attribute]}
          id={id}
          onChange={() =>
            this.setState({ [attribute]: !this.state[attribute] })
          }
          type="checkbox"
        />
        {attribute}
      </label>
    );
  }

  createRadioPresenceAttribute(attribute: PresenceTypes) {
    const id = `label-${uid()}`;
    return (
      <label htmlFor={id}>
        <input
          checked={this.state.presence === attribute}
          id={id}
          onChange={() => this.setState({ presence: attribute })}
          type="radio"
        />
        {attribute}
      </label>
    );
  }

  render() {
    const customActions = [
      { label: 'Foo', id: 'foo', callback: handleActionClick('Foo') },
      { label: 'Bar', id: 'bar', callback: handleActionClick('Bar') },
      { label: 'Baz', id: 'baz', callback: handleActionClick('Baz') },
    ];

    const actions = this.state.hasAltActions ? customActions : this.actions;

    const meta = this.state.hasLongRole
      ? 'Sed do eiusmod tempor incididunt ut labore'
      : this.state.meta;

    /* eslint-disable max-len */
    return (
      <AtlasKitThemeProvider mode={this.state.hasDarkTheme ? 'dark' : 'light'}>
        <StoryWrapper>
          <ProfileCardWrapper>
            <AkProfilecard
              isLoading={this.state.hasLoadingState}
              hasError={this.state.hasErrorState}
              actions={this.state.hasNoActions ? [] : actions}
              isBot={this.state.isBot}
              isActive={this.state.isActive}
              avatarUrl={this.state.hasAvatar ? this.state.avatarUrl : ''}
              email={this.state.email}
              fullName={
                this.state.hasLongName
                  ? `${this.state.fullName} Hathaway ${this.state.fullName}`
                  : this.state.fullName
              }
              location={this.state.hasLocation ? this.state.location : ''}
              meta={this.state.hasMeta ? meta : ''}
              nickname={this.state.nickname}
              presence={this.state.presence}
              timestring={
                this.state.hasTime ? getTimeString(this.state.hasWeekday) : ''
              }
              clientFetchProfile={handleActionClick('Retry')}
              presenceMessage={
                this.state.hasLongPresenceMessage
                  ? 'I honestly have a very long and useless presence message'
                  : ''
              }
            />
          </ProfileCardWrapper>

          <div style={{ marginTop: '16px' }}>
            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasAvatar')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasAltActions')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasNoActions')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasMeta')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasLocation')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasTime')}</li>
            </ul>

            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasLongName')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasLongRole')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasWeekday')}</li>
            </ul>

            <ul>
              <li>{this.createCheckboxBooleanAttribute('hasLoadingState')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasErrorState')}</li>
              <li>{this.createCheckboxBooleanAttribute('isBot')}</li>
              <li>{this.createCheckboxBooleanAttribute('isActive')}</li>
              <li>{this.createCheckboxBooleanAttribute('hasDarkTheme')}</li>
            </ul>

            <ul>
              <li>{this.createRadioPresenceAttribute('available')}</li>
              <li>{this.createRadioPresenceAttribute('busy')}</li>
              <li>{this.createRadioPresenceAttribute('unavailable')}</li>
              <li>{this.createRadioPresenceAttribute('focus')}</li>
              <li>{this.createRadioPresenceAttribute('none')}</li>
              <li>
                {this.createCheckboxBooleanAttribute('hasLongPresenceMessage')}
              </li>
            </ul>
          </div>
        </StoryWrapper>
      </AtlasKitThemeProvider>
    );
  }
}

// @flow
import React, { Component } from 'react';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import { colors } from '@atlaskit/theme';
import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';
import Item from '@atlaskit/item';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';
import PresenceBusyIcon from '@atlaskit/icon/glyph/presence-busy';
import PresenceUnavailableIcon from '@atlaskit/icon/glyph/presence-unavailable';
import TextField from '@atlaskit/field-text';

//TODO:
// 0. Import type for Presence as it does not seem to work
// 1. Write a logic to update the avatar presence based on selected
// 2. Write a logic to display the text if Busy is selected
// 3. Write a logic to display the status by default

type Props = {
  /** Indicates a user's online status by showing a small icon on the avatar.
   Refer to presence values on the Presence component.*/
  presence: 'online' | 'busy' | 'focus' | 'offline',
  /** A url to load an image from (this can also be a base64 encoded image). */
  src?: string,
  /** Status field value */
  value: string,
};

type State = {
  isSelected: boolean,
};

export default class Status extends Component<Props, State> {
  props: Props;
  state: State = { isSelected: false };
  static defaultProps = {
    value: '',
    presence: 'offline',
  };

  render() {
    return (
      <div>
        <DropdownMenu
          trigger={
            <Item
              isCompact
              description={this.props.value}
              elemBefore={
                <Avatar
                  src={this.props.src}
                  size="small"
                  presence={this.props.presence}
                />
              }
            />
          }
          shouldFlip
          // eslint-disable-next-line
          onOpenChange={e => console.log('dropdown opened', e)}
          /** DEPRECATED */
          // onItemActivated={item => {
          //   // you can do allthethings here!
          //   console.log('Hello')
          //   console.log(item);
          // }}
        >
          <DropdownItemGroupRadio id="status" title="Set your status">
            <DropdownItemRadio id="Avalaible">
              <PresenceActiveIcon
                label="available"
                size="small"
                primaryColor={colors.G300}
              />Available
            </DropdownItemRadio>
            <DropdownItemRadio isSelected id="Away">
              <PresenceUnavailableIcon
                label="away"
                size="small"
                //TODO: this is not the right color
                primaryColor={colors.N300A}
              />Away
            </DropdownItemRadio>
            {!this.state.isSelected ? (
              <DropdownItemRadio id="Busy">
                <PresenceBusyIcon
                  label="busy"
                  size="small"
                  primaryColor={colors.R300}
                />Busy
              </DropdownItemRadio>
            ) : (
              <div>
                <DropdownItemRadio id="Busy">
                  <PresenceBusyIcon
                    label="busy"
                    size="small"
                    primaryColor={colors.R300}
                  />Busy
                </DropdownItemRadio>
                <div>We will mute your notifications</div>
              </div>
            )}
          </DropdownItemGroupRadio>
          <TextField autoFocus value={this.props.value} />
          <Button appareance="subtle" onClick={() => {}}>
            Log out
          </Button>
        </DropdownMenu>
      </div>
    );
  }
}

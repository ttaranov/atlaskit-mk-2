// @flow
import React, { Component, type Node } from 'react';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemRadio,
  DropdownItemGroupRadio,
} from '@atlaskit/dropdown-menu';
import PresenceActiveIcon from '@atlaskit/icon/glyph/presence-active';
import PresenceBusyIcon from '@atlaskit/icon/glyph/presence-busy';
import PresenceUnavailableIcon from '@atlaskit/icon/glyph/presence-unavailable';
import TextField from '@atlaskit/field-text';

type Props = {
  // /** Description of the room */
  // description: string,
  // /** Room image */
  // image?: string,
  // /** Room image size */
  // size?: string,
  // /** Room actions: close, new messages */
  // actions?: Node,
};

type State = {
  isSelected: boolean,
};

const myImage =
  'https://avatar-cdn.atlassian.com/bda11adef3c5f05a91cc6500fecda193?by=hash';
export default class Status extends Component<Props, State> {
  props: Props;
  state: State = { isSelected: false };
  static defaultProps = {
    // roomName: '',
    // description: '',
  };
  //TODO: Write a logic when busy is selected to dispaly
  render() {
    // const children = this.props.roomName;
    return (
      <div>
        <DropdownMenu
          trigger={<Avatar src={myImage} size="small" presence="busy" />}
          shouldFlip
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
                primaryColor="light green"
              />Available
            </DropdownItemRadio>
            <DropdownItemRadio id="Away">
              <PresenceUnavailableIcon
                label="away"
                size="small"
                primaryColor="grey"
              />Away
            </DropdownItemRadio>
            {!this.state.isSelected ? (
              <DropdownItemRadio id="Busy">
                <PresenceBusyIcon
                  label="busy"
                  size="small"
                  primaryColor="red"
                />Busy
              </DropdownItemRadio>
            ) : (
              <div>
                <DropdownItemRadio id="Busy">
                  <PresenceBusyIcon
                    label="busy"
                    size="small"
                    primaryColor="red"
                  />Busy
                </DropdownItemRadio>
                <div>We will mute your notifications</div>
              </div>
            )}
          </DropdownItemGroupRadio>
          <br />
          <TextField autoFocus value="Working on..." />
          <Button appareance="subtle" onClick={() => {}}>
            Log out
          </Button>
        </DropdownMenu>
      </div>
    );
  }
}

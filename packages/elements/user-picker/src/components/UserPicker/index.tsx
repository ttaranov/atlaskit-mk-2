import Droplist from '@atlaskit/droplist';
import * as React from 'react';
import { User } from '../../types';
import UserPickerItem from '../UserPickerItem';
import { PickerStyle } from './styles';

export interface Props {
  trigger: JSX.Element;
  users?: User[];
  open?: boolean;
  width?: number;
  onSelection?: (user: User) => void;
  onRequestClose?: () => void;
}

export class UserPicker extends React.Component<Props, {}> {
  static defaultProps = {
    width: 350,
    open: false,
  };

  handleOpenChange = ({ isOpen }) => {
    if (!isOpen && this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  };

  render() {
    const { open, users, trigger, width } = this.props;

    return (
      <PickerStyle width={width}>
        <Droplist
          boundariesElement="viewport"
          isOpen={open}
          trigger={trigger}
          isLoading={!users}
          onOpenChange={this.handleOpenChange}
          shouldFitContainer
        >
          {users &&
            users.map(user => <UserPickerItem key={user.id} user={user} />)}
        </Droplist>
      </PickerStyle>
    );
  }
}

import Select, { AsyncSelect } from '@atlaskit/select';
import * as React from 'react';
import { User } from '../types';
import UserPickerItem from './UserPickerItem';

type Value = User | User[] | undefined;
type Action =
  | 'select-option'
  | 'deselect-option'
  | 'remove-value'
  | 'pop-value'
  | 'set-value'
  | 'clear'
  | 'create-option';

export type Props = {
  users?: User[];
  width?: number;
  loadUsers?: (searchText?: string) => Promise<User[]>;
  onChange?: (value: Value, action: Action) => void;
};

const userToOption = (user: User) => ({ label: user.name, value: user });

const formatUserLabel = ({ value }, { context }) => (
  <UserPickerItem user={value} context={context} />
);

export class UserPicker extends React.PureComponent<Props> {
  static defaultProps = {
    width: 350,
  };

  private isAsync = () => Boolean(this.props.loadUsers);

  private loadOptions = (search: string) => {
    const { loadUsers } = this.props;
    if (loadUsers) {
      return loadUsers(search).then(users => users.map(userToOption));
    }
    return undefined;
  };

  private handleChange = ({ value }, { action }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value, action);
    }
  };

  render() {
    const { users, width } = this.props;
    const async = this.isAsync();

    const Root = async ? AsyncSelect : Select;

    return (
      <Root
        formatOptionLabel={formatUserLabel}
        options={users && users.map(userToOption)}
        defaultOptions={async}
        loadOptions={this.loadOptions}
        onChange={this.handleChange}
        styles={{
          menu: css => ({ ...css, width }),
          control: css => ({ ...css, width, height: 60 }),
        }}
      />
    );
  }
}

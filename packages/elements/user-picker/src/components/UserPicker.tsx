import Select, { AsyncSelect } from '@atlaskit/select';
import * as React from 'react';
import { User } from '../types';
import { UserMultiValueLabel } from './UserMultiValueLabel';
import { UserMultiValueRemove } from './UserMultiValueRemove';
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
  isMulti?: boolean;
};

const userToOption = (user: User) => ({
  label: user.name || user.nickname,
  value: user.id,
  user,
});

const formatUserLabel = ({ user }, { context, ...other }) => {
  return <UserPickerItem user={user} context={context} />;
};

export class UserPicker extends React.PureComponent<Props> {
  static defaultProps = {
    width: 350,
    isMulti: false,
  };

  static components = {
    MultiValueLabel: UserMultiValueLabel,
    MultiValueRemove: UserMultiValueRemove,
  };

  private isAsync = () => Boolean(this.props.loadUsers);

  private loadOptions = (search: string) => {
    const { loadUsers } = this.props;
    if (loadUsers) {
      return loadUsers(search).then(users => users.map(userToOption));
    }
    return undefined;
  };

  private extractUserValue = value => {
    const { isMulti } = this.props;
    if (isMulti) {
      return value.map(({ user }) => user);
    }
    return value.user;
  };

  private handleChange = (value, { action }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.extractUserValue(value), action);
    }
  };

  private getStyles = width => ({
    menu: css => ({ ...css, width }),
    control: css => ({
      ...css,
      width,
      flexWrap: 'nowrap',
    }),
    input: css => ({ ...css, lineHeight: '44px' }),
    valueContainer: css => ({
      ...css,
      flexGrow: 1,
      overflow: 'hidden',
    }),
    multiValue: css => ({
      ...css,
      borderRadius: 24,
    }),
    multiValueRemove: css => ({
      ...css,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
  });

  render() {
    const { users, width, isMulti } = this.props;
    const async = this.isAsync();

    const Root = async ? AsyncSelect : Select;

    return (
      <Root
        isMulti={isMulti}
        formatOptionLabel={formatUserLabel}
        options={users && users.map(userToOption)}
        defaultOptions={async}
        loadOptions={this.loadOptions}
        onChange={this.handleChange}
        styles={this.getStyles(width)}
        components={UserPicker.components}
      />
    );
  }
}

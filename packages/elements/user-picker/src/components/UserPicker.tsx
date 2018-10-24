import Select from '@atlaskit/select';
import * as debounce from 'lodash.debounce';
import * as React from 'react';
import { InputActionTypes, LoadOptions, OnChange, User } from '../types';
import { batchByKey } from './batch';
import { getComponents } from './components';
import { getStyles } from './styles';
import {
  extractUserValue,
  formatUserLabel,
  getOptions,
  isIterable,
} from './utils';

export type Props = {
  users?: User[];
  width?: number;
  loadUsers?: LoadOptions;
  onChange?: OnChange;
  isMulti?: boolean;
  search?: string;
  anchor?: React.ComponentType<any>;
  open?: boolean;
  isLoading?: boolean;
};

export type State = {
  users: User[];
  resultVersion: number;
  inflightRequest: number;
  count: number;
};

export class UserPicker extends React.PureComponent<Props, State> {
  static defaultProps = {
    width: 350,
    isMulti: false,
  };

  private selectRef;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      resultVersion: 0,
      inflightRequest: 0,
      count: 0,
    };
  }

  private withSelectRef = (callback: (selectRef: any) => void) => () => {
    if (this.selectRef) {
      callback(this.selectRef.select.select);
    }
  };

  public nextOption = this.withSelectRef(select => select.focusOption('down'));

  public previousOption = this.withSelectRef(select =>
    select.focusOption('up'),
  );

  public selectOption = this.withSelectRef(select => {
    const focusedOption = select.state.focusedOption;
    select.selectOption(focusedOption);
  });

  private handleChange = (value, { action }) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(extractUserValue(value), action);
    }
  };

  private handleSelectRef = ref => {
    this.selectRef = ref;
  };

  private addUsers = batchByKey(
    (request: string, newUsers: (User | User[])[]) => {
      this.setState(({ inflightRequest, users, resultVersion, count }) => {
        if (inflightRequest.toString() === request) {
          return {
            users: (resultVersion === inflightRequest ? users : []).concat(
              newUsers.reduce<User[]>(
                (nextUsers, item) => nextUsers.concat(item[0]),
                [],
              ),
            ),
            resultVersion: inflightRequest,
            count: count - newUsers.length,
          };
        }
        return null;
      });
    },
  );

  private executeLoadOptions = debounce((search?: string) => {
    const { loadUsers } = this.props;
    if (loadUsers) {
      this.setState(({ inflightRequest: previousRequest }) => {
        const inflightRequest = previousRequest + 1;
        const result = loadUsers(search);
        const addUsers = this.addUsers.bind(this, inflightRequest.toString());
        let count = 0;
        if (isIterable(result)) {
          for (const value of result) {
            Promise.resolve(value).then(addUsers);
            count++;
          }
        } else {
          Promise.resolve(result).then(addUsers);
          count++;
        }
        return {
          inflightRequest,
          count,
        };
      });
    }
  }, 200);

  private handleFocus = () => {
    this.executeLoadOptions();
  };

  private handleInputChange = (
    search: string,
    { action }: { action: InputActionTypes },
  ) => {
    if (action === 'input-change') {
      this.executeLoadOptions(search);
    }
  };

  private triggerInputChange = this.withSelectRef(select => {
    select.onInputChange(this.props.search, { action: 'input-change' });
  });

  componentDidUpdate(prevProps: Props) {
    // trigger onInputChange
    if (this.props.search !== prevProps.search) {
      this.triggerInputChange();
    }

    // load options when the picker open
    if (this.props.open && !prevProps.open) {
      this.executeLoadOptions();
    }
  }

  render() {
    const {
      width,
      isMulti,
      search,
      open,
      anchor,
      users,
      isLoading,
    } = this.props;
    const { users: usersFromState, count } = this.state;
    return (
      <Select
        ref={this.handleSelectRef}
        isMulti={isMulti}
        formatOptionLabel={formatUserLabel}
        options={getOptions(usersFromState, users)}
        onChange={this.handleChange}
        styles={getStyles(width)}
        components={getComponents(anchor)}
        inputValue={search}
        menuIsOpen={open}
        onFocus={this.handleFocus}
        isLoading={count > 0 || isLoading}
        onInputChange={this.handleInputChange}
      />
    );
  }
}

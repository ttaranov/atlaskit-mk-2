import Select from '@atlaskit/select';
import * as debounce from 'lodash.debounce';
import * as React from 'react';
import {
  InputActionTypes,
  LoadOptions,
  OnChange,
  OnInputChange,
  OnPicker,
  OnUser,
  User,
  UserOption,
  UserValue,
} from '../types';
import { batchByKey } from './batch';
import { getComponents } from './components';
import { getStyles } from './styles';
import {
  extractUserValue,
  getOptions,
  isIterable,
  usersToOptions,
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
  onInputChange?: OnInputChange;
  onSelection?: OnUser;
  onFocus?: OnPicker;
  onBlur?: OnPicker;
  blurInputOnSelect?: boolean;
  appearance?: 'normal' | 'compact';
  subtle?: boolean;
  defaultValue?: UserValue;
  value?: UserValue;
};

export type State = {
  users: User[];
  value?: UserOption[];
  resultVersion: number;
  inflightRequest: number;
  count: number;
  hoveringClearIndicator: boolean;
  menuIsOpen: boolean;
};

export class UserPicker extends React.PureComponent<Props, State> {
  static defaultProps = {
    width: 350,
    isMulti: false,
    appearance: 'normal',
    subtle: false,
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const derivedState: Partial<State> = {};
    if (nextProps.open !== undefined) {
      derivedState.menuIsOpen = nextProps.open;
    }
    if (nextProps.value) {
      derivedState.value = usersToOptions(nextProps.value);
    } else if (nextProps.defaultValue && !prevState.value) {
      derivedState.value = usersToOptions(nextProps.defaultValue);
    }
    return derivedState;
  }

  private selectRef;

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      resultVersion: 0,
      inflightRequest: 0,
      count: 0,
      hoveringClearIndicator: false,
      menuIsOpen: false,
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

  private handleChange = (value, { action, removedValue }) => {
    if (removedValue && removedValue.user.fixed) {
      return;
    }
    const { onChange, onSelection } = this.props;
    if (onChange) {
      onChange(extractUserValue(value), action);
    }
    if (action === 'select-option' && onSelection) {
      onSelection(value.user);
    }
    if (!this.props.value) {
      this.setState({ value });
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
    this.setState({ menuIsOpen: true });
  };

  private handleBlur = () => {
    this.setState({ menuIsOpen: false });
  };

  private handleInputChange = (
    search: string,
    { action }: { action: InputActionTypes },
  ) => {
    const { onInputChange } = this.props;
    if (action === 'input-change') {
      if (onInputChange) {
        onInputChange(search);
      }
      this.executeLoadOptions(search);
    }
  };

  private triggerInputChange = this.withSelectRef(select => {
    select.onInputChange(this.props.search, { action: 'input-change' });
  });

  componentDidUpdate(prevProps: Props, prevState: State) {
    // trigger onInputChange
    if (this.props.search !== prevProps.search) {
      this.triggerInputChange();
    }

    // load options when the picker open
    if (this.state.menuIsOpen && !prevState.menuIsOpen) {
      this.executeLoadOptions();
    }
  }

  handleClearIndicatorHover = (hoveringClearIndicator: boolean) => {
    this.setState({ hoveringClearIndicator });
  };

  render() {
    const {
      width,
      isMulti,
      search,
      anchor,
      users,
      isLoading,
      appearance,
      subtle,
    } = this.props;
    const {
      users: usersFromState,
      count,
      hoveringClearIndicator,
      menuIsOpen,
      value,
    } = this.state;
    return (
      <Select
        value={value}
        ref={this.handleSelectRef}
        isMulti={isMulti}
        options={getOptions(usersFromState, users)}
        onChange={this.handleChange}
        styles={getStyles(width)}
        components={getComponents(isMulti, anchor)}
        inputValue={search}
        menuIsOpen={menuIsOpen}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        isLoading={count > 0 || isLoading}
        onInputChange={this.handleInputChange}
        menuPlacement="auto"
        placeholder="Find a person..." // TODO i18n
        classNamePrefix="fabric-user-picker"
        onClearIndicatorHover={this.handleClearIndicatorHover}
        hoveringClearIndicator={hoveringClearIndicator}
        appearance={isMulti ? 'compact' : appearance}
        isClearable
        subtle={isMulti ? false : subtle}
        blurInputOnSelect={!isMulti}
        closeMenuOnSelect={!isMulti}
        openMenuOnFocus
      />
    );
  }
}

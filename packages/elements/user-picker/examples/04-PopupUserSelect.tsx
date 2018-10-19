import * as React from 'react';
import styled from 'styled-components';
import { exampleUsers } from '../example-helpers';
import UserPicker, { User } from '../src';

type State = {
  value?: string;
  open?: boolean;
  user?: User;
};

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
`;

export default class Example extends React.PureComponent<{}, State> {
  private userPickerRef;

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value });
  };

  handleInputBlur = () => {
    this.setState({ open: false });
  };

  handleInputFocus = () => {
    this.setState({ open: true });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    this.setState({ open: true });
    if (this.userPickerRef) {
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          this.userPickerRef.selectOption();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.userPickerRef.previousOption();
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.userPickerRef.nextOption();
          break;
      }
    }
  };

  handleUserPickerRef = ref => {
    this.userPickerRef = ref;
  };

  handleSelectedOption = (user: User) => {
    this.setState({ user, open: false });
  };

  private loadUsers = () =>
    new Promise<User[]>(resolve => {
      setTimeout(() => resolve(exampleUsers), 2000);
    });

  private renderAnchor = () => <div>@{this.state.value}</div>;

  render() {
    const { user, value, open } = this.state;
    return (
      <Container>
        <input
          type="text"
          onChange={this.handleOnChange}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          onKeyDown={this.handleKeyDown}
        />
        <div>SelectedOption: {user && user.nickname}</div>
        <UserPicker
          ref={this.handleUserPickerRef}
          anchor={this.renderAnchor}
          search={value}
          open={open}
          onChange={this.handleSelectedOption}
          loadUsers={this.loadUsers}
        />
      </Container>
    );
  }
}

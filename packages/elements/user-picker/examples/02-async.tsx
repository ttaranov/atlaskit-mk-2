import * as React from 'react';
import { exampleUsers } from '../example-helpers';
import { User } from '../src';
import { UserPicker } from '../src/components/UserPicker';

export default class Example extends React.Component<{}> {
  private loadUsers = () =>
    new Promise<User[]>(resolve => {
      setTimeout(() => resolve(exampleUsers), 2000);
    });

  render() {
    return <UserPicker loadUsers={this.loadUsers} />;
  }
}

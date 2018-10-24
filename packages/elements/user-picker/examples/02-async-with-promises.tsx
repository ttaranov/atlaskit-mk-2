import * as React from 'react';
import { exampleUsers } from '../example-helpers';
import { User } from '../src';
import { UserPicker } from '../src/components/UserPicker';

function getUsers(search?: string): (User | Promise<User[]>)[] {
  return [
    { id: 'unassign', nickname: 'Unassigned' },
    { id: 'assign-me', nickname: 'Assign to me' },
    new Promise<User[]>(resolve => {
      setTimeout(() => resolve(exampleUsers), 1000);
    }),
  ];
}

export default class Example extends React.Component<{}> {
  render() {
    return <UserPicker loadUsers={getUsers} />;
  }
}

import * as React from 'react';
import { exampleUsers, unassigned, assignToMe } from '../example-helpers';
import { User } from '../src';
import { UserPicker } from '../src/components/UserPicker';

function getUsers(search?: string): (User | Promise<User[]>)[] {
  return [
    unassigned,
    assignToMe,
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

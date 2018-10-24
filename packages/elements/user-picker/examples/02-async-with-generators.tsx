import * as React from 'react';
import { exampleUsers } from '../example-helpers';
import { User } from '../src';
import { UserPicker } from '../src/components/UserPicker';

function* getUsers(search?: string): Iterable<PromiseLike<User[]> | User> {
  if (!search || search.length === 0) {
    yield { id: 'unassign', nickname: 'Unsassign' };
    yield { id: 'assing-me', nickname: 'Assign to me' };
  }
  yield new Promise(resolve => {
    setTimeout(() => resolve(exampleUsers), 1000);
  });
}

export default class Example extends React.Component<{}> {
  render() {
    return <UserPicker loadUsers={getUsers} />;
  }
}

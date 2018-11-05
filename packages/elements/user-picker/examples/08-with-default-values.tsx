import * as React from 'react';
import { exampleUsers } from '../example-helpers';
import { UserPicker } from '../src/components/UserPicker';

export default class Example extends React.Component<{}> {
  render() {
    return (
      <UserPicker
        isMulti
        users={exampleUsers}
        onChange={console.log}
        defaultValue={[exampleUsers[0], exampleUsers[1]]}
      />
    );
  }
}

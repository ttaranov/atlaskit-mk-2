import * as React from 'react';

interface Props {
  editable: boolean;
}

interface State {}

export class TabsApp extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return <>tabs</>;
  }
}

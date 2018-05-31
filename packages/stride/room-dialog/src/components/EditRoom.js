//@flow
import React, { Component, type Node } from 'react';
import Checkbox from '@atlaskit/checkbox';
import TextField from '@atlaskit/field-text';
import ModalDialog from '@atlaskit/modal-dialog';

type Props = {
  /** Actions to pass to the modal dialog */
  actions: Array<Object>,
  /** Body  */
  body?: Node,
  /** Body  */
  children: Node,
  /** Header  */
  header?: any,
  /** OnClose function */
  onClose: Function,
};

type State = {
  isOpen: boolean,
};

export default class EditRoom extends Component<Props, State> {
  props: Props;
  state: State = { isOpen: false };
  static defaultProps = {
    actions: [
      { text: 'Save', onClick: () => {} }, // It needs a logic for disabled, when the input is not typed
      { text: 'Cancel', onClick: () => {} },
    ],
    children: (
      <div>
        <TextField autoFocus label="Name" value="Atlaskit" />
        <TextField
          autoFocus
          label="Topic"
          value="Website:  go/ak | Issues? Atlaskit requests room to talk about the tickets you raised at http://go/ak-bug"
        />
        <Checkbox
          value=""
          label="Private: Keep it between you and the people added"
          onChange={() => {}} // TO be done later
          name="checkbox-basic"
        />
      </div>
    ),
  };
  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  render() {
    return (
      <ModalDialog
        actions={this.props.actions}
        header={this.props.header}
        onClose={this.props.onClose}
        body={this.props.body}
      >
        {this.props.children}
      </ModalDialog>
    );
  }
}

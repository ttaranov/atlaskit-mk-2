// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Modal, {
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import Checkbox, { CheckboxGroup } from '@atlaskit/checkbox';
import Form, { Field, FormSection } from '@atlaskit/form';

/* eslint-disable react/no-unused-prop-types*/
type Props = {
  onClose: Function,
  showKeyline: boolean,
};

const Header = ({ showKeyline }: Props) => (
  <ModalHeader showKeyline={showKeyline}>
    <ModalTitle>Give Feedback</ModalTitle>
  </ModalHeader>
);

type FooterState = { isOpen: boolean };
class Footer extends Component<Props, FooterState> {
  state = { isOpen: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { onClose, showKeyline } = this.props;

    return (
      <ModalFooter showKeyline={showKeyline}>
        <Button type="submit" appearance="primary">
          Create
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    );
  }
}

type State = { isOpen: boolean };
// eslint-disable-next-line react/no-multi-comp
export default class CreateIssueExample extends Component<void, State> {
  state = { isOpen: false };
  formRef: any;

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  // Form Event Handlers
  onSubmitHandler = () => {
    console.log('onSubmitHandler');
  };
  // Footer Button Handlers
  submitClickHandler = () => {
    return this.formRef.validate();
  };

  validateClickHandler = () => {
    this.formRef.validate();
  };

  render() {
    const { isOpen } = this.state;

    return (
      <div>
        <Button onClick={this.open}>Create Issue</Button>

        {isOpen && (
          <Form
            name="create-issue"
            onSubmit={this.onSubmitHandler}
            ref={form => {
              this.formRef = form;
            }}
          >
            <Modal
              footer={Footer}
              header={Header}
              onClose={this.close}
              onCloseComplete={node =>
                console.log('exit transition complete', node)
              }
              shouldCloseOnEscapePress={false}
              shouldCloseOnOverlayClick={false}
              width={800}
            >
              <FormSection name="text-fields">
                <Field label="Project" isRequired>
                  <Select
                    name="select"
                    options={[
                      { label: 'Question 1', value: 'Question 1 - value' },
                      { label: 'Question 2', value: 'Question 2 - value' },
                      { label: 'Question 3', value: 'Question 3 - value' },
                      { label: 'Question 4', value: 'Question 4 - value' },
                    ]}
                  />
                </Field>
                <Field label="Checkbox" helperText="hello">
                  <CheckboxGroup>
                    <Checkbox
                      label="contact"
                      name="checkbox"
                      value="checkbox"
                    />
                    <Checkbox
                      label="participate"
                      name="checkbox"
                      value="checkbox"
                    />
                  </CheckboxGroup>
                  <Field label="Email" value="email" />
                  <Field label="Name" value="name" />
                </Field>
              </FormSection>
            </Modal>
          </Form>
        )}
      </div>
    );
  }
}

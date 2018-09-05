// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Modal, {
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import FieldText from '@atlaskit/field-text';

import Form, { Field, FormSection } from '../src';

/* eslint-disable react/no-unused-prop-types*/
type Props = {
  onClose: Function,
  showKeyline: boolean,
};

const Header = ({ showKeyline }: Props) => (
  <ModalHeader showKeyline={showKeyline}>
    <ModalTitle>Create Issue</ModalTitle>
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

        <ModalTransition>
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
                        { label: 'Design System Support (AK)', value: 'AK' },
                        { label: 'Design Platform (DP)', value: 'DP' },
                        { label: 'ADG Feedback (ADGF)', value: 'ADGF' },
                      ]}
                    />
                  </Field>
                  <Field
                    label="Issue Type"
                    isRequired
                    helperText="Some issue types are unavailable due to incompatible field configuration and/or workflow associations."
                  >
                    <Select
                      name="select"
                      options={[
                        { label: 'Bug', value: 'bug' },
                        { label: 'Documenation', value: 'doc' },
                        { label: 'Epic', value: 'epic' },
                      ]}
                    />
                  </Field>
                  <Field label="Summary" isRequired>
                    <FieldText name="summary" value="" shouldFitContainer />
                  </Field>

                  <span>More fields...</span>
                </FormSection>
              </Modal>
            </Form>
          )}
        </ModalTransition>
      </div>
    );
  }
}

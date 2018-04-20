// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { colors } from '@atlaskit/theme';
import Modal, {
  ModalHeader,
  ModalFooter,
  ModalTitle,
} from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import FieldText from '@atlaskit/field-text';
import isEmail from 'validator/lib/isEmail';

import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
  Validator,
} from '../src';

const Hint = styled.span`
  align-items: center;
  color: ${colors.subtleText};
  cursor: help;
  display: flex;
`;
const HintText = styled.span`
  margin-left: 1em;
`;
const Body = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const Image = styled.img`
  max-width: 100%;
  margin-bottom: 1em;
  margin-top: 1em;
`;

type Props = {
  onClose: Function,
  showKeyline: boolean,
  formRef?: any,
};

const Header = ({ onClose, showKeyline }: Props) => (
  <ModalHeader showKeyline={showKeyline}>
    <ModalTitle>Create Issue</ModalTitle>
    <Button onClick={onClose} appearance="link" spacing="none">
      <CrossIcon label="Close Modal" primaryColor={colors.R400} size="small" />
    </Button>
  </ModalHeader>
);

type FooterState = { isOpen: boolean };
class Footer extends Component<Props, FooterState> {
  state = { isOpen: false };

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  render() {
    const { onClose, showKeyline } = this.props;
    const { isOpen } = this.state;

    return (
      <ModalFooter showKeyline={showKeyline}>
        <Button type="create" appearance="primary">
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
      </div>
    );
  }
}

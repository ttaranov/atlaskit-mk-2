// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import Form, { Field } from '@atlaskit/form';
import Checkbox, { CheckboxGroup } from '@atlaskit/checkbox';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
import type { FormFields } from '../types';

// import type { Element } from 'react';

type Props = {
  onClose: func,
  onSubmit: func,
};

const Footer = styled.span`
  display: flex;
  flex: auto;
  justify-content: flex-end;
`;

const options = {
  bug: 'Describe the bug or issue',
  comment: "Let us know what's on your mind",
  suggestion: "Let us know what you'd like to improve",
  question: 'What would you like to know?',
  empty: 'Select an option',
};

export default class FeedbackForm extends React.Component<Props, FormFields> {
  static defaultProps: $Shape<Props> = {
    onClose: () => {},
    onSubmit: () => {},
  };

  state = {
    type: 'empty',
    description: '',
    canBeContacted: false,
    enrollInResearchGroup: false,
  };

  isTypeSelected = () => this.state.type !== 'empty';

  renderActions = () => (
    <ModalFooter>
      <Footer>
        <Button
          appearance="primary"
          type="submit"
          isDisabled={!this.isTypeSelected() || !this.state.description}
          onClick={() => this.props.onSubmit(this.state)}
        >
          Submit
        </Button>
        <Button
          appearance="subtle"
          type="button"
          onClick={() => this.props.onClose()}
        >
          Cancel
        </Button>
      </Footer>
    </ModalFooter>
  );

  render() {
    return (
      <Modal
        heading="Share your thoughts"
        footer={this.renderActions}
        onClose={this.props.onClose}
      >
        <Form name="feedback-collector">
          <Select
            onChange={option => this.setState({ type: option.value })}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            defaultValue={{
              label: 'I want to...',
            }}
            options={[
              { label: 'Ask a question', value: 'question' },
              { label: 'Leave a comment', value: 'comment' },
              { label: 'Report a bug', value: 'bug' },
              { label: 'Suggest an improvement', value: 'suggestion' },
            ]}
          />

          {this.isTypeSelected() ? (
            <Fragment>
              <Field label={options[this.state.type]} isRequired>
                <FieldTextAreaStateless
                  name="repo_name"
                  isRequired
                  shouldFitContainer
                  minimumRows={6}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </Field>

              <Field>
                <CheckboxGroup>
                  <Checkbox
                    value="canBeContacted"
                    name="can-be-contacted"
                    label="Atlassian can contact me about this feedback"
                    onChange={checkbox =>
                      this.setState({ canBeContacted: checkbox.isChecked })
                    }
                  />

                  <Checkbox
                    value="enrollInResearchGroup"
                    name="enroll-in-research-group"
                    label="I'd like to participate in product research"
                    onChange={checkbox =>
                      this.setState({
                        enrollInResearchGroup: checkbox.isChecked,
                      })
                    }
                  />
                </CheckboxGroup>
              </Field>
            </Fragment>
          ) : (
            <Fragment />
          )}
        </Form>
      </Modal>
    );
  }
}

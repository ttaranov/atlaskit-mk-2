// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import Form, { Field } from '@atlaskit/form';
import Checkbox, { CheckboxGroup } from '@atlaskit/checkbox';
import Modal, { ModalFooter } from '@atlaskit/modal-dialog';
// import type { Element } from 'react';

type Props = {
  /** Description */
  // eslint-disable-next-line
  myProp: string,
};

type State = {
  type: 'bug' | 'comment' | 'suggestion' | 'question' | 'empty',
};

const Footer = styled.span`
  display: flex;
  flex: auto;
  justify-content: flex-end;
`;

const options = {
  bug: 'Describe the bug or issue',
  comment: "Let us know what's on your mind?",
  suggestion: "Let us know what you'd like to improve",
  question: 'What would you like to know?',
  empty: 'Select an option',
};

export default class FeedbackCollector extends React.Component<Props, State> {
  static defaultProps: $Shape<Props> = {
    myProp: '',
  };

  state = {
    type: 'empty',
  };

  isTypeSelected = () => this.state.type !== 'empty';

  renderActions = () => (
    <ModalFooter>
      <Footer>
        <Button
          appearance="primary"
          type="submit"
          isDisabled={!this.isTypeSelected()}
        >
          Submit
        </Button>
        <Button appearance="subtle" type="button">
          Cancel
        </Button>
      </Footer>
    </ModalFooter>
  );

  render() {
    return (
      <Modal heading="Share us your thoughts" footer={this.renderActions}>
        <Form name="feedback-collector">
          <Field>
            <Select
              isSearchable={false}
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
          </Field>

          {this.isTypeSelected() ? (
            <Fragment>
              <Field label={options[this.state.type]} isRequired>
                <FieldTextAreaStateless
                  name="repo_name"
                  isRequired
                  shouldFitContainer
                />
              </Field>

              <Field>
                <CheckboxGroup>
                  <Checkbox
                    value="Basic checkbox"
                    name="checkbox-basic"
                    label="Atlassian can contact me about this feedback"
                  />

                  <Checkbox
                    value="Basic checkbox"
                    name="checkbox-basic"
                    label="I'd like to participate in product research"
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

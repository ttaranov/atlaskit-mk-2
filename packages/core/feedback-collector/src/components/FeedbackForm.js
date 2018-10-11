// @flow

import React, { Fragment, Component } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Form, { Field } from '@atlaskit/form';
import Modal from '@atlaskit/modal-dialog';
import Select from '@atlaskit/select';
import type { FormFields, SelectValue } from '../types';

type Props = {|
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void,
  /** Function that will be called immediately after the submit action  */
  onSubmit: (formValues: FormFields) => void,
|};

export const fieldLabel = {
  bug: 'Describe the bug or issue',
  comment: "Let us know what's on your mind",
  suggestion: "Let us know what you'd like to improve",
  question: 'What would you like to know?',
  empty: 'Select an option',
};

const selectOptions = [
  { label: 'Ask a question', value: 'question' },
  { label: 'Leave a comment', value: 'comment' },
  { label: 'Report a bug', value: 'bug' },
  { label: 'Suggest an improvement', value: 'suggestion' },
];

const defaultSelectValue = {
  label: 'I want to...',
  value: 'empty',
};

export default class FeedbackForm extends Component<Props, FormFields> {
  state = {
    type: 'empty',
    description: '',
    canBeContacted: false,
    enrollInResearchGroup: false,
  };

  isTypeSelected = () => this.state.type !== 'empty';

  onSubmit = () => {
    const {
      type,
      description,
      canBeContacted,
      enrollInResearchGroup,
    } = this.state;

    this.props.onSubmit({
      type,
      description,
      canBeContacted,
      enrollInResearchGroup,
    });
  };

  getActions() {
    const isDisabled = !this.isTypeSelected() || !this.state.description;

    return [
      {
        text: 'Send feedback',
        appearance: 'primary',
        type: 'submit',
        isDisabled,
        onClick: this.onSubmit,
      },
      {
        text: 'Cancel',
        onClick: this.props.onClose,
        appearance: 'subtle',
      },
    ];
  }

  onSelectChange = (option: { label: string, value: SelectValue }) => {
    this.setState({ type: option.value });
  };

  render() {
    return (
      <Modal
        actions={this.getActions()}
        heading="Share your thoughts"
        onClose={this.props.onClose}
      >
        <Form name="feedback-collector">
          <Select
            onChange={this.onSelectChange}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            defaultValue={defaultSelectValue}
            options={selectOptions}
          />

          {this.isTypeSelected() ? (
            <Fragment>
              <Field label={fieldLabel[this.state.type]} isRequired>
                <FieldTextAreaStateless
                  name="description"
                  shouldFitContainer
                  minimumRows={6}
                  onChange={e => this.setState({ description: e.target.value })}
                  value={this.state.description}
                />
              </Field>

              <Field>
                <Checkbox
                  value={this.state.canBeContacted}
                  name="can-be-contacted"
                  label="Atlassian can contact me about this feedback"
                  onChange={event =>
                    this.setState({ canBeContacted: event.target.checked })
                  }
                />
              </Field>

              <Field>
                <Checkbox
                  value={this.state.enrollInResearchGroup}
                  name="enroll-in-research-group"
                  label="I'd like to participate in product research"
                  onChange={event =>
                    this.setState({
                      enrollInResearchGroup: event.target.checked,
                    })
                  }
                />
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

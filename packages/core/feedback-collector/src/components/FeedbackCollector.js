// @flow
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { FieldTextAreaStateless } from '@atlaskit/field-text-area';
import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import Form, { Field, FormHeader, FormSection } from '@atlaskit/form';
import Checkbox, { CheckboxGroup } from '@atlaskit/checkbox';
// import type { Element } from 'react';

type Props = {
  /** Description */
  // eslint-disable-next-line
  myProp: string,
};

type State = {
  type: 'bug' | 'compliment' | 'suggestion' | 'question' | 'empty',
};

const Footer = styled.span`
  display: flex;
  flex: auto;
  justify-content: flex-end;
`;

const options = {
  bug: 'Yikes! Describe your bug or issue',
  compliment: 'Aw thanks! What would you like to share?',
  suggestion: "That's great! What would you like to share with us?",
  question: 'What would you like to ask us?',
  empty: 'Select an option',
};

export default class FeedbackCollector extends React.Component<Props, State> {
  static defaultProps: $Shape<Props> = {
    myProp: '',
  };

  state = {
    type: 'empty',
  };

  render() {
    return (
      <Form name="feedback-collector">
        <FormHeader title="Tell us what you think" />
        <FormSection>
          <Field>
            <Select
              isSearchable={false}
              onChange={option => this.setState({ type: option.value })}
              defaultValue={{
                label: "Choose what you'd like to give feedback on",
              }}
              options={[
                { label: 'I have a bug to report', value: 'bug' },
                { label: 'I have a compliment', value: 'compliment' },
                { label: 'I have a suggestion', value: 'suggestion' },
                { label: 'I have a question', value: 'question' },
              ]}
            />
          </Field>
        </FormSection>
        {this.state.type !== 'empty' ? (
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
            <Footer>
              <Button appearance="primary" type="submit">
                Submit
              </Button>
              <Button appearance="subtle" type="button">
                Cancel
              </Button>
            </Footer>
          </Fragment>
        ) : (
          <Fragment />
        )}
      </Form>
    );
  }
}

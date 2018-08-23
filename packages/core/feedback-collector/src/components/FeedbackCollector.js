// @flow
import React from 'react';
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

const Footer = styled.span`
  display: flex;
  flex: auto;
  justify-content: flex-end;
`;

export default class FeedbackCollector extends React.Component<Props> {
  static defaultProps: $Shape<Props> = {
    myProp: '',
  };

  render() {
    return (
      <Form name="feedback-collector">
        <FormHeader title="Tell us what you think" />
        <FormSection>
          <Field>
            <Select
              isSearchable={false}
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

          <Field label="Repository name" isRequired>
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
        </FormSection>
      </Form>
    );
  }
}

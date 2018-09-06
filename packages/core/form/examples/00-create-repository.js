// @flow
import React, { PureComponent } from 'react';
import Select from '@atlaskit/select';
import FieldText from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';

import Form, { Field, FormHeader, FormSection, FormFooter } from '../src';

type State = {
  eventResult: string,
};

export default class LayoutExample extends PureComponent<void, State> {
  state = {
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  formRef: any;

  // Form Event Handlers
  onSubmitHandler = () => {
    console.log('onSubmitHandler');
  };

  onValidateHandler = () => {
    console.log('onValidateHandler');
  };

  onResetHandler = () => {
    console.log('onResetHandler');
  };

  onChangeHandler = () => {
    console.log('onChangeHandler');
  };
  onBlurHandler = () => {
    console.log('onBlurHandler');
  };
  onFocusHandler = () => {
    console.log('onFocusHandler');
  };

  // Footer Button Handlers
  submitClickHandler = () => {
    this.formRef.submit();
  };

  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '400px',
          margin: '0 auto',
          minHeight: '60vh',
          flexDirection: 'column',
        }}
      >
        <Form
          name="create-repo"
          onSubmit={this.onSubmitHandler}
          onReset={this.onResetHandler}
          ref={form => {
            this.formRef = form;
          }}
          action="//httpbin.org/get"
          method="GET"
          target="submitFrame"
        >
          <FormHeader title="Create a new repository" />

          <FormSection>
            <Field label="Owner">
              <Select
                isSearchable={false}
                defaultValue={{ label: 'Atlassian', value: 'atlassian' }}
                options={[
                  { label: 'Atlassian', value: 'atlassian' },
                  { label: 'Sean Curtis', value: 'scurtis' },
                  { label: 'Mike Gardiner', value: 'mg' },
                  { label: 'Charles Lee', value: 'clee' },
                ]}
                name="owner"
              />
            </Field>

            <Field label="Project" isRequired>
              <Select
                options={[
                  { label: 'Atlaskit', value: 'brisbane' },
                  { label: 'Bitbucket', value: 'bb' },
                  { label: 'Confluence', value: 'conf' },
                  { label: 'Jira', value: 'jra' },
                  { label: 'Stride', value: 'stride' },
                ]}
                placeholder="Choose a project&hellip;"
                isRequired
                name="project"
              />
            </Field>

            <Field label="Repository name" isRequired>
              <FieldText name="repo_name" isRequired shouldFitContainer />
            </Field>

            <Field label="Access level">
              <Checkbox
                label="This is a private repository"
                name="access-level"
                value="private"
              />
            </Field>

            <Field label="Include a README?">
              <Select
                isSearchable={false}
                defaultValue={{ label: 'No', value: 'no' }}
                options={[
                  { label: 'No', value: 'no' },
                  { label: 'Yes, with a template', value: 'yes-with-template' },
                  {
                    label: 'Yes, with a tutorial (for beginners)',
                    value: 'yes-with-tutorial',
                  },
                ]}
                name="include_readme"
              />
            </Field>
          </FormSection>

          <FormFooter
            actionsContent={[
              {
                id: 'submit-button',
              },
              {},
            ]}
          >
            <Button appearance="primary" type="submit">
              Create repository
            </Button>
            <Button appearance="subtle">Cancel</Button>
          </FormFooter>
        </Form>
      </div>
    );
  }
}

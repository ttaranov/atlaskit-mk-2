import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/field-text';

const FormRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  & > div:first-child {
    margin-right: 20px;
  }
`;

export interface State {
  name: string;
  comment: string;
}

export interface Props {
  onCancel: Function;
  onSubmit: Function;
}

export default class AttendForm extends Component<Props, State> {
  state = {
    name: '',
    comment: '',
  };

  render() {
    const { name, comment } = this.state;
    return (
      <form>
        <FormRow>
          <TextField
            label="Name"
            shouldFitContainer={true}
            value={name}
            onChange={this.handleTextInput('name')}
            required
          />
          <TextField
            label="Comment"
            shouldFitContainer={true}
            onChange={this.handleTextInput('comment')}
            value={comment}
          />
        </FormRow>
        <ButtonGroup>
          <Button
            appearance="primary"
            onClick={this.handleSubmit}
            isDisabled={name.length === 0}
          >
            Save
          </Button>
          <Button onClick={this.handleCancel}>Cancel</Button>
        </ButtonGroup>
      </form>
    );
  }

  handleTextInput = name => e => {
    this.setState({ [name]: e.target.value.trim() });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.state);
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };
}

// @flow
import React, { Component, type Node } from 'react';
import FormSectionWrapper, {
  FormSectionTitle,
  FormSectionDescription,
  FormSectionContent,
} from './styled/FormSection';
import { type FormRef } from './Form';

type Props = {
  /** Section Title */
  title?: string,
  /** Content or child components to be rendered after description */
  children?: Node,
  /** Sub title or description of this section */
  description?: string,
  /** Parent Form Reference & API this will be injected by the parent Form */
  form?: FormRef,
  /** Unique name that identifies sections and fields */
  name?: string,
};

type State = {
  /** Unique name that identifies sections and fields */
  name?: string,
};
type FormSectionRef = {
  /** Unique name that identifies sections and fields */
  name?: string,
  /** Manual validation handler. NOT IMPLEMENTED */
  validate?: () => any,
};

export default class FormSection extends Component<Props, State> {
  static defaultProps = {
    name: '',
  };

  state = {
    name: this.props.name,
  };

  validate = () => {
    return true;
  };

  getSection = (): FormSectionRef => {
    return {
      name: this.state.name,
      validate: this.validate,
    };
  };

  /** Inject Form & Section state */
  renderContentChildren = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        form: this.props.form,
      });
    });
  };

  render() {
    const { title, description } = this.props;

    return (
      <FormSectionWrapper>
        {title && <FormSectionTitle>{title}</FormSectionTitle>}
        {description && (
          <FormSectionDescription>{description}</FormSectionDescription>
        )}
        <FormSectionContent>{this.renderContentChildren()}</FormSectionContent>
      </FormSectionWrapper>
    );
  }
}

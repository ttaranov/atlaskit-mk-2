// @flow
import React, { Component, type Node } from 'react';
import FormHeaderWrapper, {
  FormHeaderTitle,
  FormHeaderDescription,
  FormHeaderContent,
} from './styled/FormHeader';

type Props = {
  /** Header Title */
  title?: string,
  /** Header sub title or description */
  description?: string,
  /** Child contents will be rendered below the description */
  children?: Node,
  /** Enables the Header to be sticky */
  fixed?: boolean,
};

export default class FormHeader extends Component<Props, void> {
  static defaultProps = {
    title: '',
    description: '',
    fixed: false,
  };

  render() {
    return (
      <FormHeaderWrapper fixed={this.props.fixed}>
        <FormHeaderTitle>{this.props.title}</FormHeaderTitle>
        <FormHeaderDescription>{this.props.description}</FormHeaderDescription>
        <FormHeaderContent>{this.props.children}</FormHeaderContent>
      </FormHeaderWrapper>
    );
  }
}

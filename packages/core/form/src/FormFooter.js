// @flow
import React, { Component, type Node } from 'react';
import { FormFooterWrapper } from './styled/FormFooter';
import type { FormRef } from './Form';

type Props = {
  /** Child Compo */
  children?: Node,
  /** Reference to a parent form and if wrapped in a Form this will be injected */
  form?: FormRef,
};

export default class FormFooter extends Component<Props, void> {
  static defaultProps = {};

  /** For we just render all children. TODO: implement actions provider which can generate
   * Primary / Secondary buttons and actionsContent if custom content is needed
   */
  renderChildren = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        form: this.props.form,
      });
    });
  };

  render() {
    return <FormFooterWrapper>{this.props.children}</FormFooterWrapper>;
  }
}

// @flow
import React, { Component, type Node } from 'react';
import FieldGroupWrapper from './styled/FieldGroup';
import type { FormRef } from './Form';

export type FieldGroupProps = {
  /** The layout of the group. Currently only 'column' vertical layout is provided */
  layout?: 'column',
  /** One or more Fields */
  children: Node,
  /** Label of the group which will be rendered as a fieldset legend */
  label?: string,
  name?: string,
  form?: FormRef,
};

type State = {
  layout?: 'column',
};

export default class FieldGroup extends Component<FieldGroupProps, State> {
  static defaultProps = {
    layout: 'column',
  };

  state = {
    layout: this.props.layout,
  };

  /** Inject the form object into children */
  renderChildren = () => {
    return React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        form: this.props.form,
      });
    });
  };

  render() {
    const { label, layout, name } = this.props;

    return (
      <FieldGroupWrapper label={label} layout={layout} name={name}>
        {this.renderChildren()}
      </FieldGroupWrapper>
    );
  }
}

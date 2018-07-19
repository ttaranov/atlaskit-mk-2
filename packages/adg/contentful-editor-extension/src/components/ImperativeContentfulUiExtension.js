import React, { Component } from 'react';
import Test from '../../DESIGN_EXAMPLES';

export default class ImperativeContentfulUIExtension extends Component {
  constructor() {
    super();
    this.initExtension = this.initExtension.bind(this);
    this.updateContentfulFieldValue = this.updateContentfulFieldValue.bind(
      this,
    );
  }

  componentDidMount() {
    window.contentfulExtension.init(this.initExtension);
  }

  initExtension = extensionsApi => {
    extensionsApi.window.startAutoResizer();
    this.contentfulField = extensionsApi.field;
    // load initial value of the field
    this.props.actions.replaceDocument(this.contentfulField.getValue());
  };

  // TODO: This will come from editor
  updateContentfulFieldValue(value) {
    if (this.contentfulField) {
      this.contentfulField.setValue(value);
    } else {
      console.log('contentful field not found');
    }
  }

  componentWillUnmount() {
    this.cancelOnChangethisContentfulField();
  }

  render() {
    const { children } = this.props;
    const { updateContentfulFieldValue } = this;
    return children({ updateContentfulFieldValue });
  }
}

import * as React from 'react';
import { Component } from 'react';

export interface Props {
  reference: string;
}

export default class ConfluenceInlineComment extends Component<Props, {}> {
  render() {
    const { reference, children } = this.props;
    // confluence expects .inline-comment-marker
    return (
      <span
        className="inline-comment-marker"
        data-mark-type="confluenceInlineComment"
        data-ref={reference}
      >
        {children}
      </span>
    );
  }
}

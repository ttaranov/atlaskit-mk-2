import * as React from 'react';
import { PureComponent } from 'react';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { float, clear, textAlign } from '../../plugins/media/single-image';

export interface MediaGroupNodeProps {
  view: EditorView;
  node: PMNode;
}

// tslint:disable-next-line:variable-name
const Wrapper = styled.div`
  padding-bottom: 8px;
  display: block;
  float: ${props => float(props['data-alignment'], props['data-display'])};
  clear: ${props => clear(props['data-alignment'], props['data-display'])};
  text-align: ${props => textAlign(props['data-alignment'], props['data-display'])};

  & > * {
    padding: 5px 10px 0 0;
  }
`;

export default class SingleImageNode extends PureComponent<MediaGroupNodeProps, {}> {

  constructor(props) {
    super(props);
  }

  render() {
    const { node } = this.props;
    return (
      <Wrapper data-alignment={node.attrs.alignment} data-display={node.attrs.display}>
        {this.props.children}
      </Wrapper>
    );
  }
}

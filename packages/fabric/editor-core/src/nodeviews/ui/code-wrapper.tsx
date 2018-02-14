import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  akBorderRadius,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';
import ContentNodeView from '../contentNodeView';

// tslint:disable-next-line:variable-name
const Wrapper = styled.div`
  border-radius: ${akBorderRadius};
  margin: ${akGridSizeUnitless / 2}px 0;
  padding: ${akGridSizeUnitless}px;
  display: flex;
  background-color: #f4f5f7;
  overflow: hidden;
  &::after {
    content: '1\n2\n3\n4\n5\n6';
    position: absolute;
    left: 0;
  }
`;

// tslint:disable-next-line:variable-name
const ContentWrapper = styled.div`
  width: 95%;
  display: inline-block;
`;

// tslint:disable-next-line:variable-name
const LineNumber = styled.div`
  width: 20px;
  height: 0;
  color: #c3c3c3;
  &::after {
    content: '1 \ 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20';
  }
`;

type getPosHandler = () => number;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class CodeWrapper extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private node: PMNode;

  constructor(node: PMNode, view: EditorView, getPos: getPosHandler) {
    super(node, view);
    this.node = node;
    this.renderReactComponent();
  }

  private renderReactComponent() {
    this.domRef = document.createElement('div');
    this.domRef.setAttribute('data-code-wrapper', 'true');

    // tslint:disable-next-line:variable-name

    ReactDOM.render(
      <Wrapper>
        <div
          style={{
            margin: '12px 0',
            backgroundColor: '#f4f5f7',
            overflow: 'hidden',
          }}
        >
          <LineNumber />
        </div>
        <ContentWrapper innerRef={this.handleRef} />
      </Wrapper>,
      this.domRef,
    );
  }

  get dom() {
    return this.domRef;
  }

  update(node) {
    if (
      node.attrs.panelType !== this.node.attrs.panelType ||
      node.type !== this.node.type
    ) {
      return false;
    }
    return true;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    super.destroy();
  }
}

export const codeWrapperNodeView = (
  node: any,
  view: any,
  getPos: () => number,
): NodeView => {
  return new CodeWrapper(node, view, getPos);
};

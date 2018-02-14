import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  akBorderRadius,
  akGridSizeUnitless,
  akColorG50,
  akColorP50,
  akColorB50,
  akColorY50,
  akColorR50,
  akColorG400,
  akColorP400,
  akColorB400,
  akColorY400,
  akColorR400,
} from '@atlaskit/util-shared-styles';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import ContentNodeView from '../contentNodeView';

const panelColor = {
  info: akColorB50,
  note: akColorP50,
  success: akColorG50,
  warning: akColorY50,
  error: akColorR50,
};

const iconColor = {
  info: akColorB400,
  note: akColorP400,
  success: akColorG400,
  warning: akColorY400,
  error: akColorR400,
};

const panelIcons = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  warning: WarningIcon,
  error: ErrorIcon,
};

// tslint:disable-next-line:variable-name
const Wrapper = styled.div`
  border-radius: ${akBorderRadius};
  margin: ${akGridSizeUnitless / 2}px 0;
  padding: ${akGridSizeUnitless}px;
  display: flex;
  background-color: #f1f1f1;
  overflow: hidden;
  &::after {
    content: '1\n2\n3\n4\n5\n6';
    position: absolute;
    left: 0;
  }
`;

// tslint:disable-next-line:variable-name
const ContentWrapper = styled.div`
  margin: 1px 0 1px ${akGridSizeUnitless * 4}px;
  display: inline-block;
`;

// tslint:disable-next-line:variable-name
const LineNumber = styled.div`
  width: 20px;
  height: 0;
  margin: 12px 0;
  &::after {
    content: '1 \ 2 3 4 5 6 7 8 9 10 11 12';
  }
`;

// tslint:disable-next-line:variable-name
const IconWrapper = styled.span`
  height: 24px;
  width: 24px;
  position: absolute;
`;

type getPosHandler = () => number;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class CodeWrapper extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private panelType: string;
  private node: PMNode;

  constructor(node: PMNode, view: EditorView, getPos: getPosHandler) {
    super(node, view);
    this.node = node;
    this.panelType = node.attrs.panelType;
    this.renderReactComponent();
  }

  private renderReactComponent() {
    this.domRef = document.createElement('div');
    this.domRef.setAttribute('data-code-wrapper', 'true');

    // tslint:disable-next-line:variable-name

    ReactDOM.render(
      <Wrapper>
        <LineNumber />
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

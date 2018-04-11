import * as React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { createParagraphAtEnd } from '../../../commands';

const ClickWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  flex-grow: 1;
  height: 100%;
`;
ClickWrapper.displayName = 'ClickWrapper';

export interface Props {
  editorView?: EditorView;
  children?: any;
}

export default class ClickAreaBlock extends React.Component<Props> {
  private handleClick = event => {
    const { editorView } = this.props;
    const contentArea = event.currentTarget.getElementsByClassName(
      'content-area',
    )[0];
    // @see https://product-fabric.atlassian.net/browse/ED-4287
    // click event gets triggered twice on a checkbox (on <label> first and then on <input>)
    // by the time it gets triggered on input, PM already re-renders nodeView and detaches it from DOM
    // which doesn't pass the check !contentArea.contains(event.target)
    const isInputClicked = event.target.nodeName === 'INPUT';

    if (
      (!contentArea || !contentArea.contains(event.target)) &&
      !isInputClicked &&
      editorView
    ) {
      if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
        editorView.focus();
        event.stopPropagation();
      }
    }
  };

  render() {
    return (
      <ClickWrapper onClick={this.handleClick}>
        {this.props.children}
      </ClickWrapper>
    );
  }
}

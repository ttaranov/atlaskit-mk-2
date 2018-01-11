import * as React from 'react';
import Editor from '../../../editor';

import { akEditorSubtleAccent } from '../../../styles';
import { akBorderRadius, akColorN50 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

export const Input = styled.input`
  // Normal .className gets overridden by input[type=text] hence this hack to produce input.className
  input& {
    background-color: white;
    border: 1px solid ${akEditorSubtleAccent};
    border-radius: ${akBorderRadius};
    box-sizing: border-box;
    height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    width: 100%;

    &:hover {
      border-color: ${akColorN50};
      cursor: pointer;
    }
  }
`;

export interface Props {
  placeholder?: string;
  children?: any;
  isExpanded?: boolean;

  onFocus?: (e) => void;
  onExpand?: () => void;
}

export default class CollapsedEditor extends React.PureComponent<Props, {}> {
  editorComponent?: Editor;
  shouldTriggerExpandEvent?: boolean;

  componentWillReceiveProps(nextProps, nextState) {
    if (!this.props.isExpanded && nextProps.isExpanded) {
      this.shouldTriggerExpandEvent = true;
    }
  }

  componentDidUpdate() {
    if (this.shouldTriggerExpandEvent && this.editorComponent) {
      this.shouldTriggerExpandEvent = false;
      if (this.props.onExpand) {
        this.props.onExpand();
      }
    }
  }

  private handleEditorRef = (editorRef?: Editor, editorRefCallback?: any) => {
    if (editorRefCallback && typeof editorRefCallback === 'function') {
      editorRefCallback(editorRef);
    }
    this.editorComponent = editorRef;
  };

  private input?: HTMLElement;

  private focusHandler = e => {
    /**
     * We need this magic for FireFox.
     * The reason we need it is, when, in FireFox, we have focus inside input,
     * and then we remove that input and move focus to another place programmatically,
     * for whatever reason UP/DOWN arrows don't work until you blur and focus editor manually.
     */
    if (this.input) {
      this.input.blur();
    }

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  };

  private handleInputRef = ref => {
    this.input = ref;
  };

  render() {
    const child = React.Children.only(this.props.children);
    if (child.type !== Editor) {
      throw new Error('Expected child to be of type `Editor`');
    }

    if (!this.props.isExpanded) {
      const placeholder = this.props.placeholder || 'Type something…';
      return (
        <Input
          innerRef={this.handleInputRef}
          onFocus={this.focusHandler}
          placeholder={placeholder}
        />
      );
    }

    return React.cloneElement(child, {
      ref: editorComponent =>
        this.handleEditorRef(editorComponent, (child as any).ref),
    });
  }
}

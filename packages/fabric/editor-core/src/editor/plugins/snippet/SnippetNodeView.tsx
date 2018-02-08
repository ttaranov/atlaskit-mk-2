import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import styled from 'styled-components';
import { Snippet } from './ui/data';
import { Small } from './ui/SnippetIcon';
import { akColorN30A, akColorB400 } from '@atlaskit/util-shared-styles';

export type getPosHandler = () => number;

export default class SnippetNodeView implements NodeView {
  private nodeTypeName: string;
  private domRef: HTMLElement | undefined;
  private view: EditorView;
  private getPos: getPosHandler;
  private getSnippet: (id: string) => Promise<Snippet | null>;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    getSnippet: (id: string) => Promise<Snippet | null>,
  ) {
    this.nodeTypeName = node.type.name;
    this.view = view;
    this.getPos = getPos;
    this.getSnippet = getSnippet;

    this.domRef = document.createElement('span');

    this.renderReactComponent(node);
  }

  get dom() {
    return this.domRef;
  }

  update(node: PMNode) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate = this.nodeTypeName === node.type.name;

    if (isValidUpdate) {
      this.renderReactComponent(node);
    }

    return isValidUpdate;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
  }

  private renderReactComponent(node: PMNode) {
    const { getPos, view, getSnippet } = this;

    if (this.domRef) {
      Object.keys(node.attrs || {}).forEach(attr => {
        this.domRef!.setAttribute(`pm-attr-${attr}`, node.attrs[attr]);
      });
      this.domRef.setAttribute('spellcheck', 'false');
    }

    ReactDOM.render(
      <SnippetInline
        node={node}
        getPos={getPos}
        view={view}
        getSnippet={getSnippet}
      />,
      this.domRef!,
    );
  }
}

interface Props {
  node: PMNode;
  getPos: getPosHandler;
  view: EditorView;
  getSnippet: (id: string) => Promise<Snippet | null>;
}
interface State {
  snippet?: Snippet | null; // null is when no snippet exists for that id
}

const Wrapper = styled.div`
  display: inline-flex;
  background: ${akColorN30A};
  border: 1px solid transparent;
  border-radius: 20px;
  color: ${akColorB400};
  cursor: pointer;
  padding: 0px 4px 0px 3px;
  white-space: nowrap;
  font-size: 14px;
  line-height: 16px;
  vertical-align: middle;

  svg {
    align-self: center;
    margin-right: 4px;
    margin-left: 1px;
    font-size: 12px;
  }
`;

class SnippetInline extends React.Component<Props, State> {
  state = { snippet: undefined } as State;

  componentDidMount() {
    this.props
      .getSnippet(this.props.node.attrs.id)
      .then(snippet => this.setState({ snippet }))
      .catch(() => this.setState({ snippet: null }));
  }

  render() {
    const snippet = this.state.snippet;
    if (snippet === undefined) {
      return (
        <Wrapper>
          <Small />
          Loading...
        </Wrapper>
      );
    }
    if (snippet === null) {
      return (
        <Wrapper>
          <Small />
          Error
        </Wrapper>
      );
    }
    return (
      <Wrapper>
        <Small />
        {typeof snippet.value === 'number'
          ? snippet.value.toLocaleString()
          : snippet.value}
      </Wrapper>
    );
  }
}

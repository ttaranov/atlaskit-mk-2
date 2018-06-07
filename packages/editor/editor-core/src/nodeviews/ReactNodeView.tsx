import * as React from 'react';
import { NodeView, EditorView, Decoration } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { PortalProviderAPI } from '../ui/PortalProvider';

export type getPosHandler = () => number;
export type ReactComponentProps = { [key: string]: any };

export default class ReactNodeView implements NodeView {
  private domRef?: HTMLElement;
  private contentDOMWrapper: Node | null;
  private reactComponent?: React.ComponentType<any>;
  private portalProviderAPI: PortalProviderAPI;

  reactComponentProps: ReactComponentProps = {};

  view: EditorView;
  getPos: getPosHandler;
  contentDOM: Node | undefined;
  node: PMNode;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    props: ReactComponentProps = {},
    reactComponent?: React.ComponentType<any>,
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.portalProviderAPI = portalProviderAPI;
    this.reactComponentProps = props;
    this.reactComponent = reactComponent;

    this.domRef = this.getDomRef();
    this.setDomAttrs(node);

    const { dom: contentDOMWrapper, contentDOM } = this.getContentDOM() || {
      dom: undefined,
      contentDOM: undefined,
    };

    if (this.domRef && contentDOMWrapper) {
      this.domRef.appendChild(contentDOMWrapper);
      this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper;
      this.contentDOMWrapper = contentDOMWrapper || contentDOM;
    }

    // @see ED-3790
    // something gets messed up during mutation processing inside of a nodeView if DOM structure has nested plain "div"s,
    // it doesn't see the difference between them and it kills the nodeView
    this.domRef.className = `${node.type.name}View-content-wrap`;

    this.renderReactComponent(
      this.render(this.reactComponentProps, this.handleRef),
    );
  }

  private renderReactComponent(component: React.ReactElement<any> | null) {
    if (!this.domRef || !component) {
      return;
    }

    this.portalProviderAPI.render(component, this.domRef!);
  }

  getDomRef(): HTMLElement {
    return this.node.isInline
      ? document.createElement('span')
      : document.createElement('div');
  }

  getContentDOM():
    | { dom: Node; contentDOM?: Node | null | undefined }
    | undefined {
    return undefined;
  }

  handleRef = (node: HTMLElement | undefined) => this._handleRef(node);

  private _handleRef(node: HTMLElement | undefined) {
    const contentDOM = this.contentDOMWrapper || this.contentDOM;
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM);
    }
  }

  render(props, forwardRef): React.ReactElement<any> | null {
    return this.reactComponent ? (
      <this.reactComponent
        view={this.view}
        node={this.node}
        forwardRef={forwardRef}
        {...props}
      />
    ) : null;
  }

  update(
    node: PMNode,
    decorations: Array<Decoration>,
    predicate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
  ) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate =
      this.node.type === node.type && predicate(this.node, node);

    if (!isValidUpdate) {
      return false;
    }

    this.node = node;

    if (this.domRef) {
      this.setDomAttrs(node);
    }

    this.renderReactComponent(
      this.render(this.reactComponentProps, this.handleRef),
    );

    return true;
  }

  private setDomAttrs(node: PMNode) {
    Object.keys(node.attrs || {}).forEach(attr => {
      if (this.domRef) {
        this.domRef.setAttribute(attr, node.attrs[attr]);
      }
    });
  }

  get dom() {
    return this.domRef;
  }

  destroy() {
    if (!this.domRef) {
      return;
    }

    this.portalProviderAPI.remove(this.domRef);
    this.domRef = undefined;
    this.contentDOM = undefined;
  }

  static fromComponent(
    component: React.ComponentType<any>,
    portalProviderAPI: PortalProviderAPI,
    props?: ReactComponentProps,
  ) {
    return (node: PMNode, view: EditorView, getPos: getPosHandler) =>
      new ReactNodeView(
        node,
        view,
        getPos,
        portalProviderAPI,
        props,
        component,
      );
  }
}

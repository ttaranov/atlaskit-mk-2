import * as React from 'react';
import { ComponentClass } from 'react';

import {
  Fragment,
  Mark,
  Node,
  Schema,
} from 'prosemirror-model';

import {
  getMarksByOrder,
  isSameMark,
  Serializer,
} from '../';

import {
  Doc,
  mergeTextNodes,
  isTextWrapper,
  TextWrapper,
  toReact,
} from './nodes';

import {
  toReact as markToReact
} from './marks';

import { ProviderFactory } from '@atlaskit/editor-common';
import { EventHandlers } from '@atlaskit/editor-common';

export interface RendererContext {
  objectAri: string;
  containerAri: string;
}
export default class ReactSerializer implements Serializer<JSX.Element> {
  private providers?: ProviderFactory;
  private eventHandlers?: EventHandlers;
  private portal?: HTMLElement;
  private rendererContext?: RendererContext;

  constructor(providers?: ProviderFactory, eventHandlers?: EventHandlers, portal?: HTMLElement, objectContext?: RendererContext) {
    this.providers = providers;
    this.eventHandlers = eventHandlers;
    this.portal = portal;
    this.rendererContext = objectContext;
  }

  serializeFragment(fragment: Fragment, props: any = {}, target: any = Doc, key: string = 'root-0'): JSX.Element | null {
    const content = ReactSerializer.getChildNodes(fragment).map((node, index) => {
      if (isTextWrapper(node.type.name)) {
        return this.serializeTextWrapper((node as TextWrapper).content);
      }

      return this.serializeFragment((node as Node).content, this.getProps(node as Node), toReact(node as Node), `${node.type.name}-${index}`);
    });

    return this.renderNode(target, props, key, content);
  }

  private serializeTextWrapper(content: Node[]) {
    return ReactSerializer
      .buildMarkStructure(content)
      .map((mark, index) => this.serializeMark(mark, index));
  }

  private serializeMark(mark: Mark, index: number = 0) {
    if (mark.type.name === 'text') {
      return (mark as any).text;
    }

    const content = ((mark as any).content || []).map((child, index) => this.serializeMark(child, index));
    return this.renderMark(markToReact(mark), this.getMarkProps(mark), `${mark.type.name}-${index}`, content);
  }

  // tslint:disable-next-line:variable-name
  private renderNode(Node: ComponentClass<any>, props: any, key: string, content: (string | JSX.Element | any[] | null | undefined)): JSX.Element {
    return (
      <Node key={key} {...props}>
        {content}
      </Node>
    );
  }

  // tslint:disable-next-line:variable-name
  private renderMark(Mark: ComponentClass<any>, props: any, key: string, content: any) {
    return (
      <Mark key={key} {...props}>
        {content}
      </Mark>
    );
  }

  private getProps(node: Node) {
    return {
      text: node.text,
      providers: this.providers,
      eventHandlers: this.eventHandlers,
      portal: this.portal,
      rendererContext: this.rendererContext,
      ...node.attrs,
    };
  }

  private getMarkProps(mark: Mark): any {
    return mark.attrs;
  }

  static getChildNodes(fragment: Fragment): (Node | TextWrapper)[] {
    const children: Node[] = [];
    fragment.forEach(node => {
      children.push(node);
    });
    return mergeTextNodes(children) as Node[];
  }

  static getMarks(node: Node): Mark[] {
    if (!node.marks || node.marks.length === 0) {
      return [];
    }

    return getMarksByOrder(node.marks);
  }

  static buildMarkStructure(content: Node[]) {
    let currentMarkNode: any;
    return content.reduce((acc, node, index) => {

      const nodeMarks = this.getMarks(node);

      if (nodeMarks.length === 0) {
        currentMarkNode = node;
        acc.push(currentMarkNode);
      } else {
        nodeMarks.forEach((mark, markIndex) => {
          const isSameAsPrevious = isSameMark(mark, currentMarkNode as Mark);
          const previousIsInMarks = markIndex > 0 && nodeMarks.some(m => isSameMark(m, currentMarkNode));

          if (!isSameAsPrevious) {
            let newMarkNode: any = {
              ...mark,
              content: [],
            };

            if (previousIsInMarks) {
              currentMarkNode.content!.push(newMarkNode);
              currentMarkNode = newMarkNode;
            } else {
              acc.push(newMarkNode);
              currentMarkNode = newMarkNode;
            }
          }
        });

        currentMarkNode.content!.push(node);
      }

      return acc;
    }, [] as Mark[]);
  }

  static fromSchema(schema: Schema, providers?: ProviderFactory, eventHandlers?: EventHandlers): ReactSerializer {
    // TODO: Do we actually need the schema here?
    return new ReactSerializer(providers, eventHandlers);
  }
}

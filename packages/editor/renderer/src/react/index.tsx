import * as React from 'react';
// @ts-ignore: unused variable
// prettier-ignore
import { ComponentClass, Consumer, Provider } from 'react';
import { Fragment, Mark, Node, Schema } from 'prosemirror-model';

import { Serializer } from '../';
import { getText } from '../utils';
import { RendererAppearance } from '../ui/Renderer';

import {
  Doc,
  mergeTextNodes,
  isTextWrapper,
  TextWrapper,
  isEmojiDoc,
  toReact,
} from './nodes';

import { toReact as markToReact } from './marks';

import {
  ProviderFactory,
  getMarksByOrder,
  isSameMark,
  EventHandlers,
  ExtensionHandlers,
  calcTableColumnWidths,
} from '@atlaskit/editor-common';
import { bigEmojiHeight } from '../utils';

export interface RendererContext {
  objectAri?: string;
  containerAri?: string;
  adDoc?: any;
  schema?: Schema;
}

export interface ConstructorParams {
  providers?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  portal?: HTMLElement;
  objectContext?: RendererContext;
  appearance?: RendererAppearance;
  disableHeadingIDs?: boolean;
  allowDynamicTextSizing?: boolean;
}

export default class ReactSerializer implements Serializer<JSX.Element> {
  private providers?: ProviderFactory;
  private eventHandlers?: EventHandlers;
  private extensionHandlers?: ExtensionHandlers;
  private portal?: HTMLElement;
  private rendererContext?: RendererContext;
  private appearance?: RendererAppearance;
  private disableHeadingIDs?: boolean;
  private headingIds: string[] = [];
  private allowDynamicTextSizing?: boolean;

  constructor({
    providers,
    eventHandlers,
    extensionHandlers,
    portal,
    objectContext,
    appearance,
    disableHeadingIDs,
    allowDynamicTextSizing,
  }: ConstructorParams) {
    this.providers = providers;
    this.eventHandlers = eventHandlers;
    this.extensionHandlers = extensionHandlers;
    this.portal = portal;
    this.rendererContext = objectContext;
    this.appearance = appearance;
    this.disableHeadingIDs = disableHeadingIDs;
    this.allowDynamicTextSizing = allowDynamicTextSizing;
  }

  private resetState() {
    this.headingIds = [];
  }

  serializeFragment(
    fragment: Fragment,
    props: any = {},
    target: any = Doc,
    key: string = 'root-0',
    parentInfo?: { parentIsIncompleteTask: boolean },
  ): JSX.Element | null {
    // This makes sure that we reset internal state on re-render.
    if (key === 'root-0') {
      this.resetState();
    }

    const emojiBlock = isEmojiDoc(fragment, props);
    const content = ReactSerializer.getChildNodes(fragment).map(
      (node, index) => {
        if (isTextWrapper(node)) {
          return this.serializeTextWrapper(node.content);
        }

        let props;

        if (emojiBlock && this.appearance === 'message') {
          props = this.getEmojiBlockProps(node);
        } else if (node.type.name === 'table') {
          props = this.getTableProps(node);
        } else if (node.type.name === 'date') {
          props = this.getDateProps(node, parentInfo);
        } else if (node.type.name === 'heading') {
          props = this.getHeadingProps(node);
        } else {
          props = this.getProps(node);
        }

        let pInfo = parentInfo;
        if (node.type.name === 'taskItem' && node.attrs.state !== 'DONE') {
          pInfo = { parentIsIncompleteTask: true };
        }

        const serializedContent = this.serializeFragment(
          node.content,
          props,
          toReact(node),
          `${node.type.name}-${index}`,
          pInfo,
        );

        if (node.marks && node.marks.length) {
          return ([] as Array<Mark>)
            .concat(node.marks)
            .reverse()
            .reduce((acc, mark) => {
              return this.renderMark(
                markToReact(mark),
                this.getMarkProps(mark),
                `${mark.type.name}-${index}`,
                acc,
              );
            }, serializedContent);
        }

        return serializedContent;
      },
    );

    return this.renderNode(target, props, key, content);
  }

  private serializeTextWrapper(content: Node[]) {
    return ReactSerializer.buildMarkStructure(content).map((mark, index) =>
      this.serializeMark(mark, index),
    );
  }

  private serializeMark(mark: Mark, index: number = 0) {
    if (mark.type.name === 'text') {
      return (mark as any).text;
    }

    const content = ((mark as any).content || []).map((child, index) =>
      this.serializeMark(child, index),
    );
    return this.renderMark(
      markToReact(mark),
      this.getMarkProps(mark),
      `${mark.type.name}-${index}`,
      content,
    );
  }

  private renderNode(
    NodeComponent: ComponentClass<any>,
    props: any,
    key: string,
    content: string | JSX.Element | any[] | null | undefined,
  ): JSX.Element {
    return (
      <NodeComponent key={key} {...props}>
        {content}
      </NodeComponent>
    );
  }

  private renderMark(
    MarkComponent: ComponentClass<any>,
    props: any,
    key: string,
    content: any,
  ) {
    return (
      <MarkComponent key={key} {...props}>
        {content}
      </MarkComponent>
    );
  }

  private getEmojiBlockProps(node: Node) {
    return {
      ...this.getProps(node),
      fitToHeight: bigEmojiHeight,
    };
  }

  private getTableProps(node: Node) {
    return {
      ...this.getProps(node),
      columnWidths: calcTableColumnWidths(node),
    };
  }

  private getDateProps(
    node: Node,
    parentInfo: { parentIsIncompleteTask: boolean } | undefined,
  ) {
    return {
      timestamp: node.attrs && node.attrs.timestamp,
      parentIsIncompleteTask: parentInfo && parentInfo.parentIsIncompleteTask,
    };
  }

  private getProps(node: Node) {
    return {
      text: node.text,
      providers: this.providers,
      eventHandlers: this.eventHandlers,
      extensionHandlers: this.extensionHandlers,
      portal: this.portal,
      rendererContext: this.rendererContext,
      serializer: this,
      content: node.content ? node.content.toJSON() : undefined,
      allowDynamicTextSizing: this.allowDynamicTextSizing,
      appearance: this.appearance,
      ...node.attrs,
    };
  }

  private getHeadingProps(node: Node) {
    return {
      ...node.attrs,
      content: node.content ? node.content.toJSON() : undefined,
      headingId: this.getHeadingId(node),
    };
  }

  private getHeadingId(node: Node) {
    if (this.disableHeadingIDs || !node.content) {
      return;
    }

    const headingId = (node as any).content
      .toJSON()
      .reduce((acc, node) => acc.concat(getText(node) || ''), '')
      .replace(/ /g, '-');

    return this.getUniqueHeadingId(headingId);
  }

  private getUniqueHeadingId(baseId, counter = 0) {
    if (counter === 0 && this.headingIds.indexOf(baseId) === -1) {
      this.headingIds.push(baseId);
      return baseId;
    } else if (counter !== 0) {
      const headingId = `${baseId}.${counter}`;
      if (this.headingIds.indexOf(headingId) === -1) {
        this.headingIds.push(headingId);
        return headingId;
      }
    }

    return this.getUniqueHeadingId(baseId, ++counter);
  }

  private getMarkProps(mark: Mark): any {
    const { key, ...otherAttrs } = mark.attrs;
    return {
      eventHandlers: this.eventHandlers,
      markKey: key,
      ...otherAttrs,
    };
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
    return content.reduce(
      (acc, node, index) => {
        const nodeMarks = this.getMarks(node);

        if (nodeMarks.length === 0) {
          currentMarkNode = node;
          acc.push(currentMarkNode);
        } else {
          nodeMarks.forEach((mark, markIndex) => {
            const isSameAsPrevious = isSameMark(mark, currentMarkNode as Mark);
            const previousIsInMarks =
              markIndex > 0 &&
              nodeMarks.some(m => isSameMark(m, currentMarkNode));

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
      },
      [] as Mark[],
    );
  }

  static fromSchema(
    schema: Schema,
    {
      providers,
      eventHandlers,
      extensionHandlers,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
    }: ConstructorParams,
  ): ReactSerializer {
    // TODO: Do we actually need the schema here?
    return new ReactSerializer({
      providers,
      eventHandlers,
      extensionHandlers,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
    });
  }
}

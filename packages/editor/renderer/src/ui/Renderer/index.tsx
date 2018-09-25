import * as React from 'react';
import { PureComponent } from 'react';
import { Schema } from 'prosemirror-model';
import {
  ADFStage,
  UnsupportedBlock,
  ProviderFactory,
  defaultSchema,
  EventHandlers,
  ExtensionHandlers,
  BaseTheme,
  WidthProvider,
} from '@atlaskit/editor-common';
import { ReactSerializer, renderDocument, RendererContext } from '../../';
import { RenderOutputStat } from '../../';
import { Wrapper } from './style';

export type RendererAppearance =
  | 'message'
  | 'inline-comment'
  | 'comment'
  | 'full-page'
  | 'mobile'
  | undefined;

export interface Extension<T> {
  extensionKey: string;
  parameters?: T;
  content?: any; // This would be the original Atlassian Document Format
}

export interface Props {
  document: any;
  dataProviders?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  onComplete?: (stat: RenderOutputStat) => void;
  portal?: HTMLElement;
  rendererContext?: RendererContext;
  schema?: Schema;
  useNewApplicationCard?: boolean;
  appearance?: RendererAppearance;
  adfStage?: ADFStage;
  disableHeadingIDs?: boolean;
  allowDynamicTextSizing?: boolean;
}

export default class Renderer extends PureComponent<Props, {}> {
  private providerFactory: ProviderFactory;
  private serializer: ReactSerializer;

  constructor(props: Props) {
    super(props);
    this.providerFactory = props.dataProviders || new ProviderFactory();

    this.updateSerializer(props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.portal !== this.props.portal) {
      this.updateSerializer(nextProps);
    }
  }

  private updateSerializer(props: Props) {
    const {
      eventHandlers,
      portal,
      rendererContext,
      document,
      extensionHandlers,
      schema,
      useNewApplicationCard,
      appearance,
      disableHeadingIDs,
    } = props;

    this.serializer = new ReactSerializer({
      providers: this.providerFactory,
      eventHandlers,
      extensionHandlers,
      portal,
      objectContext: {
        adDoc: document,
        schema,
        ...rendererContext,
      } as RendererContext,
      useNewApplicationCard,
      appearance,
      disableHeadingIDs,
    });
  }

  render() {
    const {
      document,
      onComplete,
      schema,
      appearance,
      adfStage,
      allowDynamicTextSizing,
    } = this.props;

    try {
      const { result, stat } = renderDocument(
        document,
        this.serializer,
        schema || defaultSchema,
        adfStage,
      );

      if (onComplete) {
        onComplete(stat);
      }

      return (
        <RendererWrapper
          appearance={appearance}
          dynamicTextSizing={allowDynamicTextSizing}
        >
          {result}
        </RendererWrapper>
      );
    } catch (ex) {
      return (
        <RendererWrapper
          appearance={appearance}
          dynamicTextSizing={allowDynamicTextSizing}
        >
          <UnsupportedBlock />
        </RendererWrapper>
      );
    }
  }

  componentWillUnmount() {
    const { dataProviders } = this.props;

    // if this is the ProviderFactory which was created in constructor
    // it's safe to destroy it on Renderer unmount
    if (!dataProviders) {
      this.providerFactory.destroy();
    }
  }
}

export function RendererWrapper({ appearance, children, dynamicTextSizing }) {
  return (
    <WidthProvider>
      <BaseTheme dynamicTextSizing={dynamicTextSizing}>
        <Wrapper appearance={appearance}>{children}</Wrapper>
      </BaseTheme>
    </WidthProvider>
  );
}

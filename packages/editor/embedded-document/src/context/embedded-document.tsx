import * as React from 'react';
import { Component, ReactElement } from 'react';
import styled from 'styled-components';
import { Actions, Context, Mode, State } from './context';
import { getProvider, Provider, ProviderProps } from '../provider';

export const akEditorFullPageMaxWidth = 680;
const GUTTER_PADDING = 32;
const Content = styled.div`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${akEditorFullPageMaxWidth + GUTTER_PADDING * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & > * {
    padding: 0 32px;
  }
`;

export interface Props extends ProviderProps {
  /* The ARI for the resource that points or refers to this document e.g. a page in Confluence */
  objectId: string;

  /* The ID of the embedded document. */
  documentId?: string;

  /* The ARI for the container that owns the document e.g. a space in Confluence */
  containerId?: string;

  /* The language of the embedded document. */
  language?: string;

  /* The mode of the embedded document. View or edit. */
  mode?: Mode;

  renderTitle?: (mode: Mode, doc?: any) => ReactElement<any>;
  renderToolbar?: (mode: Mode, editorActions?: any) => ReactElement<any>;
}

export default class EmbeddedDocument extends Component<Props, State> {
  private actions: Actions;
  private provider: Provider;

  constructor(props: Props) {
    super(props);

    this.actions = {
      getDocument: this.getDocument,
      setDocumentMode: this.setDocumentMode,
      updateDocument: this.updateDocument,
      createDocument: this.createDocument,
    };

    this.provider = getProvider(props);

    // Set initial mode.
    if (!props.documentId) {
      this.state = {
        mode: 'create',
      };
    } else {
      this.state = {
        mode: props.mode || 'view',
        isLoading: true,
      };
    }
  }

  componentDidMount() {
    const { documentId, language } = this.props;
    if (documentId) {
      this.getDocument(documentId, language);
    }
  }

  private getDocument = async (documentId: string, language?: string) => {
    this.setState({
      isLoading: true,
    });

    const doc = await this.provider.getDocument(documentId, language);
    if (doc) {
      this.setState({
        isLoading: false,
        doc,
      });
    } else {
      this.setState({
        isLoading: false,
        hasError: true,
      });
    }
  };

  private setDocumentMode = async (mode: Mode) => {
    this.setState({
      mode,
    });
  };

  private updateDocument = async (body: any) => {
    const { documentId, objectId, language } = this.props;

    if (!documentId) {
      return this.createDocument(body);
    }

    const doc = await this.provider.updateDocument(
      documentId,
      JSON.stringify(body),
      objectId,
      '',
      language,
    );

    if (doc) {
      this.setState({
        doc,
        mode: 'view',
      });
      return doc;
    } else {
      this.setState({
        hasError: true,
        mode: 'view',
      });

      throw new Error('Failed to update document');
    }
  };

  private createDocument = async (body: any) => {
    const { objectId, language } = this.props;

    const doc = await this.provider.createDocument(
      JSON.stringify(body),
      objectId,
      '',
      language,
    );

    if (doc) {
      this.setState({
        doc,
        mode: 'view',
      });

      return doc;
    } else {
      this.setState({
        hasError: true,
        mode: 'view',
      });

      throw new Error('Failed to create document');
    }
  };

  /**
   * Toolbar will only be rendered here if we're in "view"-mode.
   *
   * In all other modes, the toolbar rendering will be triggered
   * by the Document-component.
   */
  private renderToolbar() {
    const { mode } = this.state;
    const { renderToolbar } = this.props;

    if (mode !== 'view' || !renderToolbar) {
      return;
    }

    return renderToolbar(mode);
  }

  /**
   * Title will only be rendered here if we're in "view"-mode.
   *
   * In all other modes, the title rendering will be triggered
   * by the Document-component.
   */
  private renderTitle() {
    const { mode, doc } = this.state;
    const { renderTitle } = this.props;

    if (mode !== 'view' || !renderTitle) {
      return;
    }

    return renderTitle(mode, doc);
  }

  private renderContent() {
    const { mode } = this.state;
    if (mode === 'view') {
      return (
        <>
          {this.renderToolbar()}
          <Content>
            {this.renderTitle()}
            {this.props.children}
          </Content>
        </>
      );
    }

    return this.props.children;
  }

  render() {
    const { renderTitle, renderToolbar } = this.props;
    return (
      <Context.Provider
        value={{
          value: this.state,
          actions: this.actions,
          renderProps: {
            renderTitle,
            renderToolbar,
          },
        }}
      >
        {this.renderContent()}
      </Context.Provider>
    );
  }
}

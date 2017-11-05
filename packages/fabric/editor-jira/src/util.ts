import { MediaProvider } from '@atlaskit/editor-core';
import { ClientBasedAuth } from '@atlaskit/media-core';
import { Schema } from 'prosemirror-model';

export interface ContextInfo {
  clientId: string;
  serviceHost: string;
  token: string;
  collection: string;
}

export interface MediaContextInfo {
  viewContext?: ContextInfo;
  uploadContext?: ContextInfo;
}

export function isSchemaWithMentions(schema: Schema): boolean {
  return !!schema.nodes.mention;
}

export function isSchemaWithLinks(schema: Schema): boolean {
  return !!schema.marks.link;
}

export function isSchemaWithCodeBlock(schema: Schema): boolean {
  return !!schema.nodes.codeBlock;
}

export function isSchemaWithMedia(schema: Schema): boolean {
  return !!schema.nodes.mediaGroup && !!schema.nodes.media;
}

export function isSchemaWithTextColor(schema: Schema): boolean {
  return !!schema.marks.textColor;
}

export async function getMediaContextInfo(mediaProvider?: Promise<MediaProvider>): Promise<MediaContextInfo> {
  let mediaContextInfo: MediaContextInfo = {};

  if (mediaProvider) {
    const resolvedMediaProvider = await mediaProvider;

    if (resolvedMediaProvider.viewContext) {
      const viewContext: any = await resolvedMediaProvider.viewContext;

      if (viewContext) {
        const { serviceHost, authProvider } = viewContext.config || viewContext;
        const collection = resolvedMediaProvider.uploadParams && resolvedMediaProvider.uploadParams.collection || '';
        const auth = (await authProvider({ collectionName: collection })) as ClientBasedAuth;
        const { token, clientId } = auth;

        mediaContextInfo.viewContext = { clientId, serviceHost, token, collection };
      }
    }

    if (resolvedMediaProvider.uploadParams && resolvedMediaProvider.uploadParams.collection) {
      const uploadContext = await resolvedMediaProvider.uploadContext;

      if (uploadContext) {
        const { serviceHost, authProvider } = uploadContext;
        const { collection } = resolvedMediaProvider.uploadParams;
        const auth: ClientBasedAuth = (await authProvider({ collectionName: collection })) as ClientBasedAuth;
        const { token, clientId } = auth;

        mediaContextInfo.uploadContext = { clientId, serviceHost, token, collection };
      }
    }
  }

  return mediaContextInfo;
}

export function isSchemaWithTables(schema: Schema): boolean {
  return (
    !!schema.nodes.table &&
    !!schema.nodes.tableCell &&
    !!schema.nodes.tableHeader &&
    !!schema.nodes.tableRow
  );
}

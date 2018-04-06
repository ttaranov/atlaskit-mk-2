import createRequest from './util/createRequest';
import { LinkItem, MediaApiConfig, UrlPreview } from '../';

export interface LinkService {
  getLinkItem(linkId: string, collection?: string): Promise<LinkItem>;
  addLinkItem(
    url: string,
    collection: string,
    metadata?: UrlPreview,
  ): Promise<string>;
}

export class MediaLinkService implements LinkService {
  constructor(private readonly config: MediaApiConfig) {}

  getLinkItem(linkId: string, collectionName: string): Promise<LinkItem> {
    const request = createRequest({
      config: this.config,
      collectionName: collectionName,
      preventPreflight: true,
    });

    return request({ url: `/link/${linkId}` })
      .response.then(json => json.data)
      .then(linkDetails => {
        return {
          type: 'link',
          details: {
            id: linkDetails.id,
            url: linkDetails.url,
            type: linkDetails.metadata.type,
            title: linkDetails.metadata.title,
            description: linkDetails.metadata.description,
            site: linkDetails.metadata.site,
            author: linkDetails.metadata.author,
            date: linkDetails.metadata.date,
            resources: linkDetails.metadata.resources,
          },
        } as LinkItem;
      });
  }

  addLinkItem(
    url: string,
    collectionName: string,
    metadata?: UrlPreview,
  ): Promise<string> {
    const request = createRequest({
      config: this.config,
      collectionName: collectionName,
    });

    return request({
      method: 'post',
      url: '/link',
      data: { url, metadata },
    }).response.then(json => json.data.id);
  }
}

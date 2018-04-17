import createRequest from './util/createRequest';
import { FileItem, MediaApiConfig } from '../';
import { LRUCache } from 'lru-fast';

export interface FileService {
  getFileItem(fileId: string, collection?: string): Promise<FileItem>;
}

export class MediaFileService implements FileService {
  constructor(
    private config: MediaApiConfig,
    private fileItemCache: LRUCache<string, FileItem>,
  ) {}

  getFileItem(fileId: string, collectionName?: string): Promise<FileItem> {
    const cacheKey = [fileId, 'file'].join('-');
    const cachedValue = this.fileItemCache.get(cacheKey);

    if (cachedValue) {
      return Promise.resolve(cachedValue);
    } else {
      const request = createRequest({
        config: this.config,
        collectionName,
        preventPreflight: true,
      });

      return request({ url: `/file/${fileId}` })
        .response.then(json => json.data)
        .then(fileDetails => {
          const fileItem = <FileItem>{
            type: 'file',
            details: {
              id: fileDetails.id,
              mediaType: fileDetails.mediaType,
              mimeType: fileDetails.mimeType,
              name: fileDetails.name,
              processingStatus: fileDetails.processingStatus,
              size: fileDetails.size,
              artifacts: fileDetails.artifacts,
            },
          };
          if (fileDetails.processingStatus === 'succeeded') {
            this.fileItemCache.set(cacheKey, fileItem);
          }
          return fileItem;
        });
    }
  }
}

import { FileItem, MediaApiConfig } from '../';
import { FileService, MediaFileService } from '../services/fileService';
import { Observable } from 'rxjs/Observable';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { LRUCache } from 'lru-fast';

export const FILE_PROVIDER_RETRY_INTERVAL = 2000;

export interface FileProvider {
  observable(): Observable<FileItem>;
}

export class FileProvider {
  public static fromMediaApi(
    config: MediaApiConfig,
    fileItemCache: LRUCache<string, FileItem>,
    fileId: string,
    collection?: string,
    pollInterval?: number,
  ): FileProvider {
    return FileProvider.fromFileService(
      new MediaFileService(config, fileItemCache),
      fileId,
      collection,
      pollInterval,
    );
  }

  public static fromFileService(
    fileService: FileService,
    fileId: string,
    collectionName?: string,
    pollInterval?: number,
  ): FileProvider {
    return {
      observable() {
        const observable = publishReplay<FileItem>(1)(
          new Observable<FileItem>(subscriber => {
            let handle: number;
            const timeout = pollInterval || 1000;

            const fetch = () => {
              fileService.getFileItem(fileId, collectionName).then(
                fileItem => {
                  if (fileItem.details.processingStatus !== 'pending') {
                    subscriber.next(fileItem);
                    subscriber.complete();
                  } else {
                    subscriber.next(fileItem);
                    handle = window.setTimeout(() => fetch(), timeout);
                  }
                },
                error => {
                  subscriber.error(error);
                },
              );
            };

            fetch();

            return () => {
              if (handle !== null) {
                clearTimeout(handle);
              }
            };
          }),
        );

        observable.connect();

        return observable;
      },
    };
  }
}

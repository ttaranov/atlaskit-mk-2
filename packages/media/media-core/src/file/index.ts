import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { publishReplay } from 'rxjs/operators/publishReplay';
import * as Dataloader from 'dataloader';
import {
  MediaStore,
  UploadableFile,
  UploadController,
  uploadFile,
  MediaCollectionItemFullDetails,
} from '@atlaskit/media-store';
import {
  FilePreview,
  FileState,
  GetFileOptions,
  mapMediaItemToFileState,
} from '../fileState';
import { fileStreamsCache } from '../context/fileStreamCache';
import FileStreamCache from '../context/fileStreamCache';
import { getMediaTypeFromUploadableFile } from '../utils/getMediaTypeFromUploadableFile';

const POLLING_INTERVAL = 1000;
const maxNumberOfItemsPerCall = 100;
interface DataloaderKey {
  id: string;
  collection?: string;
}
export class FileFetcher {
  dataloader: Dataloader<
    DataloaderKey,
    MediaCollectionItemFullDetails | undefined
  >;
  constructor(private readonly mediaStore: MediaStore) {
    this.dataloader = new Dataloader<
      DataloaderKey,
      MediaCollectionItemFullDetails | undefined
    >(this.batchLoadingFunc, {
      maxBatchSize: maxNumberOfItemsPerCall,
    });
  }

  // TODO: add test to ensure we return the right items
  // Returns an array of the same length as the keys filled with file items
  batchLoadingFunc = async (keys: DataloaderKey[]) => {
    const response = await this.mediaStore.getItems(keys);
    const { items } = response.data;

    return keys.map(key => {
      const item = items.find(
        item => item.id === key.id && item.collection === key.collection,
      );
      return item && item.details;
    });
  };

  getFileState(id: string, options?: GetFileOptions): Observable<FileState> {
    const key = FileStreamCache.createKey(id, options);

    return fileStreamsCache.getOrInsert(key, () => {
      const collection = options && options.collectionName;
      const fileStream$ = publishReplay<FileState>(1)(
        this.createDownloadFileStream(id, collection),
      );

      fileStream$.connect();

      return fileStream$;
    });
  }

  private createDownloadFileStream = (
    id: string,
    collection?: string,
  ): Observable<FileState> => {
    return Observable.create(async (observer: Observer<FileState>) => {
      let timeoutId: number;

      const fetchFile = async () => {
        try {
          const response = await this.dataloader.load({ id, collection });

          if (!response) {
            return;
          }

          const fileState = mapMediaItemToFileState(id, response);

          observer.next(fileState);

          if (fileState.status === 'processing') {
            timeoutId = window.setTimeout(fetchFile, POLLING_INTERVAL);
          } else {
            observer.complete();
          }
        } catch (e) {
          observer.error(e);
        }
      };

      fetchFile();

      return () => {
        window.clearTimeout(timeoutId);
      };
    });
  };

  upload(
    file: UploadableFile,
    controller?: UploadController,
  ): Observable<FileState> {
    let fileId: string;
    let mimeType = '';
    let preview: FilePreview;
    // TODO [MSW-796]: get file size for base64
    const size = file.content instanceof Blob ? file.content.size : 0;
    const mediaType = getMediaTypeFromUploadableFile(file);
    const collectionName = file.collection;
    const name = file.name || ''; // name property is not available in base64 image
    const subject = new ReplaySubject<FileState>(1);

    if (file.content instanceof Blob) {
      mimeType = file.content.type;
      preview = {
        blob: file.content,
      };
    }
    const { deferredFileId: onUploadFinish, cancel } = uploadFile(
      file,
      this.mediaStore,
      {
        onProgress: progress => {
          if (fileId) {
            subject.next({
              progress,
              name,
              size,
              mediaType,
              mimeType,
              id: fileId,
              status: 'uploading',
              preview,
            });
          }
        },
        onId: id => {
          fileId = id;
          const key = FileStreamCache.createKey(fileId, { collectionName });
          fileStreamsCache.set(key, subject);
          if (file.content instanceof Blob) {
            subject.next({
              name,
              size,
              mediaType,
              mimeType,
              id: fileId,
              progress: 0,
              status: 'uploading',
              preview,
            });
          }
        },
      },
    );

    if (controller) {
      controller.setAbort(cancel);
    }

    onUploadFinish
      .then(() => {
        subject.next({
          id: fileId,
          name,
          size,
          mediaType,
          mimeType,
          status: 'processing',
          preview,
        });
        subject.complete();
      })
      .catch(error => {
        // we can't use .catch(subject.error) due that will change the Subscriber context
        subject.error(error);
      });

    return subject;
  }

  async downloadBinary(
    id: string,
    name: string = 'download',
    collectionName?: string,
  ) {
    const isIE11 =
      !!(window as any).MSInputMethodContext &&
      !!(document as any).documentMode;
    const iframeName = 'media-download-iframe';
    const link = document.createElement('a');
    let iframe = document.getElementById(iframeName) as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.id = iframeName;
      iframe.name = iframeName;
      document.body.appendChild(iframe);
    }
    link.href = await this.mediaStore.getFileBinaryURL(id, collectionName);
    link.download = name;
    link.target = isIE11 ? '_blank' : iframeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

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

interface DataloaderKey {
  id: string;
  collection?: string;
}
export class FileFetcher {
  dataloader: Dataloader<DataloaderKey, MediaCollectionItemFullDetails>;
  constructor(private readonly mediaStore: MediaStore) {
    // TODO: caching function
    this.dataloader = new Dataloader<
      DataloaderKey,
      MediaCollectionItemFullDetails
    >(this.batchLoadingFunc, {
      maxBatchSize: 100,
    });
  }

  // TODO: map input files to response files
  // TODO: not found file
  batchLoadingFunc = async (keys: DataloaderKey[]) => {
    console.log(keys);
    const response = await this.mediaStore.getItems(keys);

    return response.data.items.map(item => item.details);
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
}

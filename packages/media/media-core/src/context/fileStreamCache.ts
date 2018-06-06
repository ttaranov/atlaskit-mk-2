import { FileState, GetFileOptions } from '../fileState';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { LRUCache } from 'lru-fast';

export class FileStreamCache {
  private readonly fileStreams: LRUCache<
    string,
    ConnectableObservable<FileState>
  >;

  constructor() {
    this.fileStreams = new LRUCache(1000);
  }

  static createKey(id: string, options: GetFileOptions = {}): string {
    const collection = options.collectionName
      ? `-${options.collectionName}`
      : '';
    const occurrence = options.occurrenceKey ? `-${options.occurrenceKey}` : '';

    return `${id}${collection}${occurrence}`;
  }

  has(id: string): boolean {
    return !!this.fileStreams.find(id);
  }

  set(id: string, fileStream: ConnectableObservable<FileState>) {
    this.fileStreams.set(id, fileStream);
  }

  get(id: string): ConnectableObservable<FileState> | undefined {
    return this.fileStreams.get(id);
  }
}

export default FileStreamCache;

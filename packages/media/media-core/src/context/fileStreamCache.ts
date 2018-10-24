import { FileState, GetFileOptions } from '../fileState';
import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';

export class FileStreamCache {
  private readonly fileStreams: LRUCache<string, Observable<FileState>>;

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

  set(id: string, fileStream: Observable<FileState>) {
    this.fileStreams.set(id, fileStream);
  }

  get(id: string): Observable<FileState> | undefined {
    return this.fileStreams.get(id);
  }

  getOrInsert(
    id: string,
    callback: () => Observable<FileState>,
  ): Observable<FileState> {
    if (!this.has(id)) {
      this.set(id, callback());
    }

    return this.get(id)!;
  }

  removeAll() {
    this.fileStreams.removeAll();
  }

  remove(id: string) {
    this.fileStreams.remove(id);
  }

  get size(): number {
    return this.fileStreams.size;
  }
}

export const fileStreamsCache = new FileStreamCache();
export default FileStreamCache;

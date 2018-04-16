import { Observable } from 'rxjs/Observable';
import { MediaCollection } from '../collection';

export interface MediaCollectionProvider {
  observable(): Observable<MediaCollection | Error>;
  loadNextPage(): void;
  refresh(): void;
}

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { publishReplay } from 'rxjs/operators/publishReplay';
import { AxiosError } from 'axios';
import {
  CollectionService,
  SortDirection,
} from '../services/collectionService';
import { MediaCollectionProvider } from './mediaCollectionProvider';
import { CollectionNotFoundError } from '../index';
import { MediaCollection, MediaCollectionItem } from './types';

export class RemoteMediaCollectionProvider implements MediaCollectionProvider {
  private readonly subject = new Subject<MediaCollection | Error>();
  private readonly connectableObservable = publishReplay<
    MediaCollection | Error
  >(1)(this.subject);

  private items: Array<MediaCollectionItem> = [];
  private nextInclusiveStartKey?: string = undefined;
  private isLoading = false;

  constructor(
    private readonly collectionService: CollectionService,
    private readonly collectionName: string,
    private readonly pageSize: number,
    private readonly sortDirection: SortDirection,
  ) {
    this.connectableObservable.connect();
    this.loadNextPage();
  }

  observable(): Observable<MediaCollection | Error> {
    return this.connectableObservable;
  }

  loadNextPage(): void {
    if (this.isLoading) {
      return;
    } else {
      this.isLoading = true;
    }

    this.collectionService
      .getCollectionItems(
        this.collectionName,
        this.pageSize,
        this.nextInclusiveStartKey,
        this.sortDirection,
        'full',
      )
      .then(response => {
        this.isLoading = false;
        this.items.push(...response.items);

        const mediaCollection = {
          id: this.collectionName,
          items: this.items,
        };

        this.nextInclusiveStartKey = response.nextInclusiveStartKey;
        this.subject.next(mediaCollection);
      })
      .catch(this.onAxiosError);
  }

  refresh() {
    if (this.isLoading) {
      return;
    } else {
      this.isLoading = true;
    }

    const oldFirstItemDetails = this.items[0] && this.items[0].details;
    const oldFirstItemId = oldFirstItemDetails && oldFirstItemDetails.id;
    const oldFirstItemOccurrenceKey =
      oldFirstItemDetails && oldFirstItemDetails.occurrenceKey;
    const newItems: Array<MediaCollectionItem> = [];
    let nextInclusiveStartKey: string;

    const fetchNewItems = () => {
      this.collectionService
        .getCollectionItems(
          this.collectionName,
          this.pageSize,
          nextInclusiveStartKey,
          this.sortDirection,
          'full',
        )
        .then(res => {
          let reachedFirstOldItem = false;
          for (let newItem of res.items) {
            const {
              details: { id, occurrenceKey },
            } = newItem;
            const reachedFirstItemAlreadyInCollection =
              id === oldFirstItemId &&
              occurrenceKey === oldFirstItemOccurrenceKey;

            if (reachedFirstItemAlreadyInCollection) {
              reachedFirstOldItem = true;
              break;
            }

            newItems.push(newItem);
          }

          if (reachedFirstOldItem) {
            this.isLoading = false;

            this.items = [...newItems, ...this.items];

            this.subject.next({
              id: this.collectionName,
              items: this.items,
            });
          } else if (res.nextInclusiveStartKey) {
            nextInclusiveStartKey = res.nextInclusiveStartKey;
            fetchNewItems();
          }
        })
        .catch(this.onAxiosError);
    };

    fetchNewItems();
  }

  private onAxiosError = (error: AxiosError): void => {
    this.isLoading = false;
    if (error.response && error.response.status === 404) {
      this.subject.next(new CollectionNotFoundError());
    } else {
      this.subject.next(error);
    }
  };
}

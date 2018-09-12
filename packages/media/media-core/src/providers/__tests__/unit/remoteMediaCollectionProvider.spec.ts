import * as sinon from 'sinon';
import { tap } from 'rxjs/operators/tap';
import { skip } from 'rxjs/operators/skip';
import { take } from 'rxjs/operators/take';
import { filter } from 'rxjs/operators/filter';

import { CollectionServiceStub } from '../../../../test-helpers/collection-service-stub';
import { RemoteMediaCollectionProviderFactory } from '../../remoteMediaCollectionProviderFactory';
import { Subscription } from 'rxjs/Subscription';
import { isError } from '../../../error';
import { MediaCollection } from '../../../providers/types';
import { RemoteMediaCollectionProvider } from '../../remoteMediaCollectionProvider';
import { CollectionNotFoundError } from '../../..';

const defaultCollectionName = 'MediaServicesSample';

const isMediaCollection = (
  value: MediaCollection | Error,
): value is MediaCollection => !isError(value);

describe('RemoteMediaCollectionProvider', () => {
  const pageCount = 10;
  const itemsPerPageCount = 10;
  const totalItemCount = pageCount * itemsPerPageCount;
  const sortDirection = 'desc';

  it('should load the first page on construction', done => {
    const collectionService = CollectionServiceStub.from(
      defaultCollectionName,
      totalItemCount,
      itemsPerPageCount,
    );
    const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
      collectionService,
      defaultCollectionName,
      itemsPerPageCount,
      sortDirection,
    );

    const subscription = collectionProvider
      .observable()
      .pipe(filter(isMediaCollection))
      .subscribe({
        next: collection => {
          expect(collection.id).toBe(defaultCollectionName);
          expect(collection.items).toHaveLength(itemsPerPageCount);
          subscription.unsubscribe();
          done();
        },
      });
  });

  it('should load the next page', done => {
    const collectionService = CollectionServiceStub.from(
      defaultCollectionName,
      totalItemCount,
      itemsPerPageCount,
    );
    const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
      collectionService,
      defaultCollectionName,
      itemsPerPageCount,
      sortDirection,
    );

    // Load next page when we have finished loading the first one.
    const subscription1: Subscription = collectionProvider
      .observable()
      .pipe(take(1), tap(() => collectionProvider.loadNextPage()))
      .subscribe({
        next: () => subscription1.unsubscribe(),
      });

    const subscription2 = collectionProvider
      .observable()
      .pipe(
        filter(isMediaCollection),
        skip<MediaCollection>(1),
        take<MediaCollection>(1),
      )
      .subscribe({
        next: collection => {
          expect(collection.items).toHaveLength(2 * itemsPerPageCount);
          expect(
            collection.items[2 * itemsPerPageCount - 1].details.occurrenceKey,
          ).toBe('file-19');
          subscription2.unsubscribe();
          done();
        },
      });
  });

  describe('refresh', () => {
    it('should fetch and not add any new items to the collection when there are no new items', done => {
      const getCollectionItems = sinon.stub();

      const firstPageItems = [
        { details: { id: 'd' } },
        { details: { id: 'e' } },
        { details: { id: 'f' } },
      ];

      getCollectionItems
        .onFirstCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        )
        .onSecondCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        );

      const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
        { getCollectionItems },
        defaultCollectionName,
        itemsPerPageCount,
        sortDirection,
      );

      let firstTime = true;
      const subscription = collectionProvider
        .observable()
        .pipe(filter(isMediaCollection))
        .subscribe({
          next: collection => {
            if (firstTime) {
              firstTime = false;
              collectionProvider.refresh();
            } else {
              expect(collection.items).toHaveLength(firstPageItems.length);
              expect(collection.items).toEqual([...firstPageItems]);
              subscription.unsubscribe();
              done();
            }
          },
        });
    });

    it('should fetch and add new items from the first page to the collection when we have loaded the first page', done => {
      const getCollectionItems = sinon.stub();

      const firstPageItems = [
        { details: { id: 'd' } },
        { details: { id: 'e' } },
        { details: { id: 'f' } },
      ];
      const newItems = [
        { details: { id: 'a' } },
        { details: { id: 'b' } },
        { details: { id: 'c' } },
      ];

      getCollectionItems
        .onFirstCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        )
        .onSecondCall()
        .returns(
          Promise.resolve({
            items: [...newItems, ...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        );

      const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
        { getCollectionItems },
        defaultCollectionName,
        itemsPerPageCount,
        sortDirection,
      );

      let firstTime = true;
      const subscription = collectionProvider
        .observable()
        .pipe(filter(isMediaCollection))
        .subscribe({
          next: collection => {
            if (firstTime) {
              firstTime = false;
              collectionProvider.refresh();
            } else {
              expect(collection.items).toHaveLength(
                newItems.length + firstPageItems.length,
              );
              expect(collection.items).toEqual([
                ...newItems,
                ...firstPageItems,
              ]);
              subscription.unsubscribe();
              done();
            }
          },
        });
    });

    it('should fetch and add new items from the first page to the collection when we have loaded the first page and multiple items have the same ID', done => {
      const getCollectionItems = sinon.stub();

      const firstPageItems = [{ details: { id: 'a', occurrenceKey: 'X' } }];
      const newItems = [{ details: { id: 'a', occurrenceKey: 'Y' } }];

      getCollectionItems
        .onFirstCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        )
        .onSecondCall()
        .returns(
          Promise.resolve({
            items: [...newItems, ...firstPageItems],
            nextInclusiveStartKey: undefined,
          }),
        );

      const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
        { getCollectionItems },
        defaultCollectionName,
        itemsPerPageCount,
        sortDirection,
      );

      let firstTime = true;
      const subscription = collectionProvider
        .observable()
        .pipe(filter(isMediaCollection))
        .subscribe({
          next: collection => {
            if (firstTime) {
              firstTime = false;
              collectionProvider.refresh();
            } else {
              expect(collection.items).toHaveLength(
                newItems.length + firstPageItems.length,
              );
              expect(collection.items).toEqual([
                ...newItems,
                ...firstPageItems,
              ]);
              subscription.unsubscribe();
              done();
            }
          },
        });
    });

    it('should fetch and add new items from the first page to the collection when we have loaded the second page', done => {
      const getCollectionItems = sinon.stub();

      const firstPageItems = [
        { details: { id: 'd' } },
        { details: { id: 'e' } },
        { details: { id: 'f' } },
      ];
      const secondPageItems = [
        { details: { id: 'g' } },
        { details: { id: 'h' } },
        { details: { id: 'i' } },
      ];
      const newItems = [
        { details: { id: 'a' } },
        { details: { id: 'b' } },
        { details: { id: 'c' } },
      ];

      getCollectionItems
        .onFirstCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: 'xyz',
          }),
        )
        .onSecondCall()
        .returns(
          Promise.resolve({
            items: [...secondPageItems],
            nextInclusiveStartKey: undefined, // we're at the end of the collection
          }),
        )
        .onThirdCall()
        .returns(
          Promise.resolve({
            items: [...newItems, ...firstPageItems],
            nextInclusiveStartKey: 'xyz',
          }),
        );

      const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
        { getCollectionItems },
        defaultCollectionName,
        itemsPerPageCount,
        sortDirection,
      );

      let callCount = 0;
      const subscription = collectionProvider
        .observable()
        .pipe(filter(isMediaCollection))
        .subscribe({
          next: collection => {
            switch (callCount) {
              case 0:
                expect(collection.items).toHaveLength(secondPageItems.length);
                collectionProvider.loadNextPage();
                break;

              case 1:
                expect(collection.items).toHaveLength(
                  firstPageItems.length + secondPageItems.length,
                );
                collectionProvider.refresh();
                break;

              case 2:
                expect(collection.items).toHaveLength(
                  newItems.length +
                    firstPageItems.length +
                    secondPageItems.length,
                );
                expect(collection.items).toEqual([
                  ...newItems,
                  ...firstPageItems,
                  ...secondPageItems,
                ]);
                subscription.unsubscribe();
                done();
                break;
            }
            ++callCount;
          },
        });
    });

    it('should fetch and add new items from the first two pages to the collection when we have loaded the first page', done => {
      const getCollectionItems = sinon.stub();

      const firstPageItems = [
        { details: { id: 'g' } },
        { details: { id: 'h' } },
        { details: { id: 'i' } },
      ];
      const newItemsPage1 = [
        { details: { id: 'a' } },
        { details: { id: 'b' } },
        { details: { id: 'c' } },
      ];
      const newItemsPage2 = [
        { details: { id: 'd' } },
        { details: { id: 'e' } },
        { details: { id: 'f' } },
      ];

      getCollectionItems
        .onFirstCall()
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: 'xyz',
          }),
        )
        .onSecondCall()
        .returns(
          Promise.resolve({
            items: [...newItemsPage1],
            nextInclusiveStartKey: 'xyz',
          }),
        )
        .onThirdCall()
        .returns(
          Promise.resolve({
            items: [...newItemsPage2],
            nextInclusiveStartKey: 'xyz',
          }),
        )
        .onCall(3)
        .returns(
          Promise.resolve({
            items: [...firstPageItems],
            nextInclusiveStartKey: 'xyz',
          }),
        );

      const collectionProvider = RemoteMediaCollectionProviderFactory.fromCollectionService(
        { getCollectionItems },
        defaultCollectionName,
        itemsPerPageCount,
        sortDirection,
      );

      let callCount = 0;
      const subscription = collectionProvider
        .observable()
        .pipe(filter(isMediaCollection))
        .subscribe({
          next: collection => {
            switch (callCount) {
              case 0:
                expect(collection.items).toHaveLength(3);
                collectionProvider.refresh();
                break;

              case 1:
                expect(collection.items).toHaveLength(9);
                expect(collection.items).toEqual([
                  ...newItemsPage1,
                  ...newItemsPage2,
                  ...firstPageItems,
                ]);
                subscription.unsubscribe();
                done();
                break;
            }
            ++callCount;
          },
        });
    });

    it('should emit a CollectionNotFoundError given collection service responds with a 404', () => {
      const collectionService = {
        getCollectionItems: jest.fn(),
        loadNextPage: jest.fn(),
      };

      collectionService.getCollectionItems.mockReturnValue(
        Promise.reject({
          response: { status: 404 },
        }),
      );

      const provider = new RemoteMediaCollectionProvider(
        collectionService,
        defaultCollectionName,
        10,
        'desc',
      );

      return provider
        .observable()
        .pipe(
          filter(isError),
          take<Error>(1),
          tap<Error>(error => {
            expect(error).toEqual(new CollectionNotFoundError());
          }),
        )
        .toPromise();
    });

    it('should emit an Error given collection service responds with some other error', () => {
      const someError = new Error();
      const collectionService = {
        getCollectionItems: jest.fn(),
        loadNextPage: jest.fn(),
      };

      collectionService.getCollectionItems.mockReturnValue(
        Promise.reject(someError),
      );

      const provider = new RemoteMediaCollectionProvider(
        collectionService,
        defaultCollectionName,
        10,
        'desc',
      );

      return provider
        .observable()
        .pipe(
          filter(isError),
          take<Error>(1),
          tap<Error>(error => {
            expect(error).toEqual(someError);
          }),
        )
        .toPromise();
    });
  });
});

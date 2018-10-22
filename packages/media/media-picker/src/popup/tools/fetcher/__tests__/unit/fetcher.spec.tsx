jest.mock('axios');

import axios from 'axios';
import { Service } from '../../../../domain';
import {
  MediaApiFetcher,
  flattenAccounts,
  GiphyResponse,
  GiphyImage,
} from '../../fetcher';

describe('Fetcher', () => {
  let querySpy = jest.fn();

  beforeEach(() => {
    (axios.request as any).mockReturnValue(Promise.resolve({}));

    querySpy = jest.fn();
    querySpy.mockReturnValue(Promise.resolve({}));
  });

  afterEach(() => {
    (axios.request as any).mockReset();
  });

  describe('flattenAccounts()', () => {
    const services: Service[] = [
      {
        type: 'dropbox',
        status: 'available',
        accounts: [
          {
            id: 'dropbox|111111111',
            status: 'available',
            displayName: 'user@atlassian.com',
          },
        ],
      },
      {
        type: 'google',
        status: 'available',
        accounts: [],
      },
    ];

    it('flattens the response data into a list of accounts', () => {
      const flattened = flattenAccounts(services);
      expect(flattened).toEqual([
        {
          id: 'dropbox|111111111',
          status: 'available',
          displayName: 'user@atlassian.com',
          type: 'dropbox',
        },
      ]);
    });
  });

  describe('GIPHY methods', () => {
    const gifId = 'some-gif-id';
    const gifSlug = `file-slug-${gifId}`;
    const gifUrl = 'some-gif-url';
    const gifFileSizeStr = '1234567';
    const gifFileSizeNum = 1234567;
    const gifWidth = '200';
    const gifHeight = '363';

    const originalGifUrl = 'some-original-gif-url';

    const images = {
      fixed_width: {
        url: gifUrl,
        size: gifFileSizeStr,
        width: gifWidth,
        height: gifHeight,
      } as GiphyImage,
      original: {
        url: originalGifUrl,
      } as GiphyImage,
    };

    const response: GiphyResponse = {
      data: [{ id: gifId, slug: gifSlug, images }],
      pagination: {
        total_count: 100,
        count: 25,
        offset: 0,
      },
    };

    describe('fetchTrendingGifs()', () => {
      it('should pass rating=pg as a query parameter', () => {
        const offset = 0;
        const fetcher = new MediaApiFetcher();

        fetcher.fetchTrendingGifs(offset);
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect((axios.request as any).mock.calls[0][0].params.rating).toEqual(
          'pg',
        );
      });

      it('should append passed in offset to the query string when it is greater than 0', () => {
        const offset = 25;
        const fetcher = new MediaApiFetcher();

        fetcher.fetchTrendingGifs(offset);
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect((axios.request as any).mock.calls[0][0].params.offset).toEqual(
          offset,
        );
      });

      it('should map the GiphyResponse into GiphyCardModels', async () => {
        const fetcher = new MediaApiFetcher();
        (axios.request as any).mockReturnValue(
          Promise.resolve({ data: response }),
        );

        const result = await fetcher.fetchTrendingGifs();
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          totalResultCount: 100,
          cardModels: [
            {
              metadata: {
                id: gifId,
                name: 'file-slug',
                mediaType: 'image',
                size: gifFileSizeNum,
              },
              dataURI: gifUrl,
              dimensions: {
                width: 200,
                height: 363,
              },
            },
          ],
        });
      });
    });

    describe('fetchGifsRelevantToSearch()', () => {
      it('should pass rating=pg as a query parameter', () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();

        fetcher.fetchGifsRelevantToSearch(queryString);
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect((axios.request as any).mock.calls[0][0].params.rating).toEqual(
          'pg',
        );
      });

      it('should append passed in query string to the queried url', () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();

        fetcher.fetchGifsRelevantToSearch(queryString);
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect((axios.request as any).mock.calls[0][0].params.q).toEqual(
          queryString,
        );
      });

      it('should append passed in offset to the query string when it is greater than 0', () => {
        const queryString = 'some-gif-search';
        const offset = 25;
        const fetcher = new MediaApiFetcher();

        fetcher.fetchGifsRelevantToSearch(queryString, offset);

        expect(axios.request).toHaveBeenCalledTimes(1);
        expect((axios.request as any).mock.calls[0][0].params.offset).toEqual(
          offset,
        );
      });

      it('should map the GiphyResponse into GiphyCardModels', async () => {
        const queryString = 'some-gif-search';
        const fetcher = new MediaApiFetcher();
        (axios.request as any).mockReturnValue(
          Promise.resolve({ data: response }),
        );

        const result = await fetcher.fetchGifsRelevantToSearch(queryString);
        expect(axios.request).toHaveBeenCalledTimes(1);
        expect(result).toEqual({
          totalResultCount: 100,
          cardModels: [
            {
              metadata: {
                id: gifId,
                name: 'file-slug',
                mediaType: 'image',
                size: gifFileSizeNum,
              },
              dataURI: gifUrl,
              dimensions: {
                width: 200,
                height: 363,
              },
            },
          ],
        });
      });
    });
  });
});

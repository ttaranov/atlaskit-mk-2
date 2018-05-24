import { Router, Response } from 'kakapo';
import Faker = require('faker');

import { mapDataUriToBlob } from '../../utils';
import {
  DatabaseSchema,
  createCollection,
  createCollectionItem,
} from '../database';

export function createApiRouter(): Router<DatabaseSchema> {
  const router = new Router<DatabaseSchema>({
    host: 'https://dt-api.dev.atl-paas.net',
    requestDelay: 10,
  });

  router.post('/collection', ({ body }, database) => {
    const { name } = JSON.parse(body);
    const collection = createCollection(name);
    database.push('collection', collection);
    return { data: collection };
  });

  router.post('/file/binary', ({ headers, body, query }, database) => {
    const { 'Content-Type': mimeType } = headers;
    const { collection, name, occurrenceKey } = query;
    const item = createCollectionItem({
      collectionName: collection,
      name,
      mimeType,
      occurrenceKey,
      blob: body,
    });

    database.push('collectionItem', item);

    return {
      data: item.details,
    };
  });

  router.get('/collection/:collectionName/items', ({ params }, database) => {
    const { collectionName } = params;
    const contents = database
      .find('collectionItem', {
        collectionName,
      })
      .map(record => record.data);
    return {
      data: {
        nextInclusiveStartKey: Faker.random.number(),
        contents,
      },
    };
  });

  router.get('/file/:fileId/image', ({ query }) => {
    const { width, height, 'max-age': maxAge = 3600 } = query;
    const dataUri = Faker.image.dataUri(
      Number.parseInt(width),
      Number.parseInt(height),
    );

    const blob = mapDataUriToBlob(dataUri);

    return new Response(200, blob, {
      'content-type': blob.type,
      'content-length': blob.size.toString(),
      'cache-control': `private, max-age=${maxAge}`,
    });
  });

  router.get('/picker/accounts', () => {
    return {
      data: [],
    };
  });

  router.head('/chunk/:chunkId', () => {
    return {};
  });

  router.put('/chunk/:chunkId', () => {
    return {
      data: {},
    };
  });

  router.post('/upload', () => {
    return {
      data: [
        {
          id: 'some-upload-id',
          created: Date.now(),
          expires: Date.now() + 100000,
        },
      ],
    };
  });

  router.put('/upload/:uploadId/chunks', () => {
    return {};
  });

  router.post('/file/upload', () => {
    return {
      data: {
        mediaType: 'unknown',
        mimeType: 'image/jpeg',
        name: 'omar-albeik-589641-unsplash.jpg',
        size: 3572885,
        processingStatus: 'pending',
        artifacts: {},
        id: '9dc5b6f1-6f7d-45a3-93fe-11d0ef8546e5',
      },
    };
  });

  router.get('/file/:fileId', ({ params, query }, database) => {
    const { fileId } = params;
    const { collection } = query;

    const record = database.findOne('collectionItem', {
      id: fileId,
      collectionName: collection,
    });

    return {
      data: {
        id: fileId,
        ...record.data.details,
      },
    };
  });

  router.post('/file/copy/withToken', (request, database) => {
    const { body, query } = request;
    const { sourceFile } = JSON.parse(body);
    const { collection: destinationCollection } = query;

    const sourceRecord = database.findOne('collectionItem', {
      id: sourceFile.id,
      collectionName: sourceFile.collection,
    });

    const { details, type, blob } = sourceRecord.data;

    const record = database.push('collectionItem', {
      id: Faker.random.uuid(),
      insertedAt: Date.now(),
      occurrenceKey: Faker.random.uuid(),
      type,
      details,
      blob,
      collectionName: destinationCollection,
    });

    return {
      data: record.data,
    };
  });

  return router;
}

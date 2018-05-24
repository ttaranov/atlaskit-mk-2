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

  router.head('/chunk/:chunkId', ({ params }, database) => {
    const { chunkId } = params;
    if (database.findOne('chunk', { id: chunkId })) {
      return new Response(200, undefined, {});
    } else {
      return new Response(404, undefined, {});
    }
  });

  router.put('/chunk/:chunkId', ({ params, body }, database) => {
    const { chunkId } = params;

    database.push('chunk', {
      id: chunkId,
      blob: body,
    });

    return new Response(201, undefined, {});
  });

  router.post('/upload', ({ query }, database) => {
    const { createUpTo = '1' } = query;

    const records = database.create('upload', Number.parseInt(createUpTo));
    const data = records.map(record => record.data);

    return {
      data,
    };
  });

  router.put('/upload/:uploadId/chunks', ({ params, body }, database) => {
    const { uploadId } = params;
    const { chunks /*, offset*/ } = JSON.parse(body);

    const record = database.findOne('upload', { id: uploadId });

    database.update('upload', record.id, {
      chunks: [...record.data.chunks, ...chunks],
    });

    return new Response(200, undefined, {});
  });

  router.post('/file/upload', ({ query, body }, database) => {
    const { collection } = query;
    const { name, mimeType /*, uploadId*/ } = JSON.parse(body);

    const record = database.push(
      'collectionItem',
      createCollectionItem({
        name,
        mimeType,
        collectionName: collection,
      }),
    );

    return {
      data: {
        ...record.data.details,
        id: record.data.id,
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

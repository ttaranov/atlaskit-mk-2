import { name } from '../../../../../package.json';
import {
  media,
  camelCaseToKebabCase,
  defaultAttrs,
  MediaAttributes,
  toJSON,
} from '../../../../schema/nodes/media';
import { fromHTML, toDOM, schema } from '../../../../../test-helpers';

// Note: We can't use dom.dataset in jest until it's upgraded to use latest version
//       of jsdom. In the meantime we can use this helper-method.
const getDataSet = dom => {
  const dataSet = {} as MediaAttributes & {
    fileName: string;
    fileSize: string;
    fileMimeType: string;
    displayType: string;
    url: string;
  };
  Object.keys({
    ...defaultAttrs,
    fileName: '',
    fileSize: '',
    fileMimeType: '',
    displayType: '',
    url: '',
  }).forEach(k => {
    const key = camelCaseToKebabCase(k).replace(/^__/, '');
    const value = dom.getAttribute(`data-${key}`);
    if (value) {
      dataSet[k] = value;
    }
  });

  return dataSet;
};

describe(`${name}/schema media node`, () => {
  it('should parse html', () => {
    const doc = fromHTML(
      `
    <div
      data-node-type="media"
      data-id="id"
      data-type="file"
      data-collection="collection"
      data-file-name="file.jpg"
      data-file-size="123456"
      data-file-mime-type="image/jpeg"
    />
    `,
      schema,
    );
    const mediaGroup = doc.firstChild!;
    const mediaNode = mediaGroup.firstChild!;

    expect(mediaNode.type.spec).toEqual(media);
    expect(mediaNode.attrs.id).toEqual('id');
    expect(mediaNode.attrs.type).toEqual('file');
    expect(mediaNode.attrs.collection).toEqual('collection');
    expect(mediaNode.attrs.__fileName).toEqual('file.jpg');
    expect(mediaNode.attrs.__fileSize).toEqual(123456);
    expect(mediaNode.attrs.__fileMimeType).toEqual('image/jpeg');
    expect(mediaNode.attrs.__displayType).toEqual(null);
  });

  it('should parse html (with occurrenceKey)', () => {
    const doc = fromHTML(
      `
    <div
      data-node-type="media"
      data-id="id"
      data-type="file"
      data-collection="collection"
      data-occurrence-key="key"
    />
    `,
      schema,
    );
    const mediaGroup = doc.firstChild!;
    const mediaNode = mediaGroup.firstChild!;

    expect(mediaNode.type.spec).toEqual(media);
    expect(mediaNode.attrs.id).toEqual('id');
    expect(mediaNode.attrs.type).toEqual('file');
    expect(mediaNode.attrs.collection).toEqual('collection');
    expect(mediaNode.attrs.occurrenceKey).toEqual('key');
  });

  it('should encode to html', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      __fileName: 'file.jpg',
      __fileSize: 123456,
      __fileMimeType: 'image/jpeg',
      __displayType: 'thumbnail',
    });

    const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
    const {
      id,
      type,
      collection,
      occurrenceKey,
      fileName,
      fileSize,
      fileMimeType,
      displayType,
    } = getDataSet(domNode);

    expect(id).toEqual('id');
    expect(type).toEqual('file');
    expect(collection).toEqual('collection');
    expect(occurrenceKey).toEqual(undefined);
    expect(fileName).toEqual('file.jpg');
    expect(fileSize).toEqual('123456');
    expect(fileMimeType).toEqual('image/jpeg');
    expect(displayType).toEqual('thumbnail');
  });

  it('should encode to html (with occurrenceKey)', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      occurrenceKey: 'key',
    });

    const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
    const { id, type, collection, occurrenceKey } = getDataSet(domNode);
    expect(id).toEqual('id');
    expect(type).toEqual('file');
    expect(collection).toEqual('collection');
    expect(occurrenceKey).toEqual('key');
  });

  it('should strip optional attrs during JSON serialization', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      __fileName: 'file.jpg',
      __fileSize: 123456,
      __fileMimeType: 'image/jpeg',
      __displayType: 'thumbnail',
    });

    expect(toJSON(mediaNode)).toEqual({
      attrs: {
        collection: 'collection',
        id: 'id',
        type: 'file',
      },
    });
  });

  it('should serialize occurrenceKey when available', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      occurrenceKey: 'key',
    });

    expect(toJSON(mediaNode)).toEqual({
      attrs: {
        collection: 'collection',
        id: 'id',
        type: 'file',
        occurrenceKey: 'key',
      },
    });
  });

  it('should not serialize optional key with null value', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      occurrenceKey: null,
    });

    expect(toJSON(mediaNode)).toEqual({
      attrs: {
        collection: 'collection',
        id: 'id',
        type: 'file',
      },
    });
  });

  it('should not serialize optional string key with empty string', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      occurrenceKey: '',
    });

    expect(toJSON(mediaNode)).toEqual({
      attrs: {
        collection: 'collection',
        id: 'id',
        type: 'file',
      },
    });
  });

  it('should serialize optional number keys with value 0', () => {
    const mediaNode = schema.nodes.media.create({
      id: 'id',
      type: 'file',
      collection: 'collection',
      width: 0,
    });

    expect(toJSON(mediaNode)).toEqual({
      attrs: {
        collection: 'collection',
        id: 'id',
        type: 'file',
        width: 0,
      },
    });
  });

  describe('external images', () => {
    it('should parse html for external images', () => {
      const doc = fromHTML(
        `
      <div
        data-node-type="media"
        data-type="external"
        data-url="http://image.jpg"
      />
      `,
        schema,
      );
      const mediaGroup = doc.firstChild!;
      const mediaNode = mediaGroup.firstChild!;

      expect(mediaNode.type.spec).toEqual(media);
      expect(mediaNode.attrs.type).toEqual('external');
      expect(mediaNode.attrs.url).toEqual('http://image.jpg');
    });

    it('should encode to html', () => {
      const mediaNode = schema.nodes.media.create({
        type: 'external',
        url: 'http://image.jpg',
      });

      const domNode = toDOM(mediaNode, schema).firstChild as HTMLElement;
      const { type, url } = getDataSet(domNode);
      expect(type).toEqual('external');
      expect(url).toEqual('http://image.jpg');
    });

    it('should strip optional attrs during JSON serialization', () => {
      const mediaNode = schema.nodes.media.create({
        type: 'external',
        url: 'http://image.jpg',
      });

      expect(toJSON(mediaNode)).toEqual({
        attrs: {
          type: 'external',
          url: 'http://image.jpg',
        },
      });
    });
  });
});

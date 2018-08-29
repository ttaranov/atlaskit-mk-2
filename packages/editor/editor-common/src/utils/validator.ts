import { defaultSchema } from '../schema';
import { Schema } from 'prosemirror-model';
// import { isSafeUrl } from '.';
import { inlineNodes, blockNodes, marks } from '../schema';
import { validate, Entity, VALIDATION_ERRORS } from '@atlaskit/adf-utils';

export type ADFStage = 'stage0' | 'final';

const NOT_WRAPPABLE_NODE = new Set([
  'tableRow',
  'tableHeader',
  'tableCell',
  'media',
]);

const COLOR_UPPERCASE = /^#[0-9A-F]{6}$/;

export const getValidEntity = (
  doc: Entity,
  schema: Schema = defaultSchema,
  adfStage: ADFStage = 'final',
): Entity | null => {
  const newNode = validate(
    doc,
    // @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/730694576/Editor+RFC+117+How+to+handle+invalid+nodes+marks+inside+editor+renderer
    (entity, error, parentContent) => {
      // Remove invalid marks
      // @see https://product-fabric.atlassian.net/wiki/spaces/E/pages/707100966/Editor+RFC+115+wrap+invalid+content+with+unsupportedBlock+unsupportedInline+and+unsupportedMark
      if (error.code === VALIDATION_ERRORS.REDUNDANT_MARKS) {
        return;
      }

      const { type } = entity;

      switch (type) {
        case 'paragraph': {
          // Fix missing `content` property
          // We can remove it once we implement `default` value
          if (error.code === VALIDATION_ERRORS.MISSING_PROPERTY) {
            return { ...entity, content: [] };
          }
          break;
        }
        case 'link': {
          if (error.code === VALIDATION_ERRORS.INVALID_ATTRIBUTE) {
            if (
              error.meta!.attr === 'href' &&
              entity.attrs &&
              entity.attrs.url
            ) {
              const newObj = {
                ...entity,
                attrs: {
                  ...entity.attrs,
                  href: entity.attrs.url,
                },
              };
              delete newObj.attrs.url;
              return newObj;
            }
          }
          break;
        }
        case 'textColor': {
          // Fix upper cased color value
          if (
            error.code === VALIDATION_ERRORS.INVALID_ATTRIBUTE &&
            error.meta!.attr === 'color' &&
            entity.attrs &&
            COLOR_UPPERCASE.test(entity.attrs.color)
          ) {
            return {
              ...entity,
              attrs: {
                ...entity.attrs,
                color: entity.attrs.color.toLowerCase(),
              },
            };
          }
          break;
        }
      }

      /**
       * Checking type of the entity itself won't help because we can have a unknown node
       *  and we won't be able to determine if it's a block or inline. So we are getting
       *  type of the first allowed item. But, we fallback to entity if it's empty.
       */
      const nodeType = parentContent.length ? parentContent[0] : entity.type;
      const attrs = { originalValue: { ...entity } };
      console.log({ nodeType });
      if (marks.has(nodeType)) {
        return;
      } else if (NOT_WRAPPABLE_NODE.has(nodeType)) {
        throw new Error('');
      } else if (inlineNodes.has(nodeType)) {
        return {
          type: 'unsupportedInline',
          attrs,
        };
      } else if (blockNodes.has(nodeType)) {
        return {
          type: 'unsupportedBlock',
          attrs,
        };
      } else {
        throw new Error('Not possible to repair or wrap!');
      }
    },
    { mode: 'loose' },
  );

  if (newNode.entity) {
    return newNode.entity;
  }

  return null;
};

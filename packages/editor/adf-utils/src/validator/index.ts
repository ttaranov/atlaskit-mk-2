import * as specs from './specs';

export type Content = Array<string | [string, object]>;

export interface Entity {
  type: string;
  content?: Array<Entity>;
  marks?: Array<Entity>;
  [key: string]: any;
}

type AttributesSpec =
  | { type: 'number'; optional?: boolean; minimum: number; maximum: number }
  | { type: 'boolean'; optional?: boolean }
  | { type: 'string'; optional?: boolean; minLength?: number; pattern?: RegExp }
  | { type: 'enum'; values: Array<string>; optional?: boolean }
  | { type: 'object'; optional?: boolean };

interface ValidatorSpec {
  props?: {
    attrs?: { props: { [key: string]: AttributesSpec } };
    content?: {
      type: 'array';
      items: Array<Array<string>>;
      minItems?: number;
      allowUnsupportedBlock: boolean;
      allowUnsupportedInline: boolean;
    };
    text?: AttributesSpec;
    marks?: { type: 'array'; items: Array<Array<string>>; maxItems?: number };
  };
  minItems?: number;
  required?: Array<string>;
}

// tslint:disable-next-line:triple-equals
const isDefined = x => x != null;

const isNumber = (x): x is number =>
  typeof x === 'number' && !isNaN(x) && isFinite(x);

const isBoolean = (x): x is boolean =>
  x === true || x === false || toString.call(x) === '[object Boolean]';

// This is a kludge, might replace with something like _.isString in future
const isString = (s): s is string =>
  typeof s === 'string' || s instanceof String;

const isPlainObject = x =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

const copy = (source: object, dest: object, key: string) => {
  dest[key] = source[key];
  return dest;
};

function createSpec(nodes?: Array<string>, marks?: Array<string>) {
  return Object.keys(specs).reduce((newSpecs, k) => {
    const spec = { ...specs[k] };
    if (spec.props) {
      spec.props = { ...spec.props };
      if (isString(spec.props.content)) {
        spec.props.content = specs[spec.props.content];
      }
      if (spec.props.content) {
        if (!spec.props.content.items) {
          /**
           * Flatten
           *
           * Input:
           * [ { type: 'array', items: [ 'tableHeader' ] },
           * { type: 'array', items: [ 'tableCell' ] } ]
           *
           * Output:
           * { type: 'array', items: [ [ 'tableHeader' ], [ 'tableCell' ] ] }
           */
          spec.props.content = {
            type: 'array',
            items: (spec.props.content || []).map(arr => arr.items),
          };
        } else {
          spec.props.content = { ...spec.props.content };
        }

        spec.props.content.items = spec.props.content.items
          // ['inline'] => [['emoji', 'hr', ...]]
          // ['media'] => [['media']]
          .map(
            item =>
              isString(item)
                ? Array.isArray(specs[item])
                  ? specs[item]
                  : [item]
                : item,
          )
          // [['emoji', 'hr', 'inline_code']] => [['emoji', 'hr', ['text', { marks: {} }]]]
          .map(item =>
            item
              .map(
                subItem =>
                  Array.isArray(specs[subItem])
                    ? specs[subItem]
                    : isString(subItem)
                      ? subItem
                      : // Now `NoMark` produces `items: []`, should be fixed in generator
                        ['text', subItem],
              )
              // Remove unsupported nodes & marks
              // Filter nodes
              .filter(
                subItem =>
                  // When Mark or `nodes` is undefined don't filter
                  Array.isArray(subItem) || !nodes
                    ? true
                    : nodes.indexOf(subItem) > -1,
              )
              // Filter marks
              .map(
                subItem =>
                  Array.isArray(subItem) && marks
                    ? /**
                       * TODO: Probably try something like immer, but it's 3.3kb gzipped.
                       * Not worth it just for this.
                       */
                      [
                        subItem[0],
                        {
                          ...subItem[1],
                          props: {
                            ...subItem[1].props,
                            marks: {
                              ...subItem[1].props.marks,
                              items: subItem[1].props.marks.items.map(_marks =>
                                _marks.filter(mark => marks.indexOf(mark) > -1),
                              ),
                            },
                          },
                        },
                      ]
                    : subItem,
              ),
          );
      }
    }

    newSpecs[k] = spec;
    return newSpecs;
  }, {});
}

function getOptionsForType(type: string, list?: Content): false | object {
  if (!list) {
    return {};
  }

  for (let i = 0, len = list.length; i < len; i++) {
    const spec = list[i];
    let name = spec;
    let options = {};
    if (Array.isArray(spec)) {
      [name, options] = spec;
    }
    if (name === type) {
      return options;
    }
  }
  return false;
}

function validateAttrs(spec: AttributesSpec, value): boolean {
  // extension_node parameters has no type
  if (!isDefined(spec.type)) {
    return !!spec.optional;
  }
  if (!isDefined(value)) {
    return !!spec.optional;
  }
  switch (spec.type) {
    case 'boolean':
      return isBoolean(value);
    case 'number':
      return (
        isNumber(value) &&
        (isDefined(spec.minimum) ? spec.minimum <= value : true) &&
        (isDefined(spec.maximum) ? spec.maximum >= value : true)
      );
    case 'string':
      return (
        isString(value) &&
        (isDefined(spec.minLength) ? spec.minLength! <= value.length : true) &&
        (spec.pattern ? new RegExp(spec.pattern).test(value) : true)
      );
    case 'object':
      return isPlainObject(value);
    case 'enum':
      return spec.values.indexOf(value) > -1;
  }
}

const getUnsupportedOptions = (spec?: ValidatorSpec) => {
  if (spec && spec.props && spec.props.content) {
    const {
      allowUnsupportedBlock,
      allowUnsupportedInline,
    } = spec.props.content;
    return { allowUnsupportedBlock, allowUnsupportedInline };
  }
  return {};
};

const invalidChildContent = (
  child: Entity,
  errorCallback?: ErrorCallback,
  parentSpec?: ValidatorSpec,
) => {
  const message = `${child.type}: invalid content.`;
  if (!errorCallback) {
    throw new Error(message);
  } else {
    return errorCallback(
      { ...child },
      {
        code: VALIDATION_ERRORS.INVALID_CONTENT,
        message,
      },
      getUnsupportedOptions(parentSpec),
    );
  }
};

export const enum VALIDATION_ERRORS {
  MISSING_PROPERTY = 'MISSING_PROPERTY',
  REDUNDANT_PROPERTIES = 'REDUNDANT_PROPERTIES',
  REDUNDANT_ATTRIBUTES = 'REDUNDANT_ATTRIBUTES',
  REDUNDANT_MARKS = 'REDUNDANT_MARKS',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_TEXT = 'INVALID_TEXT',
  INVALID_CONTENT = 'INVALID_CONTENT',
  INVALID_CONTENT_LENGTH = 'INVALID_CONTENT_LENGTH',
  INVALID_ATTRIBUTES = 'INVALID_ATTRIBUTES',
  DEPRECATED = 'DEPRECATED',
}

type ErrorMetadata = { [key: string]: any };

export interface ValidationError {
  code: VALIDATION_ERRORS;
  message: string;
  meta?: ErrorMetadata;
}

export type ErrorCallback = (
  entity: Entity,
  /**
   * I couldn't find any way to do index based typing for enum using TS 2.6.
   * We can change it to 'MISSING_PROPERTY' | 'REDUNDANT_PROPERTIES' | ...
   * if you need type for meta in future.
   */
  error: ValidationError,
  options: {
    allowUnsupportedBlock?: boolean;
    allowUnsupportedInline?: boolean;
  },
) => Entity | undefined;

// `loose` - ignore and filter extra props or attributes
export type ValidationMode = 'strict' | 'loose';

export interface ValidationOptions {
  mode?: ValidationMode;
  // Allow attributes starting with `__` without validation
  allowPrivateAttributes?: boolean;
}

export interface Output {
  valid: boolean;
  entity?: Entity;
}

export function validator(
  nodes?: Array<string>,
  marks?: Array<string>,
  options?: ValidationOptions,
) {
  const validatorSpecs = createSpec(nodes, marks);
  const { mode = 'strict', allowPrivateAttributes = false } = options || {};

  const validate = (
    entity: Entity,
    errorCallback?: ErrorCallback,
    allowed?: Content,
    parentSpec?: ValidatorSpec,
  ): Output => {
    const { type } = entity;
    let newEntity = { ...entity };

    const err = (
      code: VALIDATION_ERRORS,
      msg: string,
      meta?: ErrorMetadata,
    ): Output => {
      const message = `${type}: ${msg}.`;
      if (errorCallback) {
        return {
          valid: false,
          entity: errorCallback(
            newEntity,
            { code, message, meta },
            getUnsupportedOptions(parentSpec),
          ),
        };
      } else {
        throw new Error(message);
      }
    };

    // Don't validate applicationCard
    if (type === 'applicationCard') {
      return err(
        VALIDATION_ERRORS.DEPRECATED,
        'applicationCard is not supported',
      );
    }

    if (type) {
      const typeOptions = getOptionsForType(type, allowed);
      if (typeOptions === false) {
        return err(VALIDATION_ERRORS.INVALID_TYPE, 'type not allowed here');
      }

      const spec = validatorSpecs[type];
      if (!spec) {
        return err(
          VALIDATION_ERRORS.INVALID_TYPE,
          `${type}: No validation spec found for type!`,
        );
      }

      const validator: ValidatorSpec = {
        ...spec,
        ...typeOptions,
        // options with props can override props of spec
        ...(spec.props
          ? { props: { ...spec.props, ...(typeOptions['props'] || {}) } }
          : {}),
      };

      if (validator) {
        // Required
        if (validator.required) {
          if (!validator.required.every(prop => isDefined(entity[prop]))) {
            return err(
              VALIDATION_ERRORS.MISSING_PROPERTY,
              'required prop missing',
            );
          }
        }

        if (validator.props) {
          // Accumulate the Content validator
          if (validator.props.content) {
          }

          // Check text
          if (validator.props.text) {
            if (
              isDefined(entity.text) &&
              !validateAttrs(validator.props.text, entity.text)
            ) {
              return err(
                VALIDATION_ERRORS.INVALID_TEXT,
                `'text' validation failed`,
              );
            }
          }

          // Content Length
          if (
            validator.props.content &&
            isDefined(validator.props.content.minItems) &&
            validator.props.content.minItems! >
              ((entity.content && entity.content.length) || 0)
          ) {
            const { minItems, ...rest } = validator.props.content;
            return err(
              VALIDATION_ERRORS.INVALID_CONTENT_LENGTH,
              `'content' should have more than ${minItems} child`,
              { minItems, rest },
            );
          }

          // Required Props
          if (
            !Object.keys(validator.props).every(
              v => validator.props![v].optional || entity[v],
            )
          ) {
            return err(
              VALIDATION_ERRORS.MISSING_PROPERTY,
              'required prop missing',
            );
          }

          // Attributes
          let validatorAttrs;
          // media attrs is an array
          if (Array.isArray(validator.props.attrs)) {
            const { type } = entity.attrs;
            if (!type) {
              // If there's no type then there's no way to validate other attrs
              return err(
                VALIDATION_ERRORS.INVALID_ATTRIBUTES,
                `'attrs' validation failed`,
                { attrs: ['type'] },
              );
            }
            const validatorPropsArr = validator.props.attrs.filter(
              attr => attr.props.type.values.indexOf(entity.attrs.type) > -1,
            );

            if (validatorPropsArr.length === 0) {
              return err(
                VALIDATION_ERRORS.INVALID_ATTRIBUTES,
                `'attrs' type '${type}' is invalid`,
                { attrs: ['type'] },
              );
            }

            validatorAttrs = validatorPropsArr[0];
          } else {
            validatorAttrs = validator.props.attrs;
          }

          // Attributes Validation
          if (validatorAttrs && validatorAttrs.props && entity.attrs) {
            const invalidAttrs = Object.keys(validatorAttrs.props).reduce(
              (attrs, k) =>
                validateAttrs(validatorAttrs.props[k], entity.attrs[k])
                  ? attrs
                  : attrs.concat(k),
              [] as Array<string>,
            );
            if (invalidAttrs.length) {
              return err(
                VALIDATION_ERRORS.INVALID_ATTRIBUTES,
                `'attrs' validation failed`,
                { attrs: invalidAttrs },
              );
            }
          }

          // Extra Props
          // Filter out private and required properties
          const props = Object.keys(entity).filter(
            k => !(validator.props![k] && !validator.props![k].optional),
          );

          if (!props.every(p => !!validator.props![p])) {
            if (mode === 'loose') {
              newEntity = { type };
              props
                .filter(p => !!validator.props![p])
                .reduce((acc, p) => copy(entity, acc, p), newEntity);
            } else {
              return err(
                VALIDATION_ERRORS.REDUNDANT_PROPERTIES,
                `redundant props found: ${props.join(', ')}`,
              );
            }
          }

          // Extra Attributes
          if (entity.attrs && validator.props) {
            const attrs = Object.keys(entity.attrs).filter(
              k => !(allowPrivateAttributes && k.startsWith('__')),
            );
            if (
              !validatorAttrs ||
              !attrs.every(a => !!validatorAttrs.props[a])
            ) {
              if (mode === 'loose') {
                newEntity.attrs = {};
                attrs
                  .filter(a => !!validatorAttrs.props![a])
                  .reduce(
                    (acc, p) => copy(entity.attrs, acc, p),
                    newEntity.attrs,
                  );
              } else {
                return err(
                  VALIDATION_ERRORS.REDUNDANT_ATTRIBUTES,
                  `redundant attributes found: ${attrs
                    .filter(a => !validatorAttrs.props![a])
                    .join(', ')}`,
                );
              }
            }
          }

          // Children
          if (validator.props.content) {
            if (entity.content) {
              newEntity.content = entity.content
                .map((child, index) => {
                  // Only go inside valid branch
                  const validSets = validator.props!.content!.items.filter(
                    set =>
                      /**
                       * Manually treat listItem content as Tuple,
                       * hopefully tsc has new AST for Tuple in v3.0
                       */
                      type === 'listItem'
                        ? true
                        : set.some(
                            // [p, hr, ...] or [p, [text, {}], ...]
                            spec =>
                              (Array.isArray(spec) ? spec[0] : spec) ===
                              child.type,
                          ),
                  );

                  if (validSets.length) {
                    /**
                     * In case of multiple valid branches, we are treating them as Tuple.
                     * Thought this assumption is incorrect but it works for us since we don't
                     * have any valid alternative branches.
                     */
                    const setIndex =
                      validSets.length > 1
                        ? Math.min(index, validSets.length - 1)
                        : 0;
                    const set = validSets[setIndex].filter(
                      item =>
                        (Array.isArray(item) ? item[0] : item) === child.type,
                    );

                    if (set.length === 0) {
                      return invalidChildContent(
                        child,
                        errorCallback,
                        validator,
                      );
                    }

                    /**
                     * When there's multiple possible branches try all of them.
                     * If all of them fails, throw the first one.
                     * e.g.- [['text', { marks: ['a'] }], ['text', { marks: ['b'] }]]
                     */
                    let firstError;
                    let firstChild;
                    for (let i = 0, len = set.length; i < len; i++) {
                      try {
                        const { valid, entity: newChildEntity } = validate(
                          child,
                          errorCallback,
                          [set[i]],
                          validator,
                        );
                        if (valid) {
                          return newChildEntity;
                        } else {
                          firstChild = firstChild || newChildEntity;
                        }
                      } catch (error) {
                        firstError = firstError || error;
                      }
                    }
                    if (!errorCallback) {
                      throw firstError;
                    } else {
                      return firstChild;
                    }
                  } else {
                    return invalidChildContent(child, errorCallback, validator);
                  }
                })
                .filter(Boolean);
            } else {
              return err(
                VALIDATION_ERRORS.MISSING_PROPERTY,
                'missing `content` prop',
              );
            }
          }

          // Marks
          if (entity.marks) {
            if (validator.props.marks) {
              const { items } = validator.props!.marks!;
              const marksSet = items.length ? items[0] : [];
              const newMarks = entity.marks
                .filter(
                  mark =>
                    mode === 'strict' && marks
                      ? marks.indexOf(mark.type) > -1
                      : true,
                )
                .map(
                  mark =>
                    validate(mark, errorCallback, marksSet, validator).entity,
                )
                .filter(Boolean) as Entity[];
              if (newMarks.length) {
                newEntity.marks = newMarks;
              } else {
                delete newEntity.marks;
              }
            } else {
              return err(VALIDATION_ERRORS.REDUNDANT_MARKS, 'redundant marks');
            }
          }
        } else {
          // If there's no validator.props then there shouldn't be any key except `type`
          if (Object.keys(entity).length > 1) {
            return err(
              VALIDATION_ERRORS.REDUNDANT_PROPERTIES,
              `redundant props found: ${Object.keys(entity).join(', ')}`,
            );
          }
        }
      }
    } else {
      return err(
        VALIDATION_ERRORS.INVALID_TYPE,
        'ProseMirror Node/Mark should contain a `type`',
      );
    }
    return { valid: true, entity: newEntity };
  };

  return validate;
}

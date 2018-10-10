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
    content?: { type: 'array'; items: Array<Array<string>>; minItems?: number };
    text?: AttributesSpec;
    marks?: { type: 'array'; items: Array<Array<string>>; maxItems?: number };
  };
  minItems?: number;
  required?: Array<string>;
}

// tslint:disable-next-line:triple-equals
const isDefined = x => x != null;

const isNumber = (x): x is number =>
  typeof x === 'number' && isFinite(x) && Math.floor(x) === x;

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

// Preprocess all spec
let specPreProcessed = false;
function preProcessSpecs() {
  if (specPreProcessed) {
    return;
  }
  specPreProcessed = true;
  Object.keys(specs).forEach(k => {
    const spec = specs[k];
    if (spec.props) {
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
            items: ((spec.props.content as any) || []).map(arr => arr.items),
          };
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
            item.map(
              subItem =>
                Array.isArray(specs[subItem]) ? specs[subItem] : subItem,
            ),
          );
      }
    }
  });
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

const invalidChildContent = (
  child: Entity,
  errorCallback?: ErrorCallback,
  parentContent?: Array<string>,
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
      parentContent || [],
    );
  }
};

export const enum VALIDATION_ERRORS {
  MISSING_PROPERTY,
  REDUNDANT_PROPERTIES,
  REDUNDANT_ATTRIBUTES,
  REDUNDANT_MARKS,
  INVALID_TYPE,
  INVALID_TEXT,
  INVALID_CONTENT,
  INVALID_CONTENT_LENGTH,
  INVALID_ATTRIBUTES,
  DEPRECATED,
}

type ErrorMetadata = { [key: string]: any };

export type ErrorCallback = (
  entity: Entity,
  /**
   * I couldn't find any way to do index based typing for enum using TS 2.6.
   * We can change it to 'MISSING_PROPERTY' | 'REDUNDANT_PROPERTIES' | ...
   * if you need type for meta in future.
   */
  error: {
    code: VALIDATION_ERRORS;
    message: string;
    meta?: ErrorMetadata;
  },
  parentContent: Array<string>,
) => Entity | undefined;
export type ValidationMode = 'strict' | 'loose';

export interface Output {
  valid: boolean;
  entity: Entity;
}

export interface ValidationOptions {
  // Ignore and filter extra props or attributes
  mode: ValidationMode;
}

export function validate(
  entity: Entity,
  errorCallback?: ErrorCallback,
  validationOptions: ValidationOptions = { mode: 'strict' },
  allowed?: Content,
  parentContentExpression: Array<string> = [],
): Output {
  preProcessSpecs();

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
        entity:
          errorCallback(
            newEntity,
            { code, message, meta },
            parentContentExpression,
          ) || newEntity,
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
    const options = getOptionsForType(type, allowed);
    if (options === false) {
      return err(VALIDATION_ERRORS.INVALID_TYPE, 'type not allowed here');
    }

    const spec = specs[type];
    if (!spec) {
      return err(
        VALIDATION_ERRORS.INVALID_TYPE,
        `${type}: No validation spec found for type!`,
      );
    }

    const validator: ValidatorSpec = {
      ...spec,
      ...options,
      // options with props can override props of spec
      ...(spec.props
        ? { props: { ...spec.props, ...(options['props'] || {}) } }
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
          return err(
            VALIDATION_ERRORS.INVALID_CONTENT_LENGTH,
            `'content' should have more than ${
              validator.props.content.minItems
            } child`,
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
        const props = Object.keys(entity);
        if (!props.every(p => !!validator.props![p])) {
          if (validationOptions.mode === 'loose') {
            newEntity = { type };
            props
              .filter(p => !!validator.props![p])
              .reduce((acc, p) => copy(entity, acc, p), newEntity);
          } else {
            return err(
              VALIDATION_ERRORS.REDUNDANT_PROPERTIES,
              `redundant props found: ${Object.keys(entity).join(', ')}`,
            );
          }
        }

        // Extra Attributes
        if (entity.attrs && validator.props) {
          const attrs = Object.keys(entity.attrs);
          if (!validatorAttrs || !attrs.every(a => !!validatorAttrs.props[a])) {
            if (validationOptions.mode === 'loose') {
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
                `redundant attributes found: ${Object.keys(entity.attrs).join(
                  ', ',
                )}`,
              );
            }
          }
        }

        // Children
        if (validator.props.content) {
          if (entity.content) {
            newEntity.content = entity.content.map((child, index) => {
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
                          (Array.isArray(spec) ? spec[0] : spec) === child.type,
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
                  item => (Array.isArray(item) ? item[0] : item) === child.type,
                );

                if (set.length === 0) {
                  return invalidChildContent(child, errorCallback);
                }

                /**
                 * When there's multiple possible branches try all of them.
                 * If all of them fails, throw the first one.
                 * e.g.- [['text', { marks: ['a'] }], ['text', { marks: ['b'] }]]
                 */
                let firstError;
                let firstChild;
                // Flatten content items
                const validatorContent =
                  (validator.props &&
                    validator.props.content &&
                    validator.props.content.items.reduce(
                      (xs, x) => xs.concat(x),
                      [],
                    )) ||
                  [];
                for (let i = 0, len = set.length; i < len; i++) {
                  try {
                    const { valid, entity: newChildEntity } = validate(
                      child,
                      errorCallback,
                      validationOptions,
                      [set[i]],
                      validatorContent,
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
                return invalidChildContent(child, errorCallback);
              }
            });
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
            const { items, maxItems } = validator.props!.marks!;
            /**
             * Kind of handling `maxItems` manually, can be fixed through generator.
             * Now NoMark produces `items: []`, we need it to be `items: [[]]`.
             */
            const allowed = maxItems === 0 ? [] : items[0] || [];
            const newMarks = entity.marks
              .map(
                child =>
                  validate(
                    child,
                    errorCallback,
                    validationOptions,
                    allowed,
                    allowed,
                  ).entity,
              )
              .filter(Boolean) as Entity[];
            newEntity.marks = newMarks.length ? newMarks : undefined;
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
}

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

export interface Output {
  valid: boolean;
  entity: Entity;
}

export type ErrorCallback = (entity: Entity, err: string) => Entity;

const invalidChildContent = (child: Entity, errorCallback?: ErrorCallback) => {
  const errMsg = `${child.type}: invalid content.`;
  if (!errorCallback) {
    throw new Error(errMsg);
  } else {
    return errorCallback({ ...child }, errMsg);
  }
};

export function validate(
  entity: Entity,
  errorCallback?: ErrorCallback,
  parentContent?: Content,
): Output {
  const { type } = entity;
  const newEntity = { ...entity };

  const err = (msg: string): Output => {
    const errMsg = `${type}: ${msg}.`;
    if (errorCallback) {
      return {
        valid: false,
        entity: errorCallback(newEntity, errMsg) as Entity,
      };
    } else {
      throw new Error(errMsg);
    }
  };

  // Don't validate applicationCard
  if (type === 'applicationCard') {
    return err('applicationCard is not supported');
  }

  if (type) {
    const options = getOptionsForType(type, parentContent);
    if (options === false) {
      return err('type not allowed here');
    }

    const spec = specs[type];
    if (!spec) {
      throw new Error(`${type}: No validation spec found for type!`);
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
          return err('required prop missing');
        }
      }

      if (validator.props) {
        // Accumulate the Content validator
        if (isString(validator.props.content)) {
          validator.props.content = specs[validator.props.content];
        }

        // It's possible to cache some of the values to improve performance
        if (validator.props.content) {
          // Normalize [{ type: 'array', items: []}]
          if (!validator.props.content.items) {
            validator.props.content = {
              type: 'array',
              items: ((validator.props.content as any) || []).map(
                arr => arr.items,
              ),
            };
          }
          validator.props.content.items = validator.props.content.items
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

        // Check text
        if (validator.props.text) {
          if (
            isDefined(entity.text) &&
            !validateAttrs(validator.props.text, entity.text)
          ) {
            return err(`'text' validation failed`);
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
          return err('required prop missing');
        }

        // Attributes
        let validatorProps;
        // media attrs is an array
        if (Array.isArray(validator.props.attrs)) {
          const { type } = entity.attrs;
          if (!type) {
            return err(`'attrs' validation failed`);
          }
          const validatorPropsArr = validator.props.attrs.filter(
            attr => attr.props.type.values.indexOf(entity.attrs.type) > -1,
          );

          if (validatorPropsArr.length === 0) {
            return err(`'attrs' type '${type}' is invalid`);
          }

          validatorProps = validatorPropsArr[0];
        } else {
          validatorProps = validator.props.attrs;
        }

        // Attributes Validation
        if (validatorProps && validatorProps.props) {
          if (
            entity.attrs &&
            !Object.keys(validatorProps.props).every(k =>
              validateAttrs(validatorProps.props[k], entity.attrs[k]),
            )
          ) {
            return err(`'attrs' validation failed`);
          }
        }

        // Extra Props
        if (!Object.keys(entity).every(k => !!validator.props![k])) {
          return err(`redundant props found: ${JSON.stringify(entity)}`);
        }

        // Extra Attributes
        if (entity.attrs && validator.props) {
          if (
            !validatorProps ||
            !Object.keys(entity.attrs).every(k => !!validatorProps.props[k])
          ) {
            return err(
              `redundant attributes found: ${JSON.stringify(entity.attrs)}`,
            );
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
                for (let i = 0, len = set.length; i < len; i++) {
                  try {
                    const { valid, entity: newChildEntity } = validate(
                      child,
                      errorCallback,
                      [set[i]],
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
            return err('missing `content` prop');
          }
        }

        // Marks
        if (entity.marks) {
          if (validator.props.marks) {
            const { items, maxItems } = validator.props!.marks!;
            newEntity.marks = entity.marks.map(
              child =>
                validate(
                  child,
                  errorCallback,
                  /**
                   * Kind of handling `maxItems` manually, can be fixed through generator.
                   * Now NoMark produces `items: []`, we need it to be `items: [[]]`.
                   */
                  maxItems === 0 ? [] : items[0] || [],
                ).entity,
            );
          } else {
            return err('redundant marks');
          }
        }
      } else {
        // If there's no validator.props then there shouldn't be any key except `type`
        if (Object.keys(entity).length > 1) {
          return err(`redundant props found: ${JSON.stringify(entity)}`);
        }
      }
    }
  } else {
    return err('ProseMirror Node/Mark should contain a `type`');
  }
  return { valid: true, entity: newEntity };
}

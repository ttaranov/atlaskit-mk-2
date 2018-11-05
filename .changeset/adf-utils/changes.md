* New validator API

### Breaking Change

**Old API**

```
export type ValidationMode = 'strict' | 'loose';

validator(
  nodes?: Array<string>,
  marks?: Array<string>,
  validationMode?: ValidationMode,
)
```

**New API**

We introduced a new `allowPrivateAttributes` option. It allows attributes starting with `__` without validation.

```
export type ValidationMode = 'strict' | 'loose';

export interface ValidationOptions {
  mode?: ValidationMode;
  allowPrivateAttributes?: boolean;
}

validator(
  nodes?: Array<string>,
  marks?: Array<string>,
  options?: ValidationOptions,
)
```

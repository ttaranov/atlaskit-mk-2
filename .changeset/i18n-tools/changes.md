Extract TypeScript based React Component translations without building it first

**New features**

* Support for extracting from TypeScript files (`.ts`, `.tsx`).
* A new `--ignore` flag for `push` command. It takes a list of comma separated globs. Default value is `"**/__tests__/**"`.

  Usage:

  ```
  i18n-tools pull --ignore "**/__tests__/**,**/__fixtures__/**"  packages/core/xyz
  ```

**Breaking**

* `--outputType` has been renamed to `--type` and now both `push` & `pull` commands accept it.
* `--searchDir` default value has been changed from `dist/es2015` to `src`.

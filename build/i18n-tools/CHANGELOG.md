# @atlaskit/i18n-tools

## 0.4.0
- [minor] [941a687](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/941a687):

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

## 0.3.1
- [patch] Add translations for help-dialog and colors [42a2916](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/42a2916)

## 0.3.0
- [minor] ED-5150 Editor i18n: Main toolbar [ef76f1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ef76f1f)

## 0.2.0
- [minor] Add pull support [d27b63b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d27b63b)

## 0.1.1
- [patch] Initial release [7d0f35d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d0f35d)

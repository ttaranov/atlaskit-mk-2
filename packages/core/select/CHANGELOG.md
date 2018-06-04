# @atlaskit/select

## 3.1.0
- [minor] Added `spacing` prop, which allows for a compact mode that supports 32px trigger height for single-select, bumped react-select to beta.6 [59ab4a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/59ab4a6)
- [minor] added `spacing` prop to support `compact` mode for single select.
- bumped react-select to beta.6, this includes the following changes:
  - `actionMeta` for `remove-value` and `pop-value` events now contain a `removedValue` property.
  - Fixed bug with `css` attribute being applied to DOM element in SingleValue.
  - selectValue now filters items based on getOptionValue method.
  - Added `createOptionPosition` prop for Creatable select, which allows the user to specify whether the createOption element displays as the first or last option in the menu.
  - Added touch handling logic to detect user intent to scroll the page when interacting with the select control.
## 3.0.2
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/modal-dialog@4.0.5
  - @atlaskit/checkbox@2.0.2
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 3.0.1
- [patch] Fix imports for creaetable, async and async creatable selects [92ae24e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92ae24e)

## 3.0.0
- [major] Update to react-select@beta.4, removed developer preview warning. Stable release [d05b9e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d05b9e5)
- BREAKING: Removed `maxValueHeight` prop and functionality, this is a breaking change that affects multi -value components predominantly. The control will now expand to accommodate contained values, as opposed to constraining to a maxValueHeight with a scrollable area.
- `Async`, `Creatable`, `AsyncCreatable` components now imported from `react-select` and not from `react-select/lib/*`.
- Internal cx implementation refactored to reduce specificity of css-in-js base styles. By default these base-styles will be overridden by css styles associated to provided class names.
- Fixed animated component bug where setting isSearchable to false would throw warnings in the console.
- Added a `classNamePrefix` prop which now controls the class names applied to internal components, `className` prop is now intended for adding a className to the bounding selectContainer only. If the classNamePrefix field is left undefined, then the className prop will currently fulfill both these roles, however a warning will be shown and _this functionality is intended to be deprecated in future releases_.
- Added --is-disabled className modifier to the default Option component
- Fixed IE11 issues around element overflow in the menuList, and scroll indicators in the control.
- Added multi-value keyboard navigation using left and right arrow keys.
- Added fix to ensure focus is on the input when the menu opens.

## 2.0.2
- [patch] Release to align @atlaskit/select styles and theme with ADG3 guideline.  [7468739](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7468739)

## 2.0.1

## 2.0.0
- [major] Classname prop added, if this is given a value we surface logical semantic classes prefixed with the supplied value to enable styling via css otherwise a generated hash value is used.W e also now export icon components from the components object to facilitate easier customisation.  Previously this behaviour was enforced, and classes were given semantic values and prefixed with ‘react-select’ by default (i.e. react-select__dropdown-indicator) . See the following commit for details  https://github.com/JedWatson/react-select/commit/109d1aadb585cc5fd113d03309d80bd59b5eaf9b Also in this release, IE 11 display bugfix for centre alligned elements in a flex parent, fix for react15 compatibility, fix for bug where long tail values were not being truncated properly in the control [8d19b24](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d19b24)

## 1.3.1
- [patch] Update react-select version to fix flowtype errors [240a083](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/240a083)

## 1.3.0
- [minor] Update react-select dep in @atlaskit/select to alpha.10 [4073781](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4073781)

## 1.2.0
- [minor] @atlaskit/select now exports the createFilter [df7d845](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df7d845)

## 1.1.1

- [patch] Re-export some exports from react-select for use in other packages. [eda9906](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/eda9906)

## 1.1.0
- [minor] Added default text-truncation behaviour for options in radio and checkbox selects [5b37cc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5b37cc1)

## 1.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 0.3.0
- [minor] Added Creatable and AsyncCreatable exports, added menuPortalTarget prop to portal select menu, updated selects to expose intenral focus and blur methods' [a7b06f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a7b06f4)

## 0.2.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 0.2.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 0.1.7
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 0.1.6
- [patch] Update to alpha.6 and cleanup CountrySelect [c972f53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c972f53)

## 0.1.5
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 0.1.4

- [patch] misc updates to select package [bd000c7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bd000c7)

## 0.1.3
- [patch] added temporary SelectWraper to demonstrate validation [0ef5343](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0ef5343)

## 0.1.2
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 0.1.1
- [patch] initial release of the select package [1b8e01d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1b8e01d)

## 0.1.0
- Initial release

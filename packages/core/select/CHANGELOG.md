# @atlaskit/select

## 6.1.2
- [patch] [0782e03"
d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0782e03"
d):

  - bumped react-select to 2.1.1 minor bug fixes including mirroring the logic for the backspace key to delete, and stripping theme props from Input and GroupHeading dom elements. See https://github.com/JedWatson/react-select/releases/tag/v2.1.1 for details

## 6.1.1
- [patch] fixed popupselect bug by replacing Fragment with div element containing the requisite event handlers [80dd688](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80dd688)

## 6.1.0
- [minor] Change tabSelectsValue to default to false in @atlaskit/select, bumped react-select dep to 2.1.0, see release logs for details https://github.com/JedWatson/react-select/releases/tag/2.1.0 [dd4cbea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd4cbea)

## 6.0.4
- [patch] fix issues with PopupSelect and NavigationSwitcher [b4e19c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b4e19c3)

## 6.0.3
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 6.0.2
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/checkbox@5.0.2
  - @atlaskit/form@4.0.10
  - @atlaskit/modal-dialog@7.0.2
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 6.0.1
- [patch] Fixing analytics events for checkbox/radio/select [3e428e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e428e3)

## 6.0.0
- [major] Bumped react-select dep from 2.0.0-beta.7 to 2.0.0. This includes a breaking change to custom components, the innerRef property is now declared on the root of the props object, as opposed to being part of the innerProps object passed to each component. For a full list of changes in 2.0.0 please see the react-select changelog here. https://github.com/JedWatson/react-select/blob/master/HISTORY.md [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)

## 5.0.19
- [patch] Added a multi-select example for PopupSelect [483a335](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/483a335)

## 5.0.18
- [patch] Updated dependencies [80e1925](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e1925)
  - @atlaskit/button@9.0.9
  - @atlaskit/form@4.0.5
  - @atlaskit/modal-dialog@7.0.1
  - @atlaskit/checkbox@5.0.0

## 5.0.17
- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/form@4.0.3
  - @atlaskit/icon@13.8.1
  - @atlaskit/tooltip@12.0.14
  - @atlaskit/modal-dialog@7.0.0

## 5.0.16
- [patch] Updated dependencies [9c66d4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c66d4d)
  - @atlaskit/form@4.0.2
  - @atlaskit/webdriver-runner@0.1.0

## 5.0.15
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 5.0.14
- [patch] Updated dependencies [d8d8107](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8d8107)
  - @atlaskit/form@4.0.0

## 5.0.13
- [patch] Using the latest popper to avoid recursive setState calls. [9dceca9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9dceca9)

## 5.0.11
- [patch] Updating datetime-picker and select styles [981b96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/981b96c)

## 5.0.10
- [patch] add switcher to nav-next ui components docs page [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)
- [none] Updated dependencies [e083d63](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e083d63)

## 5.0.9
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tooltip@12.0.9
  - @atlaskit/spinner@9.0.6
  - @atlaskit/modal-dialog@6.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/form@3.1.6
  - @atlaskit/checkbox@4.0.4
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 5.0.8
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/modal-dialog@6.0.6
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/checkbox@4.0.3
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/icon@13.2.4
  - @atlaskit/form@3.1.5

## 5.0.7
- [patch] Fix bug with Popup select not opening if target was an SVG object [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/checkbox@4.0.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/modal-dialog@6.0.5
  - @atlaskit/form@3.1.4

## 5.0.6
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [patch] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/tooltip@12.0.3
  - @atlaskit/modal-dialog@6.0.4
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/checkbox@4.0.1
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/icon@13.2.1
  - @atlaskit/form@3.1.3

## 5.0.5
- [patch] Removed incorrect min-height for forms. Fixed select dev dep range for form. [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
- [none] Updated dependencies [186a2ee](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/186a2ee)
  - @atlaskit/form@3.1.2

## 5.0.4
- [patch] Updated dependencies [25d6e48](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d6e48)
  - @atlaskit/form@3.1.1

## 5.0.3
- [patch] Updated dependencies [e33f19d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e33f19d)
  - @atlaskit/form@3.1.0

## 5.0.2
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/tooltip@12.0.1
  - @atlaskit/modal-dialog@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1

## 5.0.1
- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/form@3.0.1

## 5.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/form@3.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/modal-dialog@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/checkbox@4.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/form@3.0.0

## 4.5.2
- [patch] Update loading indicator to be inline with ADG3  [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)
- [none] Updated dependencies [da661fd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da661fd)

## 4.5.1
- [patch] fixed actionMeta not being passed to onChange of PopupSelect [83833be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83833be)
- [none] Updated dependencies [83833be](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83833be)

## 4.5.0
- [minor] atlaskit/select now invokes a makeAnimated function to wrap passed in components in default animated behaviour. As this invocation returns a new set of react components each time, we've also implemented a lightweight component cache using memoize-one and react-fast-compare. Additionally updates made to datetime-picker to not instantiate a new component on render everytime (for performance reasons as well as to satisfy our caching logic), we now also pass relevant state values through the select as props to be ingested by our custom components, instead of directly capturing them within lexical scope.  [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)
- [none] Updated dependencies [9b01264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b01264)

## 4.4.0
- [minor] Added nav-next "Switcher" component. Minor fixes and dep bump for select. [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)
- [none] Updated dependencies [ed5d8d1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ed5d8d1)

## 4.3.6
- [patch] ADG3 guideline allignemnt, updated padding and height, update colors for hover and active, update icons  [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)
- [none] Updated dependencies [b53da28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b53da28)

## 4.3.5
- [patch] Updated dependencies [60c715f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/60c715f)
  - @atlaskit/form@2.1.5

## 4.3.4
- [patch] Updated dependencies [a78cd4d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a78cd4d)
  - @atlaskit/icon@12.6.2

## 4.3.3
- [patch] Replace internal styled components with emotion styled components [415a64a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/415a64a)
- [none] Updated dependencies [415a64a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/415a64a)

## 4.3.2
- [patch] Updated dependencies [470a1fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/470a1fb)
  - @atlaskit/form@2.1.4

## 4.3.1
- [patch] Fix $FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [patch] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/tooltip@10.3.1
  - @atlaskit/modal-dialog@5.2.5
  - @atlaskit/button@8.2.2
  - @atlaskit/checkbox@3.1.2
  - @atlaskit/icon@12.3.1
  - @atlaskit/form@2.1.3

## 4.3.0
- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/tooltip@10.3.0
  - @atlaskit/button@8.2.0
  - @atlaskit/checkbox@3.1.0
  - @atlaskit/icon@12.2.0

## 4.2.3
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [patch] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/modal-dialog@5.2.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/checkbox@3.0.6
  - @atlaskit/icon@12.1.2
  - @atlaskit/form@2.1.2

## 4.2.2
- [patch] Added upgrade guide, updated atlaskit/docs dep on react-markings to expose md parser customisations [aef4aea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aef4aea)
- [none] Updated dependencies [aef4aea](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aef4aea)
  - @atlaskit/docs@4.2.0

## 4.2.1
- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/modal-dialog@5.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/checkbox@3.0.5
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 4.2.0
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/modal-dialog@5.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/checkbox@3.0.4
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 4.1.0
- [minor] Fix InlineDialog closing on Select option click. Added Select prop onClickPreventDefault which is enabled by default [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
- [minor] Updated dependencies [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)

## 4.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/modal-dialog@5.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/checkbox@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 4.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/modal-dialog@5.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/checkbox@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 3.2.0
- [minor] Add named export "CompositeSelect" to the Atlaskit select package [9c34042](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c34042)

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

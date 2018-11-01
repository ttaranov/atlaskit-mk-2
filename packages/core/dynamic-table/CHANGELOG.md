# @atlaskit/dynamic-table

## 10.0.16
- [patch] [85b3592](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85b3592):

  - Passes analytics event through onSetPage prop when pagination component is clicked on

## 10.0.15
- [patch] Fixing blank state for datetime-picker in Firefox.  [0e6d838](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0e6d838)

## 10.0.14
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 10.0.13
- [patch] Added space of 3x gridSize between table and pagination component [83a3471](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/83a3471)
- [patch] Updated dependencies [8276156](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8276156)
  - @atlaskit/pagination@8.0.0

## 10.0.12
- [patch] Pulling the shared styles from @atlaskit/theme and removed dependency on util-shraed-styles [7d51a09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d51a09)

## 10.0.11
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 10.0.9
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/toggle@5.0.6
  - @atlaskit/spinner@9.0.6
  - @atlaskit/dropdown-menu@6.1.8
  - @atlaskit/button@9.0.6
  - @atlaskit/avatar@14.0.8
  - @atlaskit/docs@5.0.6

## 10.0.8
- [patch] Bumping react-beautiful-dnd to version 9. Making use of use onBeforeDragStart for dynamic table [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)
- [none] Updated dependencies [9cbd494](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9cbd494)

## 10.0.7
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/toggle@5.0.5
  - @atlaskit/pagination@7.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/dropdown-menu@6.1.5
  - @atlaskit/avatar@14.0.6

## 10.0.6
- [patch] Bumping react-beautiful-dnd to 8.0.7 to fix timing issue with onDragStart [812a39c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/812a39c)

## 10.0.5
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/toggle@5.0.4
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/pagination@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/dropdown-menu@6.1.4
  - @atlaskit/avatar@14.0.5

## 10.0.4
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/toggle@5.0.3
  - @atlaskit/pagination@7.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/dropdown-menu@6.1.3
  - @atlaskit/avatar@14.0.4

## 10.0.3
- [patch] Upgrading react-beautiful-dnd to 8.0.1 [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [patch] Upgrading react-beautiful-dnd to 8.0.0 [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)
- [none] Updated dependencies [87cd977](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87cd977)
- [none] Updated dependencies [22efc08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/22efc08)

## 10.0.2
- [patch] Upgrading react-beautiful-dnd to 8.0.5 [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)
- [none] Updated dependencies [6052132](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6052132)

## 10.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/toggle@5.0.1
  - @atlaskit/pagination@7.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/dropdown-menu@6.1.2
  - @atlaskit/avatar@14.0.2

## 10.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/pagination@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/toggle@5.0.0
  - @atlaskit/pagination@7.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/dropdown-menu@6.0.0
  - @atlaskit/avatar@14.0.0

## 9.2.6


- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0
  - @atlaskit/button@8.2.5
  - @atlaskit/dropdown-menu@5.2.3

## 9.2.5
- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0
  - @atlaskit/dropdown-menu@5.2.2

## 9.2.4
- [patch] Remove or update $FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/dropdown-menu@5.2.1
  - @atlaskit/avatar@11.2.2

## 9.2.3
- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 9.2.2
- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 9.2.1
- [patch] Upgrading react-beautiful-dnd dependency to ^7.1.3 [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)
- [none] Updated dependencies [024b7fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/024b7fb)

## 9.2.0
- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/spinner@7.1.0
  - @atlaskit/dropdown-menu@5.1.0
  - @atlaskit/avatar@11.2.0

## 9.1.2
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/toggle@4.0.3
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/pagination@6.0.5
  - @atlaskit/dropdown-menu@5.0.4

## 9.1.1
- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/spinner@7.0.1
  - @atlaskit/dropdown-menu@5.0.3
  - @atlaskit/button@8.1.1
  - @atlaskit/pagination@6.0.4
  - @atlaskit/avatar@11.1.1
  - @atlaskit/docs@4.1.1

## 9.1.0
- [minor] Update examples [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/dropdown-menu@5.0.2
  - @atlaskit/avatar@11.1.0
  - @atlaskit/toggle@4.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/pagination@6.0.3
  - @atlaskit/button@8.1.0

## 9.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/toggle@4.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/pagination@6.0.1
  - @atlaskit/docs@4.0.1
  - @atlaskit/dropdown-menu@5.0.1
  - @atlaskit/avatar@11.0.1

## 9.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/toggle@4.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/pagination@6.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/dropdown-menu@5.0.0
  - @atlaskit/avatar@11.0.0

## 8.1.0
- [minor] Add paginationi18n prop to dynamic-table which passes this to the i18n of its pagination component [08054b1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/08054b1)

## 8.0.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/toggle@3.0.2
  - @atlaskit/dropdown-menu@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/pagination@5.0.1
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4

## 8.0.1
- [patch] Remove unused dependencies [3cfb3fe](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3cfb3fe)

## 8.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 7.2.2
- [patch] Combines stateless and stateful components into one. Deletes stateless export. Renames pagination props. [a4b6c86](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4b6c86)

## 7.2.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 7.2.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 7.1.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 7.1.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 7.1.0
- [minor] Added possibility to drag and drop rows in dynamic table. [e69e6f4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e69e6f4)

## 7.0.1
- [patch] package bump to resolve discrepencies with npm [be745da](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/be745da)

## 6.2.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.5
- [patch] Fix manual bump bug from migration [fefd96c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fefd96c)

## 7.0.0
- There were no major changes in this release.

## 6.1.4
- [patch] fix examples so that name is truly sortable, resolve prop error, fix rowCellType key prop type [e5981fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e5981fb)

## 6.1.3
- [patch] Migrate dynamic-table to ak-mk-2 repo  [8402863](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8402863)

## 6.1.2 (2017-12-07)
* bug fix; add story to demonstrate toggling pagination (issues closed: ak-3052) ([3f66ce8](https://bitbucket.org/atlassian/atlaskit/commits/3f66ce8))

## 6.1.1 (2017-11-15)
* bug fix; bumping internal dependencies to the latest major versions ([dd59c0a](https://bitbucket.org/atlassian/atlaskit/commits/dd59c0a))

## 6.1.0 (2017-11-13)
* feature; add a loading state to the dynamic table ([08974ae](https://bitbucket.org/atlassian/atlaskit/commits/08974ae))

## 6.0.2 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.0.1 (2017-10-22)
* bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))

## 6.0.0 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 5.0.0 (2017-08-11)
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.5.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.5.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.2.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.2.0 (2017-07-17)
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 4.1.0 (2017-07-12)
* fix; removes rowIndex prop from body render method ([9394455](https://bitbucket.org/atlassian/atlaskit/commits/9394455))

## 4.0.1 (2017-07-10)
* fix; fixes '0' being displayed when rows prop is empty array ([8ce1453](https://bitbucket.org/atlassian/atlaskit/commits/8ce1453))
* fix; fixes react console error by adding key prop to TableRow in render method of Body ([c2e08cb](https://bitbucket.org/atlassian/atlaskit/commits/c2e08cb))
* feature; updates pagination dependency to 3.1.0 to get ellipsis when there are lots of pages ([391db73](https://bitbucket.org/atlassian/atlaskit/commits/391db73))

## 4.0.0 (2017-07-03)
* fix; updates dynamic-table to always display table header ([ee35148](https://bitbucket.org/atlassian/atlaskit/commits/ee35148))
* fix; updates dynamic-table to have headerless emptyView ([aa87745](https://bitbucket.org/atlassian/atlaskit/commits/aa87745))
* fix; updates tests to check against Component not string ([a91743b](https://bitbucket.org/atlassian/atlaskit/commits/a91743b))
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* updates description for dynamic-table stories ([bde2081](https://bitbucket.org/atlassian/atlaskit/commits/bde2081))
* breaking; Table will now render the Header by default, even if no rows are displayed

## 3.0.0 (2017-05-24)
* refactor dynamic-table as part of styled-components refactor ([3f52aff](https://bitbucket.org/atlassian/atlaskit/commits/3f52aff))
* breaking; DynamicTable export renamed to DynamicTableStateless, for consistency with other packages.
* ISSUES CLOSED: #AK-2385

## 2.1.5 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.1.4 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.1.3 (2017-03-23)
* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.1.1 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.1.0 (2017-03-08)
* feature; use createError helper function from util-common package ([3466262](https://bitbucket.org/atlassian/atlaskit/commits/3466262))

## 2.0.1 (2017-03-08)
* fix; import DynamicTable from its own package ([61f6e86](https://bitbucket.org/atlassian/atlaskit/commits/61f6e86))

## 1.0.0 (2017-03-07)
* fix; pR suggestions ([aee611e](https://bitbucket.org/atlassian/atlaskit/commits/aee611e))
* feature; dynamicTable component ([9861b3e](https://bitbucket.org/atlassian/atlaskit/commits/9861b3e))

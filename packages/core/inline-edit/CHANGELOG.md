# @atlaskit/inline-edit

## 7.1.2
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.1.1
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-base@11.0.8
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/multi-select@11.0.7
  - @atlaskit/tag@6.0.8
  - @atlaskit/icon@14.0.0

## 7.1.0
- [minor] Moved the internal @atlaskit/input component to a named export of inline-edit [c96c668](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c96c668)

## 7.0.8
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.6
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/tag@6.0.5
  - @atlaskit/multi-select@11.0.5
  - @atlaskit/input@4.0.4
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-text@7.0.6
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.5
- [patch] Remove blur of FieldBase wrapper when isEditing is false to fix edited fields not showing focus [75f032b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f032b)
- [patch] Updated dependencies [75f032b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75f032b)

## 7.0.4
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-base@11.0.3
  - @atlaskit/multi-select@11.0.4
  - @atlaskit/input@4.0.3
  - @atlaskit/field-text@7.0.4
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/tag@6.0.4
  - @atlaskit/tag-group@6.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/icon@13.2.4

## 7.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/icon@13.2.2
  - @atlaskit/tag@6.0.3
  - @atlaskit/tag-group@6.0.3
  - @atlaskit/multi-select@11.0.3
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/input@4.0.2
  - @atlaskit/field-text@7.0.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/field-base@11.0.2

## 7.0.2
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/field-base@11.0.1
  - @atlaskit/input@4.0.1
  - @atlaskit/field-text@7.0.2
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/tag@6.0.2
  - @atlaskit/tag-group@6.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/icon@13.2.1

## 7.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/multi-select@11.0.1
  - @atlaskit/field-text@7.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/tag@6.0.1
  - @atlaskit/tag-group@6.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/field-radio-group@4.0.1

## 7.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/multi-select@11.0.0
  - @atlaskit/input@4.0.0
  - @atlaskit/field-text@7.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/tag@6.0.0
  - @atlaskit/tag-group@6.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/icon@13.0.0

## 6.2.0
- [minor] Updated prop description for button. Added button label props for inline-edit accessibility. [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)
- [none] Updated dependencies [11205df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11205df)
  - @atlaskit/button@8.2.6

## 6.1.4
- [patch] Remove or update $FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/field-text@6.1.1
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1

## 6.1.3
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/multi-select@10.1.2
  - @atlaskit/input@3.0.2
  - @atlaskit/field-text@6.0.4
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/tag@5.0.4
  - @atlaskit/tag-group@5.1.1
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/icon@12.1.2

## 6.1.2
- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/tag@5.0.3
  - @atlaskit/multi-select@10.1.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/field-radio-group@3.0.3
  - @atlaskit/field-base@10.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1

## 6.1.1
- [patch] Updated dependencies [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)
  - @atlaskit/input@3.0.1
  - @atlaskit/field-text@6.0.3

## 6.1.0
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/tag-group@5.1.0
  - @atlaskit/tag@5.0.2
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-text@6.0.2
  - @atlaskit/multi-select@10.1.0
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0


## 6.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/tag@5.0.1
  - @atlaskit/tag-group@5.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/field-base@10.0.1
  - @atlaskit/field-text@6.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/tag@5.0.0
  - @atlaskit/tag-group@5.0.0
  - @atlaskit/multi-select@10.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/field-base@10.0.0
  - @atlaskit/input@3.0.0
  - @atlaskit/field-text@6.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 5.0.2
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/tag@4.1.1
  - @atlaskit/tag-group@4.0.1
  - @atlaskit/multi-select@9.0.2
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/field-base@9.0.3
  - @atlaskit/input@2.0.2
  - @atlaskit/field-text@5.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 5.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.6.3
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 4.6.2
- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 4.6.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.5.18
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.5.17
- [patch] Fix inline edit not stretching all edit views correctly [f45f667](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f45f667)

## 4.5.16
- [patch] tweaks confirm and cancel button sizes and position [f416077](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f416077)

## 4.5.15
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 4.5.13
- [patch] bump mention to 9.1.1 to fix mention autocomplete bug [c7708c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c7708c6)

## 4.5.10
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 4.5.9
- [patch] Updated inline-edit test type, migrated item, updated pagination imports to account for removed root index file [b48c074](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b48c074)

## 4.5.8
- [patch] Manually bumped package ver to account for desync between ak and ak mk 2 versions [5518730](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5518730)

## 4.5.7
- [patch] Migrated to new mk2 repo & build system  [99089df](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99089df)

## 4.5.6 (2017-11-30)
* bug fix; release stories with fixed console errors ([3321c2b](https://bitbucket.org/atlassian/atlaskit/commits/3321c2b))

## 4.5.5 (2017-11-14)
* bug fix; fix inline-edit component edit mode triggering when clicking outside hover width (issues closed: ak-3800) ([16fd4c0](https://bitbucket.org/atlassian/atlaskit/commits/16fd4c0))

## 4.5.4 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.5.3 (2017-10-22)
* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 4.5.2 (2017-10-15)
* bug fix; update dependencies for react 16 compatibility ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 4.5.1 (2017-10-05)
* bug fix; stop invalid icon being pushed out of the field box and therefore hidden ([e65c163](https://bitbucket.org/atlassian/atlaskit/commits/e65c163))

## 4.5.0 (2017-09-19)
* feature; allow readview of inline-edit to fit container width (issues closed: #ak-3118) ([652edaf](https://bitbucket.org/atlassian/atlaskit/commits/652edaf))

## 4.4.6 (2017-09-06)
* bug fix; text in inline edit readview can be highlighted (issues closed: #ak-2685) ([3b99f10](https://bitbucket.org/atlassian/atlaskit/commits/3b99f10))

## 4.4.5 (2017-09-05)
* bug fix; inline edit wraps correctly using tags in ie11 (issues closed: #ak-3261) ([b894b85](https://bitbucket.org/atlassian/atlaskit/commits/b894b85))
* bug fix; cause wrap of multi-select to be respected ([751ba47](https://bitbucket.org/atlassian/atlaskit/commits/751ba47))
* bug fix; fixes lots of alignment issues with field-base, including using tag-groups in the vi ([db40514](https://bitbucket.org/atlassian/atlaskit/commits/db40514))
* bug fix; changing the Edit button for inline-edit to not submit forms ([5b4d16c](https://bitbucket.org/atlassian/atlaskit/commits/5b4d16c))

## 4.4.4 (2017-08-21)
* bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 4.4.3 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 4.4.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 4.4.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 4.1.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 4.1.0 (2017-07-17)
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-05-30)
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* refactored inline-edit to styled-components ([c4dae85](https://bitbucket.org/atlassian/atlaskit/commits/c4dae85))
* breaking; Now exports InlineEdit (default) and InlineEditStateless
* ISSUES CLOSED: AK-2389

## 2.3.3 (2017-05-19)
* fix; update dependencies ([eb22a43](https://bitbucket.org/atlassian/atlaskit/commits/eb22a43))

## 2.3.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.3.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.3.0 (2017-04-20)
* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.2.1 (2017-04-18)
* fix; remove ignoring clicks on the icon ([c5d6a3c](https://bitbucket.org/atlassian/atlaskit/commits/c5d6a3c))

## 2.2.0 (2017-03-28)
* feature; add isInvalid and inlineMessage props, which display a warning icon and warning dia ([d08665e](https://bitbucket.org/atlassian/atlaskit/commits/d08665e))
* feature; update inline dialog to display the warning dialog only when the field is focused ([b6fb4f6](https://bitbucket.org/atlassian/atlaskit/commits/b6fb4f6))

## 2.0.9 (2017-03-23)
* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.0.7 (2017-03-21)
* fix; remove the style wrapper for edit views with no field-base ([a380dfc](https://bitbucket.org/atlassian/atlaskit/commits/a380dfc))
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.0.6 (2017-03-20)
* feature; shouldWrapEditViewWithFieldBase prop on inline-edit and style fixes for single-sele ([4946f21](https://bitbucket.org/atlassian/atlaskit/commits/4946f21))

## 2.0.5 (2017-02-28)
* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 2.0.3 (2017-02-28)
* fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 2.0.3 (2017-02-28)
* fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 2.0.2 (2017-02-28)
* fix; adds usage.md for inline-edit, adds docs (no class was present previously), removes jsdoc ([459da9e](https://bitbucket.org/atlassian/atlaskit/commits/459da9e))

## 2.0.1 (2017-02-27)
* empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 2.0.0 (2017-02-24)
* fix; fixes AK-1786: Buttons moved to bottom-right ([5ccc241](https://bitbucket.org/atlassian/atlaskit/commits/5ccc241))
* fix; fixes AK-1787: buttons with z-index + shadow ([014af88](https://bitbucket.org/atlassian/atlaskit/commits/014af88))
* fix; fixes AK-1788 remove pencil icon onHover ([00a2d3b](https://bitbucket.org/atlassian/atlaskit/commits/00a2d3b))
* fix; fixes AK-1789 adds a hasSpinner to field-base + inline-edit update to use it ([32de1d0](https://bitbucket.org/atlassian/atlaskit/commits/32de1d0))
* fix; fixes AK-1813 ie11 / safari / firefox missalignments ([55ed568](https://bitbucket.org/atlassian/atlaskit/commits/55ed568))
* fix; fixes missing focus styles on field base after tabbing ([0b26516](https://bitbucket.org/atlassian/atlaskit/commits/0b26516))
* fix; inline-edit updated to use isLoading instead of hasSpinner ([313abe3](https://bitbucket.org/atlassian/atlaskit/commits/313abe3))
* fix; spinner related tests fixed ([e6d8ad5](https://bitbucket.org/atlassian/atlaskit/commits/e6d8ad5))
* fix; storybook clean up and button margin fixed ([e06b9c5](https://bitbucket.org/atlassian/atlaskit/commits/e06b9c5))
* breaking; specs 1.2

## 1.0.4 (2017-02-16)
* fix; fix inconsistent stories when pressing enter on edit mode ([76c3904](https://bitbucket.org/atlassian/atlaskit/commits/76c3904))
* fix; fixes a bug when inline-edit switch to read view programatically ([3a93e51](https://bitbucket.org/atlassian/atlaskit/commits/3a93e51))
* fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.0.3 (2017-02-09)
* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-07)
* fix; update field base to the lates version and fix inline edit ([1a33181](https://bitbucket.org/atlassian/atlaskit/commits/1a33181))

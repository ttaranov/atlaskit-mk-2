# @atlaskit/inline-dialog

## 9.0.9
- [patch] [d296df8"
d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d296df8"
d):

  - Inline-dialog now has useCapture: true for the outside click event listeners to avoid closing when clicking on child content that might disappear, such as a select or dropdown-menu

## 9.0.8
- [patch] Updated dependencies [1a752e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1a752e6)
  - @atlaskit/datetime-picker@6.3.13
  - @atlaskit/popper@0.3.0

## 9.0.7
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.0.6
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/datetime-picker@6.3.11
  - @atlaskit/select@6.0.2
  - @atlaskit/single-select@6.0.6
  - @atlaskit/icon@14.0.0

## 9.0.5
- [patch] Updated dependencies [4194aa4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4194aa4)
  - @atlaskit/datetime-picker@6.3.10
  - @atlaskit/select@6.0.0

## 9.0.4
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.2
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/single-select@6.0.4
  - @atlaskit/select@5.0.9
  - @atlaskit/icon@13.2.5
  - @atlaskit/datetime-picker@6.3.2
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 9.0.1
- [patch] Added z-index back and fixed onClose [d9a0c62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9a0c62)
- [none] Updated dependencies [d9a0c62](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9a0c62)

## 9.0.0
- [major] Inline-dialog now uses @atlaskit/popper, and as such some props are no longer required. The "position" prop now matches the "placements" from react-popper to avoid confusion. [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)



- [none] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/datetime-picker@6.3.1
  - @atlaskit/popper@0.2.0
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/popper@0.2.0
  - @atlaskit/datetime-picker@6.3.1
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/datetime-picker@6.3.1
  - @atlaskit/popper@0.2.0
- [patch] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/popper@0.2.0
  - @atlaskit/datetime-picker@6.3.1

## 8.0.4
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/select@5.0.8
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/layer@5.0.4
  - @atlaskit/datetime-picker@6.1.1
  - @atlaskit/icon@13.2.4

## 8.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/select@5.0.7
  - @atlaskit/icon@13.2.2
  - @atlaskit/single-select@6.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/layer@5.0.3
  - @atlaskit/datetime-picker@6.0.3

## 8.0.2
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/select@5.0.6
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer@5.0.2
  - @atlaskit/datetime-picker@6.0.2
  - @atlaskit/icon@13.2.1

## 8.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/select@5.0.2
  - @atlaskit/single-select@6.0.1
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/datetime-picker@6.0.1

## 8.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/select@5.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/select@5.0.0
  - @atlaskit/single-select@6.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer@5.0.0
  - @atlaskit/datetime-picker@6.0.0
  - @atlaskit/icon@13.0.0

## 7.1.3
- [patch] Fix $FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/select@4.3.1
  - @atlaskit/single-select@5.2.1
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 7.1.2
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/select@4.2.3
  - @atlaskit/single-select@5.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer@4.0.3
  - @atlaskit/datetime-picker@5.2.1
  - @atlaskit/icon@12.1.2

## 7.1.1
- [patch] Update changelogs to remove duplicate [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
- [none] Updated dependencies [cc58e17](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cc58e17)
  - @atlaskit/theme@4.0.3
  - @atlaskit/single-select@5.1.1
  - @atlaskit/select@4.2.1
  - @atlaskit/icon@12.1.1
  - @atlaskit/button@8.1.1
  - @atlaskit/docs@4.1.1
  - @atlaskit/layer@4.0.2

## 7.1.0
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/single-select@5.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/layer@4.0.1
  - @atlaskit/button@8.1.0

## 7.0.2
- [patch] Fix InlineDialog closing on Select option click. Added Select prop onClickPreventDefault which is enabled by default [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
- [patch] Updated dependencies [11accbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/11accbd)
  - @atlaskit/select@4.1.0

## 7.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 7.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/icon@12.0.0
  - @atlaskit/single-select@5.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/layer@4.0.0

## 6.0.2
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/single-select@4.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4
  - @atlaskit/layer@3.1.1

## 6.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 5.3.2
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 5.3.1
- [patch] Removed focus ring from inline-dialogs focused via the mouse [a17adde](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a17adde)

## 5.3.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 5.2.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 5.2.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 5.2.0
- [minor] Updated inline-dialog to include boundaries element prop, updated Layer to have dynamic boolean escapeWithReference property, updated modal-dialog Content component with overflow-x:hidden' [cb72752](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cb72752)

## 5.1.2
- [patch] Revert name of stateless export to InlineEditStateless [fffacd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fffacd6)

## 5.1.1
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 5.1.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 5.0.7
- [patch] moved react-dom to peer dependency [214dd1f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/214dd1f)

## 5.0.6
- [patch] migrated inline dialog from ak to mk2 [9feaa91](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9feaa91)

## 5.0.5 (2017-11-24)
* bug fix; prevent inline-dialog from closing when event is prevented and prevent default for c (issues closed: ak-3870) ([8ae0c3b](https://bitbucket.org/atlassian/atlaskit/commits/8ae0c3b))

## 5.0.4 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 5.0.3 (2017-10-22)
* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 5.0.2 (2017-10-03)
* bug fix; refactored how inline-dialog handles max-width in order to better support scrollable ([20b62a6](https://bitbucket.org/atlassian/atlaskit/commits/20b62a6))

## 5.0.1 (2017-08-21)
* bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 5.0.0 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* bug fix; inline-dialog: fix vertical padding ([49d8c5d](https://bitbucket.org/atlassian/atlaskit/commits/49d8c5d))
* bug fix; inline-dialog: updates from design review ([ff38fa2](https://bitbucket.org/atlassian/atlaskit/commits/ff38fa2))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.0.0 (2017-08-11)
* bug fix; inline-dialog: fix vertical padding ([49d8c5d](https://bitbucket.org/atlassian/atlaskit/commits/49d8c5d))
* bug fix; inline-dialog: updates from design review ([ff38fa2](https://bitbucket.org/atlassian/atlaskit/commits/ff38fa2))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 3.6.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.6.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.3.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.2.1 (2017-07-13)
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 3.2.0 (2017-05-16)
* feature; bumping util-shared-styles in inline-dialog ([429e23a](https://bitbucket.org/atlassian/atlaskit/commits/429e23a))

## 3.1.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 3.1.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 3.1.0 (2017-04-18)
* feature; allow inline dialog to be closed via document click ([bdc7dc5](https://bitbucket.org/atlassian/atlaskit/commits/bdc7dc5))
* breaking; added ReactDOM as a peerDependency
* ISSUES CLOSED: AK-2069

## 2.0.0 (2017-03-31)
* refactor the inline-dialog component to use styled-components ([85294ec](https://bitbucket.org/atlassian/atlaskit/commits/85294ec))
* feature; Allow an array of positions to be passed to the shouldFlip property ([1a2a3f6](https://bitbucket.org/atlassian/atlaskit/commits/1a2a3f6))
* breaking; added peerDependency "styled-components”
* ISSUES CLOSED: AK-1988, AK-1996

## 1.1.0 (2017-03-28)
* feature; add onContentClick property to inline-dialog ([ff7404e](https://bitbucket.org/atlassian/atlaskit/commits/ff7404e))
* feature; add onContentFocus and onContentBlur properties to inline-dialog ([9cc1663](https://bitbucket.org/atlassian/atlaskit/commits/9cc1663))

## 1.0.7 (2017-03-23)
* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.5 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.4 (2017-02-20)
* fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-09)
* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-07)
* fix; allow inline dialog trigger to take full width ([38325fc](https://bitbucket.org/atlassian/atlaskit/commits/38325fc))

## 1.0.1 (2017-02-06)
* fix; Updates package to use scoped ak packages ([38fca7c](https://bitbucket.org/atlassian/atlaskit/commits/38fca7c))

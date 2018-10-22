# @atlaskit/flag

## 9.1.2
- [patch] Updated dependencies [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 9.1.1
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 9.1.0
- [minor] Now the flag actions accept href and target [65af057](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65af057)
- [patch] Updated the flag actions to accept the href and target as props [43ac1ec](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/43ac1ec)

## 9.0.13
- [patch] Updated the flag to use atlaskit button [d2084ad](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2084ad)

## 9.0.12
- [patch] Updated the flag actions use gridSize and fontSize properly [3e7da11](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3e7da11)

## 9.0.11
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/field-radio-group@4.0.8
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 9.0.10
- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/portal@0.0.9

## 9.0.9
- [patch] Updated dependencies [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8
  - @atlaskit/layer-manager@5.0.11

## 9.0.8
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 9.0.6
- [patch] Updated flags to use atlaskit portal instead of Layer manger [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)
- [none] Updated dependencies [b9e6757](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9e6757)

## 9.0.5
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/spinner@9.0.6
  - @atlaskit/layer-manager@5.0.6
  - @atlaskit/icon@13.2.5
  - @atlaskit/field-radio-group@4.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 9.0.4
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/spinner@9.0.5
  - @atlaskit/field-radio-group@4.0.4
  - @atlaskit/layer-manager@5.0.5
  - @atlaskit/icon@13.2.4

## 9.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/layer-manager@5.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/field-radio-group@4.0.3
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/spinner@9.0.4
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 9.0.2
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/spinner@9.0.3
  - @atlaskit/field-radio-group@4.0.2
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 9.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/spinner@9.0.2
  - @atlaskit/docs@5.0.1
  - @atlaskit/field-radio-group@4.0.1

## 9.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/spinner@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/field-radio-group@4.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 8.2.0
- [minor] Reduce autodismiss flag duration from 15 seconds to 8 seconds [5f6ec84](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5f6ec84)

## 8.1.5
- [patch] Remove or update $FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4
  - @atlaskit/field-radio-group@3.1.3
  - @atlaskit/icon@12.6.1

## 8.1.4
- [patch] Button should be a dev dependency [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)
- [none] Updated dependencies [50ca31b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/50ca31b)

## 8.1.3
- [patch] Updated dependencies [cdba8b3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cdba8b3)
  - @atlaskit/spinner@8.0.0
  - @atlaskit/button@8.2.3

## 8.1.2
- [patch] Fix $FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/spinner@7.1.1
  - @atlaskit/field-radio-group@3.1.2
  - @atlaskit/icon@12.3.1

## 8.1.1
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/spinner@7.0.2
  - @atlaskit/field-radio-group@3.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 8.1.0
- [patch] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/spinner@7.0.0
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/field-radio-group@3.0.2
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 8.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/field-radio-group@3.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/spinner@6.0.1
  - @atlaskit/docs@4.0.1

## 8.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/field-radio-group@3.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/spinner@6.0.0
  - @atlaskit/docs@4.0.0

## 7.0.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/field-radio-group@2.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/spinner@5.0.2
  - @atlaskit/docs@3.0.4

## 7.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.5.3
- [patch] Export the AppearanceTypes type [d38fc10](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d38fc10)

## 6.5.2
- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 6.5.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.5.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.4.6
- [patch] adds aria-expanded value to expander button in flag [7de4577](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7de4577)

## 6.4.5
- [patch] updates Flag to closer match ADG spec [5392b60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5392b60)

## 6.4.4
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.4.2
- [patch] Remove babel-plugin-react-flow-props-to-prop-types [06c1f08](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/06c1f08)

## 6.4.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.4.0
- [minor] Update buttonIcon size depending if CrossIcon or ChevronIcon [16bf4e5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/16bf4e5)

## 6.3.0
- [minor] Update the expand button to medium size [05d8bd5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d8bd5)

## 6.2.2
- [patch] Migrate Navigation from Ak repo to ak mk 2 repo, Fixed flow typing inconsistencies in ak mk 2 [bdeef5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bdeef5b)

## 6.2.1
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 6.2.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.1.9
- [patch] migrated flag to mk2 [630489e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/630489e)

## 6.1.8 (2017-11-22)
* bug fix; long messages in Flags start to wrap, not overflow content. ([b69c45f](https://bitbucket.org/atlassian/atlaskit/commits/b69c45f))

## 6.1.7 (2017-11-15)
* bug fix; fix flags within page components appearing behind navigation (issues closed: ak-1823) ([08e397e](https://bitbucket.org/atlassian/atlaskit/commits/08e397e))

## 6.1.6 (2017-11-13)
* bug fix; update flag's react-transition-group dependency from v1 to v2 (issues closed: ak-3755) ([32f3af3](https://bitbucket.org/atlassian/atlaskit/commits/32f3af3))

## 6.1.5 (2017-11-02)
* bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))

## 6.1.4 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.1.3 (2017-10-22)
* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 6.1.2 (2017-10-15)
* bug fix; update dependencies for react 16 compatibility ([fc47c94](https://bitbucket.org/atlassian/atlaskit/commits/fc47c94))

## 6.1.1 (2017-10-12)
* bug fix; bumps version of Page (issues closed: ak-3680) ([8713649](https://bitbucket.org/atlassian/atlaskit/commits/8713649))

## 6.1.0 (2017-08-17)
* feature; adding new AutoDismissFlag component (issues closed: ak-2974 ak-1503) ([9aa91c0](https://bitbucket.org/atlassian/atlaskit/commits/9aa91c0))

## 6.0.0 (2017-08-16)
* breaking; The Flag.id prop has been changed from optional to required. ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))
* breaking; FlagGroup no longer illegally reads Flag.props.key ([91f8dc4](https://bitbucket.org/atlassian/atlaskit/commits/91f8dc4))

## 5.0.1 (2017-08-15)
* bug fix; flag transitions between appearances smoothly, hides expand icon if not needed (issues closed: ak-2973 ak-3155) ([0766202](https://bitbucket.org/atlassian/atlaskit/commits/0766202))

## 5.0.0 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 4.0.0 (2017-08-11)
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))

## 3.4.4 (2017-08-04)
* bug fix; moves babel-plugin-react-flow-props-to-prop-types to a devDependency ([6378b88](https://bitbucket.org/atlassian/atlaskit/commits/6378b88))

## 3.4.3 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.2 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.1.0 (2017-07-17)
* fix; replace incorrect component description in Flag storybook ([2c42255](https://bitbucket.org/atlassian/atlaskit/commits/2c42255))
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-07-06)
* fix; add TransitionGroup to FlagGroup to handle lifecycle animations ([6dbb237](https://bitbucket.org/atlassian/atlaskit/commits/6dbb237))
* breaking; Removed shouldDismiss prop from Flag. Just set a FlagGroup's children declaratively and animation will be handled automatically with TransitionGroup (you don't need to wait until the flag has animated out before updating your state).
* ISSUES CLOSED: AK-2558

## 2.2.1 (2017-06-19)
* fix; bump Flag icon dependency to 7.x ([35bb4fa](https://bitbucket.org/atlassian/atlaskit/commits/35bb4fa))

## 2.2.0 (2017-06-05)
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* feature; added new optional bold flags, controlled by the Flag.appearance prop ([b78dca7](https://bitbucket.org/atlassian/atlaskit/commits/b78dca7))

## 2.1.2 (2017-05-12)
* fix; flag dismiss button focus style and spacing now correct ([c0130be](https://bitbucket.org/atlassian/atlaskit/commits/c0130be))

## 2.1.1 (2017-05-11)
* fix; bump modal-dialog dep, and change to a devDep ([d16f887](https://bitbucket.org/atlassian/atlaskit/commits/d16f887))

## 2.1.0 (2017-05-06)
* feature; allow flags to be dismissed programatically via shouldDismiss prop ([445dcb4](https://bitbucket.org/atlassian/atlaskit/commits/445dcb4))

## 2.0.4 (2017-05-02)
* fix; change to dependency on util-shared-styles to correct version ([a052c60](https://bitbucket.org/atlassian/atlaskit/commits/a052c60))

## 2.0.3 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.0.2 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.0.1 (2017-04-13)
* fix; update flag stories to use new readme component ([1c56c84](https://bitbucket.org/atlassian/atlaskit/commits/1c56c84))

## 2.0.0 (2017-04-04)
* refactor the flag component to use styled-components ([615208f](https://bitbucket.org/atlassian/atlaskit/commits/615208f))
* breaking; added peerDependency "styled-components”, removed dependency “classnames”
* ISSUES CLOSED: AK-2028

## 1.0.9 (2017-03-23)
* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.6 (2017-03-21)
* fix; accept JSX in description prop ([c986abf](https://bitbucket.org/atlassian/atlaskit/commits/c986abf))
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.5 (2017-02-27)
* fix; update flag's icon dependency to latest ([e60c12a](https://bitbucket.org/atlassian/atlaskit/commits/e60c12a))

## 1.0.4 (2017-02-20)
* fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.3 (2017-02-10)
* fix; Dummy commit to release components to registry ([5bac43b](https://bitbucket.org/atlassian/atlaskit/commits/5bac43b))

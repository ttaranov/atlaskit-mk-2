# @atlaskit/field-text

## 7.0.13
- [patch] [4035588"
d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4035588"
d):

  - Add isMonospaced prop

## 7.0.12
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 7.0.11
- [patch] FS-2963 When inserting a status, I can pick a colour from a predefined colour picker [a633d77](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a633d77)

## 7.0.10
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 7.0.9
- [patch] Removed FlowFixMe from proptypes, made FieldTextStatless props non-exact [626d9c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/626d9c3)

## 7.0.7
- [patch] Textfield and textarea components now play nicer with flex parents in IE [4e81369](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e81369)
- [none] Updated dependencies [4e81369](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e81369)

## 7.0.6
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/field-base@11.0.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 7.0.5
- [patch] Textfield and textarea now correctly show the invalid icon in Firefox and Edge. [4d5bcd9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d5bcd9)
- [none] Updated dependencies [4d5bcd9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4d5bcd9)

## 7.0.4
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/field-base@11.0.3
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3

## 7.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/field-base@11.0.2

## 7.0.2
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/field-base@11.0.1
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1

## 7.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 7.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/field-base@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0

## 6.1.3
- [patch] Fix flow config and add back flow fix me [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)
- [none] Updated dependencies [107da09](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/107da09)

## 6.1.2
- [patch] Fixes flow type in FieldText component [40095d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40095d6)
- [none] Updated dependencies [40095d6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40095d6)

## 6.1.1
- [patch] Remove or update $FlowFixMe [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
- [none] Updated dependencies [e8ad98a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e8ad98a)
  - @atlaskit/button@8.2.4

## 6.1.0
- [minor] Updated visual styles for textfield and textarea components to match latest ADG spec [37f5ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37f5ea5)
- [none] Updated dependencies [37f5ea5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/37f5ea5)
  - @atlaskit/field-base@10.2.0

## 6.0.4
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/field-base@10.1.2
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4

## 6.0.3
- [patch] Fixed disabled field colour in Safari [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)
- [none] Updated dependencies [b9f0068](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b9f0068)

## 6.0.2
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/field-base@10.1.0
  - @atlaskit/button@8.1.0

## 6.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/field-base@10.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 6.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/field-base@10.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 5.1.1
- [patch] Correct Flow type for FieldTextProps:onChange [adb2ce0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adb2ce0)
- [none] Updated dependencies [adb2ce0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/adb2ce0)

## 5.1.0
- [minor] Text fields and textareas now inherit their font-family correctly. [6859cf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6859cf6)
- [none] Updated dependencies [6859cf6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6859cf6)

## 5.0.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/field-base@9.0.3
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 5.0.1
- [patch] Form developer preview [d8b2b03](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d8b2b03)
- [patch] Form package developer preview release [9b28847](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9b28847)

## 5.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 4.3.0
- [minor] Update to React.ReactNode [cabf41c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cabf41c)
- [minor] Update to React.ReactNode [dc2ccc2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc2ccc2)
- [minor] Add type for invalidMessage [a520fe2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a520fe2)

## 4.2.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 4.2.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 4.1.8
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 4.1.7
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 4.1.6
- [patch] Minor documentation fixes [f0e96bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0e96bd)

## 4.1.5
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 4.1.4
- [patch] Migration to mk2 repo [786df25](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/786df25)

## 4.1.3 (2017-12-01)
* bug fix; fix field text types ([2f46ff0](https://bitbucket.org/atlassian/atlaskit/commits/2f46ff0))

## 4.1.2 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 4.1.1 (2017-10-22)
* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))

## 4.1.0 (2017-10-16)
* feature; added support for min and max values, for type=number (issues closed: ak-3701) ([8c9cf4b](https://bitbucket.org/atlassian/atlaskit/commits/8c9cf4b))
* feature; added support for relevant HTML input attrs and events (issues closed: ak-1743) ([b606a69](https://bitbucket.org/atlassian/atlaskit/commits/b606a69))

## 4.0.1 (2017-09-11)
* bug fix; standardise placeholders (issues closed: #ak-3406) ([95187e1](https://bitbucket.org/atlassian/atlaskit/commits/95187e1))
* bug fix; add placeholder color for light and dark mode ([0632c02](https://bitbucket.org/atlassian/atlaskit/commits/0632c02))

## 4.0.0 (2017-08-30)
* feature; bump field-base to add dark mode ([0d6bbc4](https://bitbucket.org/atlassian/atlaskit/commits/0d6bbc4))
* breaking; Add dark mode, remove util-shared-styles ([b6ae894](https://bitbucket.org/atlassian/atlaskit/commits/b6ae894))
* breaking; add dark mode to field text (issues closed: #ak-3339) ([b6ae894](https://bitbucket.org/atlassian/atlaskit/commits/b6ae894))

## 3.4.3 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))

## 3.4.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.0 (2017-06-08)
* convert fieldText to styled-components. ([a77faaa](https://bitbucket.org/atlassian/atlaskit/commits/a77faaa))
* breaking; Export FieldText renamed to FieldTextStateless for clarity and ease of main export usage.
* Refactor to styled-components
* ISSUES CLOSED: #AK-2387

## 2.7.0 (2017-05-31)
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* feature; add readonly support to field-text ([3c94731](https://bitbucket.org/atlassian/atlaskit/commits/3c94731))

## 2.6.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 2.6.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 2.6.0 (2017-04-20)
* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 2.5.0 (2017-04-11)
* feature; add support for maxLength to field-text ([1719bd2](https://bitbucket.org/atlassian/atlaskit/commits/1719bd2))

## 2.4.0 (2017-04-10)
* feature; adding spellcheck attribute to text input ([a34a3eb](https://bitbucket.org/atlassian/atlaskit/commits/a34a3eb))

## 2.3.3 (2017-03-23)
* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 2.3.1 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 2.3.0 (2017-03-20)
* feature; added a focus() method to field-text ([ab75130](https://bitbucket.org/atlassian/atlaskit/commits/ab75130))

## 2.2.1 (2017-03-08)
* fix; fix isFitContainerWidthEnabled prop to correctly fit container width ([79acc74](https://bitbucket.org/atlassian/atlaskit/commits/79acc74))

## 2.1.0 (2017-03-06)
* fix; fix disabled and required props and update tests for field-text ([7f9bf03](https://bitbucket.org/atlassian/atlaskit/commits/7f9bf03))
* feature; add support for autoFocus to field-text ([00041db](https://bitbucket.org/atlassian/atlaskit/commits/00041db))
* feature; use invalid state and message from field-base in field-text ([ae0afa1](https://bitbucket.org/atlassian/atlaskit/commits/ae0afa1))

## 2.0.6 (2017-02-24)
* Allow clear field hint to be hidden in MS browsers ([1c87945](https://bitbucket.org/atlassian/atlaskit/commits/1c87945))
* fix; Fix style for IE/Edge ([301d6d2](https://bitbucket.org/atlassian/atlaskit/commits/301d6d2))
* Make the IE style changes on by default, not configurable. ([55818df](https://bitbucket.org/atlassian/atlaskit/commits/55818df))

## 2.0.5 (2017-02-17)
* fix; missing FieldText export ([0f8a2bc](https://bitbucket.org/atlassian/atlaskit/commits/0f8a2bc))

## 2.0.3 (2017-02-13)
* fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
* fix; Make onChange have same signature as input onChange ([82f76d6](https://bitbucket.org/atlassian/atlaskit/commits/82f76d6))

## 2.0.2 (2017-02-07)
* update to the latest field base with the correct design ([ce38252](https://bitbucket.org/atlassian/atlaskit/commits/ce38252))

## 2.0.1 (2017-02-06)
* fix; fix onFocus and onBlur handlers ([c3c2314](https://bitbucket.org/atlassian/atlaskit/commits/c3c2314))
* fix; smart fieldText now works correctly with onChange handler ([40b1694](https://bitbucket.org/atlassian/atlaskit/commits/40b1694))

## 2.0.0 (2017-02-03)
* feature; dependency update. new props are added. ([c777259](https://bitbucket.org/atlassian/atlaskit/commits/c777259))
* breaking; field text now has the 8px grid alignment and much smaller padding at the top

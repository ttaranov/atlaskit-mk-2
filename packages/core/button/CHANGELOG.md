# @atlaskit/button

## 7.2.5
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/analytics-next@2.1.1
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 7.2.4
- [patch] Export types for Button [6a47d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a47d88)
- [none] Updated dependencies [6a47d88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6a47d88)

## 7.2.3
- [patch] Fix invalid css in button [2363d14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2363d14)
- [none] Updated dependencies [2363d14](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2363d14)

## 7.2.2
- [patch] Fix react ref dev warnings when using custom components [40b743c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40b743c)

## 7.2.1

## 7.2.0
- [minor] Add ariaLabel prop to button so that it can be passed to the underlying component [d7a1e7e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7a1e7e)

## 7.1.0
- [minor] Add `autoFocus` to button, allowing button to be automatically focused on first render. [bf36eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bf36eb6)

## 7.0.3
- [patch] Fix a react dev warning when using a custom component [8fb3bc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fb3bc1)

## 7.0.2
- [patch] Update empty state and button to have consistent types [f0da143](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f0da143)

## 7.0.1
- [patch] Update tests + flow [05d406d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/05d406d)
- [patch] Remove default props to have it optional [0907a36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0907a36)

## 7.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 6.6.4
- [patch] Updates flow types of withAnalyticsEvents and withAnalyticsContext HOCs [26778bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/26778bc)
- [patch] Uses element config flow type with button deprecation warnings hoc [a9aa90a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a9aa90a)

## 6.6.3
- [patch] added onBlur and onFocus hooks [27d01b7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/27d01b7)

## 6.6.2
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 6.6.1
- [patch] added selected focus state for button [dad190d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dad190d)

## 6.6.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 6.5.0
- [minor] Instrument button with analytics [4e84f5b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4e84f5b)

## 6.4.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 6.4.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 6.4.0
- [minor] id property on Button component is not propagated if href property is provided [7d46c81](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7d46c81)

## 6.3.1
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 6.3.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 6.2.0
- [minor] replace flow type to be less restrictive [a28cdbd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a28cdbd)

## 6.1.0
- [minor] Add theming to Button. Deprecate 'help' appearance from Button. [c14ea2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c14ea2e)
- [minor] Add theming to Button. Deprecate 'help' appearance from Button. [c14ea2e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c14ea2e)

## 6.0.0
- [major] Remove typescript [4635000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4635000)
- [major] Remove typescript [4635000](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4635000)
- [patch] Move button to new repo, tidy types [2dafda6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dafda6)
- [patch] Move button to new repo, tidy types [2dafda6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2dafda6)

## 5.4.14 (2017-12-01)

* bug fix; fix button group spacing (issues closed: ak-3978) ([f0037f2](https://bitbucket.org/atlassian/atlaskit/commits/f0037f2))
## 5.4.13 (2017-11-30)

* bug fix; fix disabled buttons with child elements propagating click events ([584ffdc](https://bitbucket.org/atlassian/atlaskit/commits/584ffdc))
## 5.4.12 (2017-11-27)

* bug fix; export interface for ts ([15c291c](https://bitbucket.org/atlassian/atlaskit/commits/15c291c))

## 5.4.11 (2017-11-27)

* bug fix; fix disabled buttons not swallowing click events (issues closed: ak-3646) ([80e976b](https://bitbucket.org/atlassian/atlaskit/commits/80e976b))

## 5.4.10 (2017-11-24)

* bug fix; fix button-group prop validation to ignore null children ([3f7f0c3](https://bitbucket.org/atlassian/atlaskit/commits/3f7f0c3))
## 5.4.9 (2017-11-21)

* bug fix; bumping internal dependencies to latest version ([5e81848](https://bitbucket.org/atlassian/atlaskit/commits/5e81848))
## 5.4.8 (2017-10-27)

* bug fix; correct formatting for user-select style ([fe9419c](https://bitbucket.org/atlassian/atlaskit/commits/fe9419c))
## 5.4.7 (2017-10-27)

* bug fix; change icon to be unselectable so button content can be copied ([e8c876a](https://bitbucket.org/atlassian/atlaskit/commits/e8c876a))
## 5.4.6 (2017-10-27)

* bug fix; updated button props typings ([c7a9c09](https://bitbucket.org/atlassian/atlaskit/commits/c7a9c09))

## 5.4.5 (2017-10-23)

* bug fix; support false/null/undefined children in ButtonGroup ([4667228](https://bitbucket.org/atlassian/atlaskit/commits/4667228))
## 5.4.4 (2017-10-22)

* bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))
## 5.4.3 (2017-10-16)

* bug fix; fix issue where invalid box-shadow style was applied (issues closed: ak-3704) ([a786038](https://bitbucket.org/atlassian/atlaskit/commits/a786038))
## 5.4.2 (2017-10-03)


* bug fix; improve button performance ([1bbf0d1](https://bitbucket.org/atlassian/atlaskit/commits/1bbf0d1))


## 5.4.1 (2017-09-27)

* bug fix; button will truncate if wider than its parent (issues closed: ak-3332) ([a701ea1](https://bitbucket.org/atlassian/atlaskit/commits/a701ea1))
## 5.4.0 (2017-09-22)

* feature; buttons no longer prevent text selection (issues closed: ak-3270) ([9ab343b](https://bitbucket.org/atlassian/atlaskit/commits/9ab343b))


## 5.3.0 (2017-09-18)


* feature; support new Help button appearance (issues closed: ak-3535) ([69728ed](https://bitbucket.org/atlassian/atlaskit/commits/69728ed))
## 5.2.0 (2017-09-12)

* feature; we need the ability to reference elements ([cbf5c12](https://bitbucket.org/atlassian/atlaskit/commits/cbf5c12))
## 5.1.2 (2017-09-08)

* bug fix; adding ButtonGroup to type declarations of button pckage. ([bb373c1](https://bitbucket.org/atlassian/atlaskit/commits/bb373c1))



## 5.1.1 (2017-08-24)


* bug fix; improved focus ring contrast for warning and danger buttons ([39ddda7](https://bitbucket.org/atlassian/atlaskit/commits/39ddda7))
## 5.1.0 (2017-08-23)

* bug fix; subtle-link button font colour is slightly updated (issues closed: ak-2480) ([510393a](https://bitbucket.org/atlassian/atlaskit/commits/510393a))
* feature; added warning (yellow) and danger (red) options to Button.appearance prop (issues closed: ak-2480) ([ba4cfde](https://bitbucket.org/atlassian/atlaskit/commits/ba4cfde))

## 5.0.1 (2017-08-16)

* bug fix; fix react warning about PropTypes ([6b4cd29](https://bitbucket.org/atlassian/atlaskit/commits/6b4cd29))

## 5.0.0 (2017-08-11)

* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* bug fix; button: fix focus box shadow ([9746e73](https://bitbucket.org/atlassian/atlaskit/commits/9746e73))
* bug fix; button: fix dark link color - default / hover / active ([7b85a29](https://bitbucket.org/atlassian/atlaskit/commits/7b85a29))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* feature; implement dark mode ([d959bb1](https://bitbucket.org/atlassian/atlaskit/commits/d959bb1))


## 4.0.0 (2017-08-11)


* bug fix; button: fix focus box shadow ([9746e73](https://bitbucket.org/atlassian/atlaskit/commits/9746e73))
* bug fix; button: fix dark link color - default / hover / active ([7b85a29](https://bitbucket.org/atlassian/atlaskit/commits/7b85a29))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* feature; implement dark mode ([d959bb1](https://bitbucket.org/atlassian/atlaskit/commits/d959bb1))


## 3.6.0 (2017-08-09)

* feature; export ButtonGroup from button package (issues closed: ak-2382) ([61682c6](https://bitbucket.org/atlassian/atlaskit/commits/61682c6))





## 3.5.3 (2017-07-27)


* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.5.2 (2017-07-25)


* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.5.1 (2017-07-20)


* fix; return focus ring to buttons ([94f1ad0](https://bitbucket.org/atlassian/atlaskit/commits/94f1ad0))

## 3.2.0 (2017-07-17)

## 3.2.0 (2017-07-17)

## 3.2.0 (2017-07-17)


* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))

## 3.2.0 (2017-07-17)


* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.1.0 (2017-07-10)


* feature; added functionality to have full-width buttons via optional prop ([ad7fae6](https://bitbucket.org/atlassian/atlaskit/commits/ad7fae6))

## 2.0.0 (2017-06-01)


* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))


null refactored button to styled-components ([de6465b](https://bitbucket.org/atlassian/atlaskit/commits/de6465b))


* breaking; refactored to styled-components

ISSUES CLOSED: AK-2381, AK-2300

## 1.1.4 (2017-05-25)


* fix; update util-shared-styles dependency in button ([159dd02](https://bitbucket.org/atlassian/atlaskit/commits/159dd02))

## 1.1.3 (2017-05-06)


* fix; link buttons with no spacing are now baseline aligned correctly ([66f5e65](https://bitbucket.org/atlassian/atlaskit/commits/66f5e65))

## 1.1.2 (2017-04-27)


* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)


* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)


* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.16 (2017-04-04)


* fix; adds defensive code to allow testing in mocha/jsdom ([3f9b72c](https://bitbucket.org/atlassian/atlaskit/commits/3f9b72c))

## 1.0.15 (2017-03-23)


* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.0.13 (2017-03-21)

## 1.0.13 (2017-03-21)


* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.12 (2017-03-14)

## 1.0.11 (2017-03-08)


* fix; fix subtle-link button to use the correct color default color ([c4c274d](https://bitbucket.org/atlassian/atlaskit/commits/c4c274d))

## 1.0.10 (2017-02-28)


* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.9 (2017-02-28)


* fix; dummy commit to fix broken stories and missing registry pages ([a31e92a](https://bitbucket.org/atlassian/atlaskit/commits/a31e92a))

## 1.0.8 (2017-02-28)


* fix; dummy commit to release stories for components ([a105c02](https://bitbucket.org/atlassian/atlaskit/commits/a105c02))

## 1.0.7 (2017-02-28)


* fix; Removes jsdoc annotations from button ([fe8e23b](https://bitbucket.org/atlassian/atlaskit/commits/fe8e23b))

## 1.0.6 (2017-02-24)


* fix; fixes AK-1787: buttons with z-index + shadow ([014af88](https://bitbucket.org/atlassian/atlaskit/commits/014af88))
* fix; spinner related tests fixed ([e6d8ad5](https://bitbucket.org/atlassian/atlaskit/commits/e6d8ad5))
* fix; storybook clean up and button margin fixed ([e06b9c5](https://bitbucket.org/atlassian/atlaskit/commits/e06b9c5))

## 1.0.5 (2017-02-20)


* fix; use correctly scoped package names in npm docs ([91dbd2f](https://bitbucket.org/atlassian/atlaskit/commits/91dbd2f))

## 1.0.4 (2017-02-16)


* fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))

## 1.0.3 (2017-02-09)


* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.0.2 (2017-02-09)


* fix; readme refactor to use util-readme ([1adf905](https://bitbucket.org/atlassian/atlaskit/commits/1adf905))

## 1.0.1 (2017-02-06)


* fix; Updates package to use ak scoped packages ([1262016](https://bitbucket.org/atlassian/atlaskit/commits/1262016))

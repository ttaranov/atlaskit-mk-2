# @atlaskit/tooltip

## 12.1.7
- [patch] [3b03f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3b03f52):

  - Use @atlaskit/popper internally instead of a custom approach to position management

## 12.1.6
- [patch] [7f1ff28](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7f1ff28):

  Fixes error when Tooltip attempts to setState on an unmounted component

## 12.1.5
- [patch] Updated dependencies [aaab348](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/aaab348)
  - @atlaskit/portal@0.0.12

## 12.1.4
- [patch] Adds missing implicit @babel/runtime dependency [b71751b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b71751b)

## 12.1.3
- [patch] onHide and onShow are now called in componentDidUpdate so they behave consistently between all hides and shows [e20f11a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e20f11a)

## 12.1.2
- [patch] Fix edgecase where when handleMouseOver was called before handleMouseEnter, causing the mouseCoordinates to be null, and the tooltip to render at the top left of the page [c2694aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c2694aa)

## 12.1.1
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/button@9.0.13
  - @atlaskit/portal@0.0.10
  - @atlaskit/icon@14.0.0

## 12.1.0
- [minor] Adds the new hideTooltipOnMouseDown was required since global-navigation and navigation-next are using onMouseDown and onMouseUp iteractions [8719daf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8719daf)

## 12.0.14
- [patch] Updated dependencies [d5a043a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d5a043a)
  - @atlaskit/icon@13.8.1
  - @atlaskit/portal@0.0.9

## 12.0.13
- [patch] Updated dependencies [d9d2f0d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d9d2f0d)
- [none] Updated dependencies [89be4f1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89be4f1)
  - @atlaskit/portal@0.0.8

## 12.0.12
- [patch] Adds sideEffects: false to allow proper tree shaking [b5d6d04](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b5d6d04)

## 12.0.11
- [patch] tooltip will not appear when content is undefined null or an empty string [239b448](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/239b448)

## 12.0.9
- [patch] Updated dependencies [df22ad8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/df22ad8)
  - @atlaskit/theme@6.0.0
  - @atlaskit/icon@13.2.5
  - @atlaskit/button@9.0.6
  - @atlaskit/docs@5.0.6

## 12.0.8




- [patch] Updated dependencies [1d9e75a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d9e75a)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies [a3109d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a3109d3)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies [87d45d3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/87d45d3)
  - @atlaskit/portal@0.0.6
- [none] Updated dependencies [a08b0c2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a08b0c2)
  - @atlaskit/portal@0.0.6

## 12.0.7
- [patch] Adds missing dependency on babel-runtime [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
- [patch] Updated dependencies [e41e465](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e41e465)
  - @atlaskit/portal@0.0.5

## 12.0.6
- [patch] replaces internal utility with flushable library [beb9fce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beb9fce)
- [none] Updated dependencies [beb9fce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/beb9fce)

## 12.0.5
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [patch] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/button@9.0.5
  - @atlaskit/theme@5.1.3
  - @atlaskit/portal@0.0.4
  - @atlaskit/icon@13.2.4

## 12.0.4
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/portal@0.0.3
  - @atlaskit/icon@13.2.2
  - @atlaskit/button@9.0.4
  - @atlaskit/theme@5.1.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2

## 12.0.3
- [patch] Add a SSR test for every package, add react-dom and build-utils in devDependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
- [none] Updated dependencies [7e331b5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7e331b5)
  - @atlaskit/analytics-next@3.0.2
  - @atlaskit/button@9.0.3
  - @atlaskit/theme@5.1.1
  - @atlaskit/layer-manager@5.0.3
  - @atlaskit/icon@13.2.1

## 12.0.2
- [patch] tooltip now renders popup into @atlaskit/portal [64fba41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64fba41)
- [none] Updated dependencies [64fba41](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/64fba41)

## 12.0.1
- [patch] Move analytics tests and replace elements to core [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
- [none] Updated dependencies [49d4ab4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49d4ab4)
  - @atlaskit/analytics-next@3.0.1
  - @atlaskit/button@9.0.2
  - @atlaskit/docs@5.0.1

## 12.0.0
- [major] Replace the `onMouseOver` function in tooltip with `onTooltipShow`, and `onMouseOut` function with `onTooltipHide` to give consumers more useful methods. [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
- [none] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/layer-manager@5.0.1
  - @atlaskit/icon@13.1.1

## 11.0.0
- [major] Provides analytics for common component interations. See the [Instrumented Components](https://atlaskit.atlassian.com/packages/core/analytics-next) section for more details. If you are using enzyme for testing you will have to use [our forked version of the library](https://atlaskit.atlassian.com/docs/guides/testing#we-use-a-forked-version-of-enzyme). [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/theme@5.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/layer-manager@5.0.0
  - @atlaskit/icon@13.0.0

## 10.3.1
- [patch] Fix $FlowFixMe and release packages [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
- [none] Updated dependencies [25d0b2d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25d0b2d)
  - @atlaskit/button@8.2.2
  - @atlaskit/icon@12.3.1

## 10.3.0
- [minor] Fixes types for Flow 0.74 [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
- [none] Updated dependencies [dc50cd2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dc50cd2)
  - @atlaskit/button@8.2.0
  - @atlaskit/icon@12.2.0

## 10.2.1
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/button@8.1.2
  - @atlaskit/theme@4.0.4
  - @atlaskit/layer-manager@4.2.1
  - @atlaskit/icon@12.1.2

## 10.2.0
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/layer-manager@4.1.0
  - @atlaskit/icon@12.1.0
  - @atlaskit/docs@4.1.0
  - @atlaskit/theme@4.0.2
  - @atlaskit/button@8.1.0

## 10.1.0
- [minor] Remove warning HoC from tooltip, meaning base class is the default export again [c88ff8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c88ff8c)
- [none] Updated dependencies [c88ff8c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c88ff8c)

## 10.0.1
- [patch] Update readme's [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
- [patch] Updated dependencies [223cd67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/223cd67)
  - @atlaskit/layer-manager@4.0.1
  - @atlaskit/icon@12.0.1
  - @atlaskit/button@8.0.1
  - @atlaskit/theme@4.0.1
  - @atlaskit/docs@4.0.1

## 10.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/layer-manager@4.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/button@8.0.0
  - @atlaskit/theme@4.0.0
  - @atlaskit/docs@4.0.0

## 9.2.1
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/icon@11.3.0
  - @atlaskit/layer-manager@3.0.4
  - @atlaskit/button@7.2.5
  - @atlaskit/theme@3.2.2
  - @atlaskit/docs@3.0.4

## 9.2.0
- [minor] add delay prop to tooltip. still defaults to 300ms. [66c6264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c6264)
- [none] Updated dependencies [66c6264](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/66c6264)

## 9.1.5
- [patch] Fix long words in tooltip content overflowing the tooltip, they will now wrap. [b2967ef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b2967ef)

## 9.1.4
- [patch] Fix tooltips sometimes not hiding when rapidly switching between them [760f6a0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/760f6a0)

## 9.1.3
- [patch] Fix react warnings caused when unmounting a tooltip when it is queued for show/hide [6d9cc52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6d9cc52)

## 9.1.2
- [patch] Fix tooltip scroll listeners not being removed properly and an edgecase viewport autoflip issue [0a3ccc9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0a3ccc9)

## 9.1.1
- [patch] Fix viewport edge collision detection for non-mouse positions in some cases and improve detection to include scrollbars [e66bce5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e66bce5)

## 9.1.0
- [patch] Improve viewport edge collision detection. Tooltips will now shift along the secondary position axis (e.g. left/right when position is top/bottom) to show within viewport. Fix auto flip occurring incorrectly in these situations as well. [ebf331a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ebf331a)
- [minor] Add new 'mouse' value for position prop and mousePosition prop to allow the tooltip to display relative to the mouse. [1d5577d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1d5577d)

## 9.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 8.4.2
- [patch] Makes packages Flow types compatible with version 0.67 [25daac0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/25daac0)

## 8.4.1
- [patch] Re-releasing due to potentially broken babel release [9ed0bba](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9ed0bba)

## 8.4.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 8.3.2
- [patch] updated the repository url to https://bitbucket.org/atlassian/atlaskit-mk-2 [1e57e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e57e5a)

## 8.3.1
- [patch] Packages Flow types for elements components [3111e74](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3111e74)

## 8.3.0
- [minor] update atlaskit/theme to 2.3.2 [3795197](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3795197)

## 8.2.1
- [patch] Flatten examples for easier consumer use [145b632](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/145b632)

## 8.2.0
- [minor] new prop component to open custom tooltip [3f892d5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f892d5)

## 8.1.1
- [patch] Resolved low hanging flow errors in field-base field-text comment icon item and website, $ [007de27](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/007de27)

## 8.1.0
- [minor] Add React 16 support. [12ea6e4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/12ea6e4)

## 8.0.12
- [patch] replace internal deprecation warning hoc with package [c399777](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c399777)

## 8.0.10
- [patch] AK-4064 ensure unmountComponentAtNode is called for components rendered via ReactDOM.render [e3153c3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e3153c3)

## 8.0.9
- [patch] remove unused button dependency and corrected themes type [3475dd6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3475dd6)

## 8.0.6
- [patch] bump icon dependency [da14956](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da14956)

## 8.0.3
- [patch] Use correct dependencies  [7b178b1](7b178b1)
- [patch] Adding responsive behavior to the editor. [e0d9867](e0d9867)

## 8.0.0 (2017-11-10)
* This was an accidental release - do no use, go directly to 8.0.1

## 7.0.0 (2017-11-10)
* added flow types
* rewritten the logic for positioning tooltips, removed Popper.js
* uses @atlaskit/layer-manager to render outside app context/stack
* removed stateless component
* \`description\` has been renamed to \`content\`

## 6.2.2 (2017-10-26)
* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))

## 6.2.1 (2017-10-22)
* bug fix; update styled components dep and react peerDep ([5539ada](https://bitbucket.org/atlassian/atlaskit/commits/5539ada))

## 6.2.0 (2017-10-18)
* feature; add trigger prop to tooltip ([7721243](https://bitbucket.org/atlassian/atlaskit/commits/7721243))
* feature; use mouseEnter and mouseLeave instead of mouseOver and mouseOut ([55cf15e](https://bitbucket.org/atlassian/atlaskit/commits/55cf15e))

## 6.1.0 (2017-10-18)
* feature; add trigger prop to tooltip ([7721243](https://bitbucket.org/atlassian/atlaskit/commits/7721243))
* feature; use mouseEnter and mouseLeave instead of mouseOver and mouseOut ([55cf15e](https://bitbucket.org/atlassian/atlaskit/commits/55cf15e))

## 6.0.0 (2017-08-30)
* breaking; The tooltip trigger is now wrapped in a div with 'display: inline-block' applied. Previously it was ([de263e5](https://bitbucket.org/atlassian/atlaskit/commits/de263e5))
* breaking; tooltip now disappears as soon as the mouse leaves the trigger (issues closed: ak-1834) ([de263e5](https://bitbucket.org/atlassian/atlaskit/commits/de263e5))

## 5.0.1 (2017-08-21)
* bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 5.0.0 (2017-08-11)
* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* feature; updated dark colors for Tooltip ([8fbbb8c](https://bitbucket.org/atlassian/atlaskit/commits/8fbbb8c))
* feature; new theme methods ([3656ee3](https://bitbucket.org/atlassian/atlaskit/commits/3656ee3))
* feature; add dark mode support to tooltip ([aa87b89](https://bitbucket.org/atlassian/atlaskit/commits/aa87b89))

## 4.0.0 (2017-08-11)
* breaking; affects internal styled-components implementation ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* breaking; implement dark mode theme ([d14522a](https://bitbucket.org/atlassian/atlaskit/commits/d14522a))
* feature; updated dark colors for Tooltip ([8fbbb8c](https://bitbucket.org/atlassian/atlaskit/commits/8fbbb8c))
* feature; new theme methods ([3656ee3](https://bitbucket.org/atlassian/atlaskit/commits/3656ee3))
* feature; add dark mode support to tooltip ([aa87b89](https://bitbucket.org/atlassian/atlaskit/commits/aa87b89))

## 3.4.2 (2017-07-27)
* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))

## 3.4.1 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)
* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 2.0.0 (2017-07-17)
* replace LESS with SC ([d1b5911](https://bitbucket.org/atlassian/atlaskit/commits/d1b5911))
* breaking; named export "Tooltip" is now "TooltipStateless". prop "visible" is now "isVisible"
* ISSUES CLOSED: AK-2059

## 1.2.1 (2017-07-13)
* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))

## 1.2.0 (2017-05-10)
* feature; bump layer version in [@atlaskit](https://github.com/atlaskit)/tooltip ([cfa9903](https://bitbucket.org/atlassian/atlaskit/commits/cfa9903))

## 1.1.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 1.1.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 1.1.0 (2017-04-20)
* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))

## 1.0.8 (2017-04-04)
* fix; adds defensive code to allow testing in mocha/jsdom ([2eaab5b](https://bitbucket.org/atlassian/atlaskit/commits/2eaab5b))

## 1.0.6 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.0.4 (2017-02-28)
* fix; prevent word wrapping of tooltip for TextAdvancdFormatting elements ([31b51a4](https://bitbucket.org/atlassian/atlaskit/commits/31b51a4))
* fix; removes jsdoc annotations and moves content to usage.md ([2d794cd](https://bitbucket.org/atlassian/atlaskit/commits/2d794cd))
* fix; dummy commit to release stories ([3df5d9f](https://bitbucket.org/atlassian/atlaskit/commits/3df5d9f))

## 1.0.3 (2017-02-20)
* Add missing TS definition for tooltip ([aae714d](https://bitbucket.org/atlassian/atlaskit/commits/aae714d))
* Add TS definition for tooltip ([5c023e9](https://bitbucket.org/atlassian/atlaskit/commits/5c023e9))
* Use atlaskit tooltips instead of browser native tooltips ([d0018eb](https://bitbucket.org/atlassian/atlaskit/commits/d0018eb))

## 1.0.2 (2017-02-07)
* fix; Updates package to use scoped ak packages ([73d1427](https://bitbucket.org/atlassian/atlaskit/commits/73d1427))

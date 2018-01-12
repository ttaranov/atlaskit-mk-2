# @atlaskit/dropdown-menu

## 3.11.4 (2017-11-30)

* bug fix; fix dropdown menu opening on disabled button click (issues closed: ak-3644) ([4d8c35d](https://bitbucket.org/atlassian/atlaskit/commits/4d8c35d))

## 3.11.3 (2017-11-23)

* bug fix; update checkbox/radio dropdown items to work with default item spacing bug fix ([7ac0582](https://bitbucket.org/atlassian/atlaskit/commits/7ac0582))
## 3.11.2 (2017-11-16)

* bug fix; bumping internal dependencies to latest major version ([7b22368](https://bitbucket.org/atlassian/atlaskit/commits/7b22368))
## 3.11.1 (2017-11-02)

* bug fix; added missing dependencies (issues closed: ak-3782) ([4dbc3ef](https://bitbucket.org/atlassian/atlaskit/commits/4dbc3ef))
## 3.11.0 (2017-10-27)

* feature; use shared HOC from item ([f966d9c](https://bitbucket.org/atlassian/atlaskit/commits/f966d9c))
## 3.10.5 (2017-10-26)

* bug fix; fix to rebuild stories ([793b2a7](https://bitbucket.org/atlassian/atlaskit/commits/793b2a7))
## 3.10.4 (2017-10-22)

* bug fix; update dependencies for react-16 ([077d1ad](https://bitbucket.org/atlassian/atlaskit/commits/077d1ad))


## 3.10.3 (2017-10-06)

* bug fix; replace React.PropTypes imports with prop-types ([8c17947](https://bitbucket.org/atlassian/atlaskit/commits/8c17947))


## 3.10.2 (2017-09-21)

* bug fix; update item dependency (issues closed: ak-3418) ([4f64804](https://bitbucket.org/atlassian/atlaskit/commits/4f64804))





## 3.10.1 (2017-09-06)

* bug fix; Dropdown menu now closes when a non-link item is clicked (issues closed: ak-3288) ([3bdf62d](https://bitbucket.org/atlassian/atlaskit/commits/3bdf62d))
## 3.10.0 (2017-09-01)

* feature; exposing isOpen and defaultOpen from dropdown ([f89ac1c](https://bitbucket.org/atlassian/atlaskit/commits/f89ac1c))
## 3.9.0 (2017-08-31)

* bug fix; dropdown-menu depenencies bumped to latest (issues closed: ak-3392) ([faea6d3](https://bitbucket.org/atlassian/atlaskit/commits/faea6d3))
* feature; adding the ability to pass a boundariesElement to the Layer component (issues closed: ak-3416) ([f6a215e](https://bitbucket.org/atlassian/atlaskit/commits/f6a215e))





## 3.8.0 (2017-08-25)

* feature; added defaultSelected and isSelected props for DropdownItemRadio and DropdownItemCheckbox (issues closed: ak-3357) ([00080f1](https://bitbucket.org/atlassian/atlaskit/commits/00080f1))

## 3.7.3 (2017-08-24)

* bug fix; dropdownItemRadio and DropdownItemCheckbox now work when custom onClick handler is s (issues closed: ak-3358) ([16bee1b](https://bitbucket.org/atlassian/atlaskit/commits/16bee1b))

## 3.7.2 (2017-08-22)

* bug fix; dropdownItem and DropdownItemGroup now get correct a11y role (issues closed: ak-3325) ([2dbfe85](https://bitbucket.org/atlassian/atlaskit/commits/2dbfe85))
* bug fix; dropdown now only focuses on first item when opened via keyboard (issues closed: ak-3311) ([4381e96](https://bitbucket.org/atlassian/atlaskit/commits/4381e96))

## 3.7.1 (2017-08-21)

* bug fix; fix PropTypes warning ([040d579](https://bitbucket.org/atlassian/atlaskit/commits/040d579))

## 3.7.0 (2017-08-11)

* bug fix; fix the theme-dependency ([db90333](https://bitbucket.org/atlassian/atlaskit/commits/db90333))
* feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 3.6.0 (2017-08-11)

* feature; implement darkmode for droplist ([35f9281](https://bitbucket.org/atlassian/atlaskit/commits/35f9281))

## 3.5.1 (2017-08-10)

* bug fix; handle missing context in dropdown items gracefully (issues closed: ak-2590) ([5a36eea](https://bitbucket.org/atlassian/atlaskit/commits/5a36eea))

## 3.5.0 (2017-07-28)

## 3.4.2 (2017-07-27)

* fix; rename jsnext:main to jsnext:experimental:main temporarily ([c7508e0](https://bitbucket.org/atlassian/atlaskit/commits/c7508e0))
* feature; convert dropdown-menu and droplist to declarative API ([f6e0292](https://bitbucket.org/atlassian/atlaskit/commits/f6e0292))

## 3.4.1 (2017-07-25)

* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 3.1.0 (2017-07-17)

* fix; rerelease, failed prepublish scripts ([5fd82f8](https://bitbucket.org/atlassian/atlaskit/commits/5fd82f8))
* feature; added ES module builds to dist and add jsnext:main to most ADG packages ([ea76507](https://bitbucket.org/atlassian/atlaskit/commits/ea76507))

## 3.0.2 (2017-07-17)

* fix; replace "*" with last version of tooltip "1.2.0" ([89ba989](https://bitbucket.org/atlassian/atlaskit/commits/89ba989))

## 3.0.1 (2017-06-14)

* fix; update internal components to latest dropdown-menu ([ad63284](https://bitbucket.org/atlassian/atlaskit/commits/ad63284))

## 2.0.0 (2017-05-30)

* refactored to meet new component conventions ([64510d9](https://bitbucket.org/atlassian/atlaskit/commits/64510d9))
* removed TypeScript ([d78988e](https://bitbucket.org/atlassian/atlaskit/commits/d78988e))
* breaking; Public API change: named export "StatelessDropdownMenu" is now "DropdownMenuStateless"
* breaking; removed TypeScript ISSUES CLOSED: AK-2384

## 1.10.1 (2017-05-26)

* fix; add missing prop types to dropdown-menu ([79d9570](https://bitbucket.org/atlassian/atlaskit/commits/79d9570))

## 1.10.0 (2017-05-26)

* fix; add prop-types as a dependency to avoid React 15.x warnings ([92598eb](https://bitbucket.org/atlassian/atlaskit/commits/92598eb))
* feature; add isLoading to DropdownMenu and StatelessMenu ([88326a1](https://bitbucket.org/atlassian/atlaskit/commits/88326a1))

## 1.9.0 (2017-05-24)

* feature; dropdown-menu onItemActivated callback to accept event arg and update unit tests ([2ebec38](https://bitbucket.org/atlassian/atlaskit/commits/2ebec38))

## 1.8.0 (2017-05-23)

* feature; support setting elemAfter on DropdownMenu's groups ([7471f2d](https://bitbucket.org/atlassian/atlaskit/commits/7471f2d))

## 1.7.0 (2017-05-10)

* feature; add support for tooltips. ([545cd7e](https://bitbucket.org/atlassian/atlaskit/commits/545cd7e))

## 1.6.0 (2017-05-10)

* feature; bumping icons in dropdown-menu ([b29bcdd](https://bitbucket.org/atlassian/atlaskit/commits/b29bcdd))

## 1.5.0 (2017-05-02)

* feature; bump droplist version + shouldAllowMultilineItems property ([6990b4e](https://bitbucket.org/atlassian/atlaskit/commits/6990b4e))

## 1.4.0 (2017-04-20)

* fix; upgrade droplist dependency version ([0dd084d](https://bitbucket.org/atlassian/atlaskit/commits/0dd084d))
* feature; removed explicit style! imports, set style-loader in webpack config ([891fc3c](https://bitbucket.org/atlassian/atlaskit/commits/891fc3c))
* temporarily revert changes ([8d22c2d](https://bitbucket.org/atlassian/atlaskit/commits/8d22c2d))

## 1.3.0 (2017-04-19)

## 1.2.0 (2017-04-18)

* feature; updated avatar dependency versions for comment, dropdown-menu, droplist, and page ([e4d2ae7](https://bitbucket.org/atlassian/atlaskit/commits/e4d2ae7))

## 1.1.13 (2017-04-13)

* fix; dropdown remove max-width limit in fit container mode ([308a5a3](https://bitbucket.org/atlassian/atlaskit/commits/308a5a3))
* fix; update dropdown menu readme story with new readme component ([2e29f3b](https://bitbucket.org/atlassian/atlaskit/commits/2e29f3b))
* feature; add shouldFitContainer option to dropdown-menu ([26dd7ec](https://bitbucket.org/atlassian/atlaskit/commits/26dd7ec))

## 1.1.12 (2017-03-23)

## 1.1.11 (2017-03-23)

* fix; Empty commit to release the component ([49c08ee](https://bitbucket.org/atlassian/atlaskit/commits/49c08ee))

## 1.1.9 (2017-03-21)

## 1.1.9 (2017-03-21)

* fix; fixed the dropdown's width restriction. Added a story for the dropdown with very lon ([954c04c](https://bitbucket.org/atlassian/atlaskit/commits/954c04c))
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 1.1.8 (2017-03-21)

* fix; get rid of the unnecessary dependencies ([b14e5e9](https://bitbucket.org/atlassian/atlaskit/commits/b14e5e9))

## 1.1.7 (2017-03-20)

* fix; add missing dropdown menu typings ([5d90718](https://bitbucket.org/atlassian/atlaskit/commits/5d90718))
* fix; add missing dropdown menu typings ([26def3f](https://bitbucket.org/atlassian/atlaskit/commits/26def3f))

## 1.1.6 (2017-03-08)

* fix; dummy commit to force release ([d45a0c9](https://bitbucket.org/atlassian/atlaskit/commits/d45a0c9))

## 1.1.5 (2017-03-08)

* fix; update menu to the latest version of droplist component and fix relevant issues afte ([0e0a17a](https://bitbucket.org/atlassian/atlaskit/commits/0e0a17a))

## 1.1.4 (2017-02-16)

## 1.1.3 (2017-02-14)

* fix; update ak-icon to [@atlaskit](https://github.com/atlaskit)/icon and fix dependencies ([5589fbd](https://bitbucket.org/atlassian/atlaskit/commits/5589fbd))
* fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
* update item dependency ([7609c1e](https://bitbucket.org/atlassian/atlaskit/commits/7609c1e))

## 1.1.2 (2017-02-09)

* fix; avoiding binding render to this ([40c9951](https://bitbucket.org/atlassian/atlaskit/commits/40c9951))

## 1.1.1 (2017-02-07)

* fix; updates package to use ak scoped packages ([0bf5e14](https://bitbucket.org/atlassian/atlaskit/commits/0bf5e14))

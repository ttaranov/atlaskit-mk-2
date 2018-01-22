# @atlaskit/emoji

## 31.0.8 (2018-01-10)

* bug fix; added nbsp to emoji sprite spans to allow for selection at start of paragraph (issues closed: fs-1622) ([77d6ca0](https://bitbucket.org/atlassian/atlaskit/commits/77d6ca0))

## 31.0.7 (2018-01-05)

* bug fix; fix missing window when using emoji in node.js code ([136b0c5](https://bitbucket.org/atlassian/atlaskit/commits/136b0c5))
## 31.0.6 (2018-01-04)

* bug fix; fS-1600 Code review remark ([458577d](https://bitbucket.org/atlassian/atlaskit/commits/458577d))
* bug fix; fS-1600 Change lifecycle methods used to avoid rerender when possible ([51f14a1](https://bitbucket.org/atlassian/atlaskit/commits/51f14a1))
## 31.0.5 (2018-01-02)


* bug fix; update util-service-support dependency to 2.0.3 (issues closed: fs-1091) ([593da96](https://bitbucket.org/atlassian/atlaskit/commits/593da96))
## 31.0.4 (2017-12-21)


* bug fix; use memorycachestrategy for ie ([2801cfd](https://bitbucket.org/atlassian/atlaskit/commits/2801cfd))
## 31.0.3 (2017-12-20)

* bug fix; fS-1588 force edge to use memorycachestrategy (issues closed: fs-1588) ([8b2224c](https://bitbucket.org/atlassian/atlaskit/commits/8b2224c))
## 31.0.2 (2017-12-19)

* bug fix; fix publishing of emoji component (issues closed: fs-1591) ([676cb72](https://bitbucket.org/atlassian/atlaskit/commits/676cb72))
## 31.0.1 (2017-12-19)



* bug fix; fS-1584 fix high res emoji rendering in firefox and edge (issues closed: fs-1584) ([7ec1e3b](https://bitbucket.org/atlassian/atlaskit/commits/7ec1e3b))
## 31.0.0 (2017-12-14)

* breaking; property fitHeight removed in favor of size property in EmojiPlaceholder ([fedf004](https://bitbucket.org/atlassian/atlaskit/commits/fedf004))
* breaking; removed redundant prop fitToHeight in EmojiPlaceholder ([fedf004](https://bitbucket.org/atlassian/atlaskit/commits/fedf004))
## 30.3.8 (2017-12-13)


* bug fix; atlassianEmojiMigrationResource does not resolve atlassian emojis by id (issues closed: fs-1557) ([1bfc13c](https://bitbucket.org/atlassian/atlaskit/commits/1bfc13c))
## 30.3.7 (2017-12-08)

* bug fix; fS-1504 Fix lint error ([64563cf](https://bitbucket.org/atlassian/atlaskit/commits/64563cf))
* bug fix; fS-1504: Delete emoji tooltip style ([07e6300](https://bitbucket.org/atlassian/atlaskit/commits/07e6300))
* bug fix; fS-1504 Use tooltip component instead of css solution ([fde67b6](https://bitbucket.org/atlassian/atlaskit/commits/fde67b6))
## 30.3.6 (2017-12-05)

* bug fix; fixed typescript error in unit test ([a4dceec](https://bitbucket.org/atlassian/atlaskit/commits/a4dceec))
* bug fix; removed circular dependency on constant defaultListLimit ([1978b73](https://bitbucket.org/atlassian/atlaskit/commits/1978b73))
* bug fix; fixed EmojiPlaceHolder height for big emoji to fix stride scrolling bug ([06638c5](https://bitbucket.org/atlassian/atlaskit/commits/06638c5))
## 30.3.5 (2017-11-28)

* bug fix; upgrade all atlaskit dependencies (issues closed: fs-1526) ([8dac2d2](https://bitbucket.org/atlassian/atlaskit/commits/8dac2d2))
* bug fix; use theme package instead of util-shared-styles (issues closed: fs-1526) ([45d7bb9](https://bitbucket.org/atlassian/atlaskit/commits/45d7bb9))
## 30.3.4 (2017-11-28)



* bug fix; fixed typescript errors in emoji ([8619a6e](https://bitbucket.org/atlassian/atlaskit/commits/8619a6e))

* bug fix; fS-1518 requests higher res image on error (issues closed: fs-1518) ([63ef0bd](https://bitbucket.org/atlassian/atlaskit/commits/63ef0bd))
## 30.3.3 (2017-11-22)

* bug fix; big emoji scrolling issue fixed (issues closed: fs-1512) ([b715731](https://bitbucket.org/atlassian/atlaskit/commits/b715731))
## 30.3.2 (2017-11-20)

* bug fix; make emoji react 16 compatible (issues closed: ed-3181) ([9ca27d8](https://bitbucket.org/atlassian/atlaskit/commits/9ca27d8))
## 30.3.1 (2017-11-17)

* bug fix; fix more cases of classname useage ([7fd79d4](https://bitbucket.org/atlassian/atlaskit/commits/7fd79d4))
* bug fix; prefix global classnames to prevent product conflicts (issues closed: fs-1474) ([b5cccae](https://bitbucket.org/atlassian/atlaskit/commits/b5cccae))
## 30.3.0 (2017-11-17)

* feature; upgrade version of mediapicker to 11.1.6 and media-core to 11.0.0 across packages ([aaa7aa0](https://bitbucket.org/atlassian/atlaskit/commits/aaa7aa0))
## 30.2.0 (2017-11-09)




* feature; added optional alternateRepresentation field to EmojiDescription for using higher r ([624210a](https://bitbucket.org/atlassian/atlaskit/commits/624210a))
## 30.1.6 (2017-10-31)

* bug fix; fixed mpConfig in SiteEmojiResource ([bd01a52](https://bitbucket.org/atlassian/atlaskit/commits/bd01a52))
## 30.1.5 (2017-10-25)

* bug fix; fixed sizing of emoji in upload preview (issues closed: fs-1441) ([d69a2b2](https://bitbucket.org/atlassian/atlaskit/commits/d69a2b2))
## 30.1.4 (2017-10-24)

* bug fix; bumped mediapicker to v10 (issues closed: fs-1443) ([de8a306](https://bitbucket.org/atlassian/atlaskit/commits/de8a306))


## 30.1.3 (2017-10-22)

* bug fix; update styled component dependency and react peerDep ([39f3286](https://bitbucket.org/atlassian/atlaskit/commits/39f3286))
## 30.1.2 (2017-10-20)


* bug fix; simplify positioning of tooltip css. ([d1d2c2e](https://bitbucket.org/atlassian/atlaskit/commits/d1d2c2e))

* bug fix; change animation to slide up (issues closed: fs-1413) ([0cf80c9](https://bitbucket.org/atlassian/atlaskit/commits/0cf80c9))
* bug fix; adjusted positioning for tooltip on emojis of variable sizes ([cde6bf0](https://bitbucket.org/atlassian/atlaskit/commits/cde6bf0))
* bug fix; updated placeholder to fit with square design ([c73c8f0](https://bitbucket.org/atlassian/atlaskit/commits/c73c8f0))
## 30.1.1 (2017-10-11)

* bug fix; fS-1360 Loading emojis for the first time uses more than 1 network call even for the ([866a41f](https://bitbucket.org/atlassian/atlaskit/commits/866a41f))
## 30.1.0 (2017-10-10)


* bug fix; emoji rendered with set width and height to reduce reflows (issues closed: fs-1156) ([4a2a3b9](https://bitbucket.org/atlassian/atlaskit/commits/4a2a3b9))
* feature; allow size of emoji to be overridden (issues closed: fs-1156) ([98cd503](https://bitbucket.org/atlassian/atlaskit/commits/98cd503))
## 30.0.0 (2017-10-05)

* bug fix; fix typescript errors ([c577c6e](https://bitbucket.org/atlassian/atlaskit/commits/c577c6e))
* breaking; EmojiResource and EmojiRepository implement addUnknownEmoji rather than addCustomEmoji ([f82b6ae](https://bitbucket.org/atlassian/atlaskit/commits/f82b6ae))
* breaking; unknown emojis of any type can be resolved and added to the repository (issues closed: fs-1404) ([f82b6ae](https://bitbucket.org/atlassian/atlaskit/commits/f82b6ae))
* bug fix; query auto converts to emoji on exact unique shortname match (issues closed: fs-1381) ([c16eb18](https://bitbucket.org/atlassian/atlaskit/commits/c16eb18))
## 29.1.1 (2017-09-27)



* bug fix; fS-1348 preview displays correct img (issues closed: fs-1348) ([6b0d167](https://bitbucket.org/atlassian/atlaskit/commits/6b0d167))
## 29.1.0 (2017-09-25)

* bug fix; emoji picker displays people emojis after frequent (issues closed: fs-1340) ([f2a089e](https://bitbucket.org/atlassian/atlaskit/commits/f2a089e))
* feature; return creator user Id and created data in EmojiDescription (optionally) (issues closed: fs-1328) ([7949ff4](https://bitbucket.org/atlassian/atlaskit/commits/7949ff4))
## 29.0.4 (2017-09-22)


* bug fix; removed reference to selectedCategory ([7319aa2](https://bitbucket.org/atlassian/atlaskit/commits/7319aa2))
* bug fix; export props and state of emojipickerlist ([3c2dde2](https://bitbucket.org/atlassian/atlaskit/commits/3c2dde2))

* bug fix; fS-1349 refactor selectedCategory resolution logic in picker (issues closed: fs-1349) ([10c7487](https://bitbucket.org/atlassian/atlaskit/commits/10c7487))
## 29.0.3 (2017-09-22)

* bug fix; remove code splitting from emoji ([94a5901](https://bitbucket.org/atlassian/atlaskit/commits/94a5901))
## 29.0.2 (2017-09-21)

* bug fix; shows tone selector by default in preview (issues closed: fs-1346) ([d4fbaf8](https://bitbucket.org/atlassian/atlaskit/commits/d4fbaf8))
* bug fix; fS-1297 picker row to fit emoji if custom is uploaded (issues closed: fs-1297) ([cf42328](https://bitbucket.org/atlassian/atlaskit/commits/cf42328))
## 29.0.1 (2017-09-19)

* bug fix; code splitted mediapicker in emoji package (issues closed: ed-2776) ([8649f12](https://bitbucket.org/atlassian/atlaskit/commits/8649f12))
## 29.0.0 (2017-09-18)


* breaking; EmojiProvider.calculateDynamicCategories() now returns a Promise<string[]> instead of string[] ([c19395f](https://bitbucket.org/atlassian/atlaskit/commits/c19395f))
* breaking; a few bug fixes around emoji upload plus Atlassian icon change. (issues closed: fs-1271) ([c19395f](https://bitbucket.org/atlassian/atlaskit/commits/c19395f))
## 28.0.2 (2017-09-13)

* bug fix; fixed typescript errors ([db466da](https://bitbucket.org/atlassian/atlaskit/commits/db466da))

## 28.0.1 (2017-09-11)

* bug fix; some of the support classes did not implement EmojiProvider interface properly. ([ab68a91](https://bitbucket.org/atlassian/atlaskit/commits/ab68a91))

* bug fix; frequently used emoji should include skin-tone modifier (issues closed: fs-1331) ([1b48b4a](https://bitbucket.org/atlassian/atlaskit/commits/1b48b4a))
## 28.0.0 (2017-09-08)

* bug fix; fS-1359 siteEmojiResource.findEmoji only returns emojis of type CUSTOM (issues closed: fs-1359) ([cf222de](https://bitbucket.org/atlassian/atlaskit/commits/cf222de))

* feature; deleting an emoji removes all references to it from the EmojiRepository ([70f105b](https://bitbucket.org/atlassian/atlaskit/commits/70f105b))
* breaking; EmojiResource must implement deleteSiteEmoji functioon ([cf45944](https://bitbucket.org/atlassian/atlaskit/commits/cf45944))
* breaking; fS-1194 add deleteSiteEmoji to EmojiResource ([cf45944](https://bitbucket.org/atlassian/atlaskit/commits/cf45944))
## 27.1.0 (2017-09-06)

* feature; only allow upload if the MediaEmojiResource was able to retrieve an upload token (issues closed: fs-1338) ([b7c085a](https://bitbucket.org/atlassian/atlaskit/commits/b7c085a))
* bug fix; added a story using a proper EmojiResource for testing ([2614b8f](https://bitbucket.org/atlassian/atlaskit/commits/2614b8f))
## 27.0.5 (2017-09-05)

* bug fix; we need to make sure the component is not unmounted before we use this.setState in p (issues closed: ed-2448) ([b3301ea](https://bitbucket.org/atlassian/atlaskit/commits/b3301ea))
## 27.0.4 (2017-09-01)

* bug fix; changed prop type passed into LoadingEmojiComponent ([93cf9e3](https://bitbucket.org/atlassian/atlaskit/commits/93cf9e3))
## 27.0.3 (2017-09-01)

* bug fix; fix size of placeholders in emoji picker. ([b5c5a02](https://bitbucket.org/atlassian/atlaskit/commits/b5c5a02))
## 27.0.2 (2017-08-29)

* bug fix; prevent default on category buttons (issues closed: fs-1320) ([976e395](https://bitbucket.org/atlassian/atlaskit/commits/976e395))
## 27.0.1 (2017-08-29)

* bug fix; added external story to test AtlassianEmojiMigrationResource behaviour ([ec6a355](https://bitbucket.org/atlassian/atlaskit/commits/ec6a355))



## 27.0.0 (2017-08-24)



* feature; add tests for the frequent emoji in the EmojiPicker. ([5b176d0](https://bitbucket.org/atlassian/atlaskit/commits/5b176d0))
* bug fix; ensure only 16 frequent emoji are shown and they are at top of picker ([038b6eb](https://bitbucket.org/atlassian/atlaskit/commits/038b6eb))
* breaking; EmojiProvider implementations need to implement a new method: getFrequentlyUsed. ([84b7c6c](https://bitbucket.org/atlassian/atlaskit/commits/84b7c6c))
* breaking; show frequently used emoji in the EmojiPicker. (issues closed: fs-1095) ([84b7c6c](https://bitbucket.org/atlassian/atlaskit/commits/84b7c6c))

* breaking; EmojiRepository search now applies a default sort unless you specifically set a parameter to prevent ([4f21e3c](https://bitbucket.org/atlassian/atlaskit/commits/4f21e3c))
* breaking; sort the default emoji presented in the typeahead so that the most frequently used (issues closed: fs-1094) ([4f21e3c](https://bitbucket.org/atlassian/atlaskit/commits/4f21e3c))


## 26.0.2 (2017-08-21)

* bug fix; no longer chain calls to mediapicker (no longer supported). ([14b4e6c](https://bitbucket.org/atlassian/atlaskit/commits/14b4e6c))
* bug fix; bump media picker and other dependencies to align with editor-core ([d3c9668](https://bitbucket.org/atlassian/atlaskit/commits/d3c9668))

## 26.0.1 (2017-08-14)

* bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))
## 26.0.0 (2017-08-13)



* feature; unit tests for the frequency in search work. ([ab28372](https://bitbucket.org/atlassian/atlaskit/commits/ab28372))


* breaking; The usageTracker property is moved from EmojiResource. If you subclassed EmojiResource and relied on ([b495c56](https://bitbucket.org/atlassian/atlaskit/commits/b495c56))
* breaking; ensure frequently used emoji are boosted in search results in the typeahead and pick (issues closed: fs-1213) ([b495c56](https://bitbucket.org/atlassian/atlaskit/commits/b495c56))



## 25.0.0 (2017-08-10)

* bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))
* bug fix; bumped emoji to next latest version ([79b61ba](https://bitbucket.org/atlassian/atlaskit/commits/79b61ba))







* breaking; EmojiSearchResult no longer has categories field ([cbc47eb](https://bitbucket.org/atlassian/atlaskit/commits/cbc47eb))
* breaking; categorySelector inserts non-standard categories dynamically (issues closed: fs-1201) ([cbc47eb](https://bitbucket.org/atlassian/atlaskit/commits/cbc47eb))
* feature; atlassianEmojiMigrationResource removes Atlassian emojis that have a corresponding (issues closed: fs-1200) ([a95ef0c](https://bitbucket.org/atlassian/atlaskit/commits/a95ef0c))
## 23.0.1 (2017-08-10)

* bug fix; release imports up into src fail in dist ([9846bc5](https://bitbucket.org/atlassian/atlaskit/commits/9846bc5))

## 23.0.0 (2017-08-09)

* bug fix; make the typeahead and picker call Provider.recordSelection by default ([c801f20](https://bitbucket.org/atlassian/atlaskit/commits/c801f20))
* bug fix; change how skin tone variations are converted back to their 'base' emoji ([ef6fbf3](https://bitbucket.org/atlassian/atlaskit/commits/ef6fbf3))

* bug fix; fixed a bug where the storybook update was happening before the usage had been recor ([eeedf56](https://bitbucket.org/atlassian/atlaskit/commits/eeedf56))



* breaking; EmojiResource.recordSelection now returns a resolved Promise rather than a rejected Promise when ([e7680d0](https://bitbucket.org/atlassian/atlaskit/commits/e7680d0))
* breaking; keep track of selected emoji so we know most frequently used. (issues closed: fs-1212) ([e7680d0](https://bitbucket.org/atlassian/atlaskit/commits/e7680d0))












## 22.3.1 (2017-07-27)


* fix; ensure :sweat_smile: is in emoji test data for editor tests ([00759bf](https://bitbucket.org/atlassian/atlaskit/commits/00759bf))
* fix; update test/story data to all source from latest prod url. Stop using dev. ([2d223f8](https://bitbucket.org/atlassian/atlaskit/commits/2d223f8))

## 22.3.0 (2017-07-26)


* feature; added test for localStorage use in EmojiResource ([b17b64a](https://bitbucket.org/atlassian/atlaskit/commits/b17b64a))

## 22.2.0 (2017-07-25)


* feature; emojiResource uses localStorage to remember tone selection ([5547296](https://bitbucket.org/atlassian/atlaskit/commits/5547296))
* feature; export test/story data for direct import. Not in bundle. ([bafc231](https://bitbucket.org/atlassian/atlaskit/commits/bafc231))

## 22.1.1 (2017-07-25)

## 22.1.0 (2017-07-24)


* feature; switch to util-service-support for service interaction ([2ee3928](https://bitbucket.org/atlassian/atlaskit/commits/2ee3928))

## 22.0.1 (2017-07-21)


* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
* fix; addes in a wrapper for emoji so that it can be parsed by PM editor ([39e8389](https://bitbucket.org/atlassian/atlaskit/commits/39e8389))

## 22.0.0 (2017-07-21)

## 21.0.0 (2017-07-20)


* feature; fixed CSS of emoji picker ([d98acb3](https://bitbucket.org/atlassian/atlaskit/commits/d98acb3))

## 19.0.0 (2017-07-19)


* fix; don't return non-searchable emoji in searches (and 'getAll') calls ([4e95196](https://bitbucket.org/atlassian/atlaskit/commits/4e95196))
* fix; emojiDescription in a few test files were missing the searchable field. ([08f31e2](https://bitbucket.org/atlassian/atlaskit/commits/08f31e2))
* fix; fix flexbox issue when upload panel displayed in FF/IE/Edge. ([aaff6f0](https://bitbucket.org/atlassian/atlaskit/commits/aaff6f0))
* fix; Tests and minor fixes for media caching/loading. ([7ea11c1](https://bitbucket.org/atlassian/atlaskit/commits/7ea11c1))


* feature; emojis with skin variations in the picker ([90af318](https://bitbucket.org/atlassian/atlaskit/commits/90af318))
* feature; skin tone selection made in the picker is stored in the EmojiResource ([fcdcee8](https://bitbucket.org/atlassian/atlaskit/commits/fcdcee8))
* feature; skin tone selection stored in EmojiResource propagated to typeahead ([b17570c](https://bitbucket.org/atlassian/atlaskit/commits/b17570c))
* feature; Performance improvements ([9f5215c](https://bitbucket.org/atlassian/atlaskit/commits/9f5215c))


* breaking; The EmojiDescription and EmojiServiceDescription interfaces have an additional mandatory property.

ISSUES CLOSED: FS-1171
* breaking; EmojiProvider requires getter/setter for remembering tone selection

ISSUES CLOSED: FS-1127
* breaking; - Most EmojiProvider methods now return T | Promise<T> instead of Promise<T>
- This should still be compatible for implementors of an EmojiProvider, but
  they can improve rendering speeds in some cases if they return a T instead
  of a Promise<T>, but old returns will continue to work.

ISSUES CLOSED: FS-1057

## 18.4.2 (2017-07-10)


* fix; added missing URLSearchParams in emoji ([b028827](https://bitbucket.org/atlassian/atlaskit/commits/b028827))

## 18.4.1 (2017-07-10)


* fix; size emoji to 20px by default. ([776fc42](https://bitbucket.org/atlassian/atlaskit/commits/776fc42))

## 18.4.0 (2017-07-05)


* feature; exact matches on emoji shortName will cause it to be selected ([8dbc1cb](https://bitbucket.org/atlassian/atlaskit/commits/8dbc1cb))

## 18.3.0 (2017-07-04)


* fix; emojiRepository returns emojis starting with numbers ([d98b5d8](https://bitbucket.org/atlassian/atlaskit/commits/d98b5d8))


* feature; improve rendering performance of emoji picker with virtual list. ([212e076](https://bitbucket.org/atlassian/atlaskit/commits/212e076))

## 18.2.1 (2017-06-29)

## 18.2.0 (2017-06-27)

## 18.1.0 (2017-06-26)


* fix; accept webp if in a supported browser. ([87c612b](https://bitbucket.org/atlassian/atlaskit/commits/87c612b))


* feature; allow enabling of upload support via EmojiResourceConfig ([234cdc6](https://bitbucket.org/atlassian/atlaskit/commits/234cdc6))
* feature; removed inbuilt tooltip for ADG3 compliant version ([2089361](https://bitbucket.org/atlassian/atlaskit/commits/2089361))

## 18.0.6 (2017-06-22)


* fix; don't index minus in emoji name. ([55398db](https://bitbucket.org/atlassian/atlaskit/commits/55398db))

## 18.0.5 (2017-06-21)


* fix; make sure we don't try to get the AsciiMap from EmojiRepository until all emoji have ([0b047b2](https://bitbucket.org/atlassian/atlaskit/commits/0b047b2))

## 18.0.4 (2017-06-20)

## 18.0.3 (2017-06-20)


* fix; fix default type ahead search to allow queries starting with a colon ([ed5dc16](https://bitbucket.org/atlassian/atlaskit/commits/ed5dc16))

## 18.0.2 (2017-06-20)


* fix; changed double quotes to single quotes ([266fe04](https://bitbucket.org/atlassian/atlaskit/commits/266fe04))
* fix; fixed linting errors in Emojis ([9aed8a9](https://bitbucket.org/atlassian/atlaskit/commits/9aed8a9))

## 18.0.1 (2017-06-15)


* fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))

## 17.0.0 (2017-06-15)


* fix; ensure there are no emoji duplicates when matching by ascii representation ([7d847b4](https://bitbucket.org/atlassian/atlaskit/commits/7d847b4))
* fix; emojiPicker stories use Layer component to anchor to input field ([0819541](https://bitbucket.org/atlassian/atlaskit/commits/0819541))


* feature; add ascii->emoji map to EmojiResource and EmojiRepository ([e9dbd69](https://bitbucket.org/atlassian/atlaskit/commits/e9dbd69))
* feature; add support for mapping new optional ascii field in EmojiDescription ([b3846a4](https://bitbucket.org/atlassian/atlaskit/commits/b3846a4))
* feature; fS-976 removed interal Popup from EmojiPicker and integrated with layer ([f081739](https://bitbucket.org/atlassian/atlaskit/commits/f081739))
* feature; introduce the new method findById(String) to EmojiProvider ([99c7549](https://bitbucket.org/atlassian/atlaskit/commits/99c7549))
* feature; properly handle emoji selection in typeahead when dealing with ascii match ([5a79e60](https://bitbucket.org/atlassian/atlaskit/commits/5a79e60))


* breaking; target, position, zIndex, offsetX and offsetY removed as props from EmojiPicker

ISSUES CLOSED: FS-976
* breaking; Added required getAsciiMap() method to EmojiProvider. Consumers will need to
implement it in their concrete classes.
* breaking; The introduction of findById(String) to EmojiProvider is a breaking change.

ISSUES CLOSED: FS-935

## 16.2.0 (2017-06-07)

## 16.1.0 (2017-06-06)


* fix; fix flexbox issue in IE11 ([383e10f](https://bitbucket.org/atlassian/atlaskit/commits/383e10f))
* fix; minor fixes, and tests for loading site emoji if not found. ([ad17ab6](https://bitbucket.org/atlassian/atlaskit/commits/ad17ab6))
* fix; tidy up conditional check, variable name ([39ad1f2](https://bitbucket.org/atlassian/atlaskit/commits/39ad1f2))
* fix; workaround react bug with EmojiUploadPicker in IE11 ([a161053](https://bitbucket.org/atlassian/atlaskit/commits/a161053))


* feature; look for an emoji on the server if unable to find it locally by id. ([5d9367f](https://bitbucket.org/atlassian/atlaskit/commits/5d9367f))

## 16.0.0 (2017-06-01)


* fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
* fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
* fix; remove polyfills from mention and emoji packages, use styled-components instead of t ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
* fix; rollback style changes for emoji component ([cd2bebd](https://bitbucket.org/atlassian/atlaskit/commits/cd2bebd))


* feature; upload emoji to media api support ([c230ac8](https://bitbucket.org/atlassian/atlaskit/commits/c230ac8))


* breaking; ED-1701, ED-1702, ED-1704

ISSUES CLOSED: ED-1701, ED-1702, ED-1704

## 15.0.0 (2017-05-22)


* feature; emojiPlaceholder prop rename title -> shortName to avoid confusion. ([974f48d](https://bitbucket.org/atlassian/atlaskit/commits/974f48d))
* feature; support media api based emoji ([b102cee](https://bitbucket.org/atlassian/atlaskit/commits/b102cee))


* breaking; EmojiPlaceholder prop change is breaking. title -> shortName

ISSUES CLOSED: FS-782

## 14.2.0 (2017-05-17)


* feature; trigger release of emoji component ([08e4e62](https://bitbucket.org/atlassian/atlaskit/commits/08e4e62))

## 14.1.0 (2017-05-10)


* fix; fixed emoji icon position ([5987e98](https://bitbucket.org/atlassian/atlaskit/commits/5987e98))


* feature; bumped typestyle in emoji ([2708133](https://bitbucket.org/atlassian/atlaskit/commits/2708133))

## 14.0.3 (2017-05-09)


* fix; emoji can handle empty parameter list ([b1ca73c](https://bitbucket.org/atlassian/atlaskit/commits/b1ca73c))


* feature; bump icon in emoji and field-base ([5f0a127](https://bitbucket.org/atlassian/atlaskit/commits/5f0a127))

## 14.0.2 (2017-05-09)


* fix; added dependencies to package.json to import URL library ([5895ba1](https://bitbucket.org/atlassian/atlaskit/commits/5895ba1))
* fix; fixed debounce function timeout clearing ([65d2d23](https://bitbucket.org/atlassian/atlaskit/commits/65d2d23))
* fix; query params can be included in the base url for the emoji service ([2de1256](https://bitbucket.org/atlassian/atlaskit/commits/2de1256))

## 14.0.1 (2017-05-08)


* fix; moved resize event handling to popper ([a876317](https://bitbucket.org/atlassian/atlaskit/commits/a876317))

## 14.0.0 (2017-05-08)

## 13.4.5 (2017-05-08)


* fix; allows absolute position to be passed to props of EmojiPicker ([e31615d](https://bitbucket.org/atlassian/atlaskit/commits/e31615d))
* fix; fix emoji picker search styling ([59bec8b](https://bitbucket.org/atlassian/atlaskit/commits/59bec8b))
* fix; fix missing border radius on image based emoji ([a0bc069](https://bitbucket.org/atlassian/atlaskit/commits/a0bc069))
* fix; fix picker button sizing due to padding removal on Emoji ([a0930d4](https://bitbucket.org/atlassian/atlaskit/commits/a0930d4))
* fix; handle non-square emoji ([930aabc](https://bitbucket.org/atlassian/atlaskit/commits/930aabc))
* fix; only show pointer cursor in typeahead / picker emoji. ([957be05](https://bitbucket.org/atlassian/atlaskit/commits/957be05))
* fix; order field given larger weight when sorting emojis ([90818d8](https://bitbucket.org/atlassian/atlaskit/commits/90818d8))
* fix; selecting an emoji primarily matches on id then fallbacks to shortName if not found ([e8914b9](https://bitbucket.org/atlassian/atlaskit/commits/e8914b9))
* fix; simplify emoji so can be used as is in rendering ([0ebf05e](https://bitbucket.org/atlassian/atlaskit/commits/0ebf05e))
* fix; fix external story not initialising component correctly from config. ([e458ab1](https://bitbucket.org/atlassian/atlaskit/commits/e458ab1))


* breaking; Emoji markup and default padding/margins has changed. Anyone relying on this will likely have visual

breakages (i.e. the editor/renderer/reactions). Do visual review after upgrading.

ISSUES CLOSED: FS-904

## 13.4.4 (2017-05-01)

## 13.4.3 (2017-04-27)


* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 13.4.2 (2017-04-26)


* fix; fS-923 In the picker search, the cursor jumps to the end of the editor when typing ([cc7986d](https://bitbucket.org/atlassian/atlaskit/commits/cc7986d))
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 13.4.1 (2017-04-19)

## 13.4.0 (2017-04-19)


* fix; don't setState on promise return if component unmounted ([41facf8](https://bitbucket.org/atlassian/atlaskit/commits/41facf8))

## 13.3.0 (2017-04-18)


* feature; added ref field to access EmojiPicker component through the editor ([6f09435](https://bitbucket.org/atlassian/atlaskit/commits/6f09435))
* feature; optimise EmojiPicker rendering to improve responsiveness when all Emoji visible. ([9302aca](https://bitbucket.org/atlassian/atlaskit/commits/9302aca))

## 13.2.2 (2017-04-13)


* fix; fixed rendering of names in emoji typeahead when scrollbar is present ([49da9f8](https://bitbucket.org/atlassian/atlaskit/commits/49da9f8))

## 13.2.1 (2017-04-11)


* fix; cross browser fixes for Emoji ([b464f1e](https://bitbucket.org/atlassian/atlaskit/commits/b464f1e))
* fix; fix cropping of short name in IE/Edge ([add87b1](https://bitbucket.org/atlassian/atlaskit/commits/add87b1))
* fix; fix flexbox layout for compatibility with IE11. ([e111027](https://bitbucket.org/atlassian/atlaskit/commits/e111027))
* fix; fS-331 emoji picker search preserves order of resulting emojis within categories ([d92d07e](https://bitbucket.org/atlassian/atlaskit/commits/d92d07e))
* fix; fS-790 searching for emojis returns results grouped by initial category order ([7644e0a](https://bitbucket.org/atlassian/atlaskit/commits/7644e0a))
* fix; rearranged category order in selector to match standard coming in from service ([6b3f2eb](https://bitbucket.org/atlassian/atlaskit/commits/6b3f2eb))
* fix; remove extra padding on buttons in firefox. Adjust width of search to match design a ([2e522e7](https://bitbucket.org/atlassian/atlaskit/commits/2e522e7))

## 13.2.0 (2017-04-11)


* fix; disable clear on input in IE, as it doesn't fire an onChange event. ([7232430](https://bitbucket.org/atlassian/atlaskit/commits/7232430))
* fix; fix active category syncing on scroll in the Emoji Pickers. ([8278cc7](https://bitbucket.org/atlassian/atlaskit/commits/8278cc7))
* fix; polyfill Element.closest. Fix category selector disabled behaviour/hover behaviour. ([420b90f](https://bitbucket.org/atlassian/atlaskit/commits/420b90f))


* feature; remove categories from search results. Disable category selector. ([70ac388](https://bitbucket.org/atlassian/atlaskit/commits/70ac388))

## 13.1.1 (2017-04-11)


* fix; emoji should be wrapped in span instead of div ([87076d7](https://bitbucket.org/atlassian/atlaskit/commits/87076d7))
* fix; fix inconsistent naming for usage of EmojiRepository ([df7200a](https://bitbucket.org/atlassian/atlaskit/commits/df7200a))


* feature; performance improvements to EmojiPicker ([3b1f537](https://bitbucket.org/atlassian/atlaskit/commits/3b1f537))

## 13.1.0 (2017-04-04)


* feature; add count() method to EmojiTypeAhead for number of matching emoji displayed. ([f06ac39](https://bitbucket.org/atlassian/atlaskit/commits/f06ac39))

## 12.0.0 (2017-03-31)


* fix; update test data to match service. Fix missing mapping for fallback. ([99931b2](https://bitbucket.org/atlassian/atlaskit/commits/99931b2))


* feature; change what identifies an Emoji. ([8e4c476](https://bitbucket.org/atlassian/atlaskit/commits/8e4c476))
* feature; upgrade to new service schema, and new render rules. ([e61e059](https://bitbucket.org/atlassian/atlaskit/commits/e61e059))


* breaking; The service schema have changed, component changing to match as well as refine rendering to match

spec.

ISSUES CLOSED: FS-833
* breaking; EmojiId now must contain a shortcut in all cases. id is optional, but preferred. This maximises

compatibility with different storage formats (such as markdown).

ISSUES CLOSED: FS-833

## 11.2.3 (2017-03-24)


* fix; added the types property to package.json for emoji ([630d3b2](https://bitbucket.org/atlassian/atlaskit/commits/630d3b2))

## 11.2.1 (2017-03-21)

## 11.2.1 (2017-03-21)


* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 11.2.0 (2017-03-21)


* feature; allow rendering an emoji using only a shortcut. ([fcc400e](https://bitbucket.org/atlassian/atlaskit/commits/fcc400e))
* feature; export EmojiPlaceholder for consumers wishing to use ResourcedEmoji and ResourcedEm ([48c755e](https://bitbucket.org/atlassian/atlaskit/commits/48c755e))
* feature; separate shortcut based ResourceEmoji from EmojiId based implementation ([1972e5d](https://bitbucket.org/atlassian/atlaskit/commits/1972e5d))

## 11.1.1 (2017-03-17)


* fix; upgrade TypeScript to 2.2.1 ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))

## 11.1.0 (2017-03-09)


* feature; export addition interfaces/classes for Emoji ([b9f32a1](https://bitbucket.org/atlassian/atlaskit/commits/b9f32a1))

## 10.0.0 (2017-03-07)


* fix; make sure an id change in ResourcedEmoji is properly refresh. ([c72c651](https://bitbucket.org/atlassian/atlaskit/commits/c72c651))
* fix; rename ResourcedEmoji prop from id to emojiId for clarity. ([b519e0a](https://bitbucket.org/atlassian/atlaskit/commits/b519e0a))
* fix; require at least one provider to EmojiResource. ([f6feada](https://bitbucket.org/atlassian/atlaskit/commits/f6feada))


* feature; Support asynchronous emoji resource loading, searching, lookups, and rendering. ([298b5ac](https://bitbucket.org/atlassian/atlaskit/commits/298b5ac))


* breaking; Changes resource API to reflect async nature. More similar to Mention
resources, and first steps to a common base.
* breaking; EmojiPicker is now using EmojiResource instead of EmojiService to support
asynchronous loading and rendering.
* breaking; EmojiTypeAhead is now using EmojiResource instead of EmojiService to support
asynchronous loading and rendering.

ISSUES CLOSED: FS-780

## 9.0.2 (2017-02-27)


* empty commit to make components release themselves ([5511fbe](https://bitbucket.org/atlassian/atlaskit/commits/5511fbe))

## 9.0.1 (2017-02-22)


* fix; Import only 1 icon instead of whole icon package ([c5fd67b](https://bitbucket.org/atlassian/atlaskit/commits/c5fd67b))

## 2.0.0 (2017-02-22)


* Fix typescript build issue ([5209dee](https://bitbucket.org/atlassian/atlaskit/commits/5209dee))

## 2.0.0 (2017-02-21)

## 2.0.0 (2017-02-21)


* Typescript configuration changes to match latest core configuration. ([aa13d3f](https://bitbucket.org/atlassian/atlaskit/commits/aa13d3f))

## 2.0.0 (2017-02-21)

## 2.0.0 (2017-02-20)

## 2.0.0 (2017-02-20)

## 2.0.0 (2017-02-20)


* Migrating to typescript. Introduce breaking API changes. ([739cbde](https://bitbucket.org/atlassian/atlaskit/commits/739cbde))


* onSelection signature changed for both EmojiTypeAhead and EmojiPicker
* Type and prop changes across most components.
* EmojiResource response structure has changed to allow returning of media api token,
* event signatures from the type ahead component has changed.
Bump emoji version to prevent local linking by reactions

FS-318

## 1.0.1 (2017-02-20)


* Force release of [@atlaskit](https://github.com/atlaskit)/emoji ([0a322a7](https://bitbucket.org/atlassian/atlaskit/commits/0a322a7))

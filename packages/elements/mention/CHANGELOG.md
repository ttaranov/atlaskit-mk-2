# @atlaskit/mention

## 15.1.2
- [patch] [36c362f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/36c362f):

  - FS-3174 - Fix usage of gridSize() and borderRadius()

## 15.1.1
- [patch] [527b954](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/527b954):

  - FS-3174 - Remove usage of util-shared-styles from elements components

## 15.1.0
- [minor] Use relative units for font size and paddings in Mention component [b711063](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b711063)

## 15.0.11
- [patch] Analytics event's 'source' field from GasPayload type is now optional. In most cases, the 'source' field is expected to be set by the integrator through AnalyticsContext. Thus it's recommended that components do not set it to avoid overriding the one provided by the integrating product. Analytics listeners are handling the case where the 'source' field couldn't be found by setting the default value "unknown" before sending the event through the client. [1c0ea95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c0ea95)

## 15.0.10
- [patch] Updated dependencies [65c6514](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/65c6514)
  - @atlaskit/docs@5.0.8
  - @atlaskit/avatar@14.0.11
  - @atlaskit/tooltip@12.1.1
  - @atlaskit/icon@14.0.0

## 15.0.9
- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)
- [none] Updated dependencies [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)

## 15.0.8
- [patch] FS-2941 Stop using Request object and upgrade fetch-mock [dff332a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dff332a)

## 15.0.7
- [patch] propagate sessionId to the mentionTypeahead rendered event and service endpoints [0c37666](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0c37666)

## 15.0.6
- [patch] Updated dependencies [b12f7e6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b12f7e6)
  - @atlaskit/util-data-test@10.0.7

## 15.0.5
- [patch] update the dependency of react-dom to 16.4.2 due to vulnerability in previous versions read https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html for details [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
- [none] Updated dependencies [a4bd557](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a4bd557)
  - @atlaskit/util-data-test@10.0.4
  - @atlaskit/analytics-next-types@3.0.1
  - @atlaskit/tooltip@12.0.5
  - @atlaskit/analytics-next@3.0.4
  - @atlaskit/lozenge@6.1.4
  - @atlaskit/analytics@4.0.4
  - @atlaskit/icon@13.2.4
  - @atlaskit/avatar@14.0.6

## 15.0.4
- [patch] FS-2049 add userIds attribute to rendered event [a5d05bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5d05bc)
- [none] Updated dependencies [a5d05bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/a5d05bc)

## 15.0.3
- [patch] fixed TS errors [8eced90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eced90)
- [patch] fixed broken tests and added test for util/analytics [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)
- [patch] code improvements and tests added [0bc5732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bc5732)
- [patch] added mentionTypeAhead rendered analytics [c536e60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c536e60)
- [none] Updated dependencies [8eced90](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8eced90)
- [none] Updated dependencies [57b9d1e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/57b9d1e)
- [none] Updated dependencies [0bc5732](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0bc5732)
- [none] Updated dependencies [c536e60](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c536e60)

## 15.0.2
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/util-data-test@10.0.2
  - @atlaskit/tooltip@12.0.4
  - @atlaskit/icon@13.2.2
  - @atlaskit/lozenge@6.1.3
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/util-service-support@3.0.1
  - @atlaskit/analytics-gas-types@3.1.2
  - @atlaskit/analytics@4.0.3
  - @atlaskit/avatar@14.0.5

## 15.0.1
- [patch] FS-2020 add session id to typeahead plugin inside editor [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
- [none] Updated dependencies [5ae463f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ae463f)
  - @atlaskit/analytics-gas-types@3.1.1

## 15.0.0
- [major] ED-4769: wrap mentions like inline text [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
- [none] Updated dependencies [f6bf6c8](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f6bf6c8)
  - @atlaskit/util-data-test@10.0.1

## 14.0.2
- [patch] Fallback to use containerId from MentionResourceConfig if ContextIdentifier promise fails [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [patch] add support for childObjectId in ContextIdentifiers and pass it to the mention service endpoints [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)
- [none] Updated dependencies [5ecb9a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5ecb9a7)
- [none] Updated dependencies [6e31eb6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6e31eb6)

## 14.0.1
- [patch] Updated dependencies [e6b1985](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e6b1985)
  - @atlaskit/tooltip@12.0.0
  - @atlaskit/icon@13.1.1
  - @atlaskit/avatar@14.0.1

## 14.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/util-data-test@10.0.0
  - @atlaskit/tooltip@11.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/lozenge@6.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/util-service-support@3.0.0
  - @atlaskit/analytics-gas-types@3.0.0
  - @atlaskit/analytics@4.0.0
  - @atlaskit/icon@13.0.0
  - @atlaskit/avatar@14.0.0

## 13.1.10
- [patch] fixed typescript build errors [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
- [patch] code improvements and MentionContextIdentifier attributes made mandatory to sync with editor-common ContextIdentifier [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
- [patch] include containerId and objectId passed from editor-core into mention service requests [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
- [patch] Updated dependencies [c98857e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c98857e)
  - @atlaskit/util-data-test@9.1.19
- [patch] Updated dependencies [8a125a7](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a125a7)
  - @atlaskit/util-data-test@9.1.19
- [patch] Updated dependencies [cacfb53](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/cacfb53)
  - @atlaskit/util-data-test@9.1.19

## 13.1.9
- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/util-service-support@2.0.12
  - @atlaskit/util-data-test@9.1.18
  - @atlaskit/analytics-gas-types@2.1.4

## 13.1.8
- [patch] FS-2093 add mention insert analytics event [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)
- [none] Updated dependencies [30bbe5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/30bbe5a)

## 13.1.7


- [none] Updated dependencies [da63331](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/da63331)
  - @atlaskit/avatar@13.0.0
- [patch] Updated dependencies [7724115](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7724115)
  - @atlaskit/avatar@13.0.0

## 13.1.6
- [patch] FS-2092  add mention typeahead cancel analytics event [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)
- [none] Updated dependencies [40bd3fb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/40bd3fb)

## 13.1.5
- [patch] Updated dependencies [8a01bcd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8a01bcd)
  - @atlaskit/avatar@12.0.0

## 13.1.4
- [patch] added mention userId in the Mention lozenge analytics [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
- [patch] Updated dependencies [d7dca64](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d7dca64)
  - @atlaskit/util-data-test@9.1.16

## 13.1.3
- [patch] Updated dependencies [8d5053e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8d5053e)
  - @atlaskit/util-data-test@9.1.15

## 13.1.2
- [patch] Updated dependencies [0cf2f52](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/0cf2f52)
  - @atlaskit/util-data-test@9.1.14

## 13.1.1
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
  - @atlaskit/util-data-test@9.1.13
  - @atlaskit/tooltip@10.2.1
  - @atlaskit/lozenge@5.0.4
  - @atlaskit/icon@12.1.2

## 13.1.0
- [none] Updated dependencies [7217164](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7217164)
  - @atlaskit/util-data-test@9.1.11

## 13.0.0
- [major] makes styled-components a peer dependency and upgrades version range from 1.4.6 - 3 to ^3.2.6 [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/util-data-test@9.1.10
  - @atlaskit/tooltip@10.0.0
  - @atlaskit/icon@12.0.0
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/lozenge@5.0.0
  - @atlaskit/docs@4.0.0
  - @atlaskit/util-service-support@2.0.8
  - @atlaskit/analytics-gas-types@2.1.1
  - @atlaskit/analytics@3.0.2
  - @atlaskit/avatar@11.0.0

## 12.0.3
- [patch] Updated dependencies [1c87e5a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c87e5a)
  - @atlaskit/util-data-test@9.1.9

## 12.0.2
- [patch] Moved event tag to FabricElementsListener [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
- [patch] Updated dependencies [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)
  - @atlaskit/util-data-test@9.1.7

## 12.0.1
- [patch]  [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)
- [none] Updated dependencies [f87724e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f87724e)

## 12.0.0
- [patch] code improvements [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
- [major] fixed/added tests for analytics-next and code improvements [db1bafa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db1bafa)
- [patch] upgrade to analytics-next and GAS V3 [f150242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f150242)
- [patch] Updated dependencies [ba702bc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ba702bc)
  - @atlaskit/util-data-test@9.1.6
- [major] Updated dependencies [db1bafa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/db1bafa)
  - @atlaskit/util-data-test@9.1.6
- [patch] Updated dependencies [f150242](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f150242)
  - @atlaskit/util-data-test@9.1.6

## 11.1.5
- [patch] revert ED-2551 wrong cursor on special mentions [1cf64a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cf64a6)
- [none] Updated dependencies [1cf64a6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1cf64a6)

## 11.1.4
- [none] Updated dependencies [8fd4dd1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8fd4dd1)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [74f84c6](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/74f84c6)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [92cdf83](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/92cdf83)
  - @atlaskit/util-data-test@9.1.3
- [none] Updated dependencies [4151cc5](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4151cc5)
  - @atlaskit/util-data-test@9.1.3
- [patch] Updated dependencies [d662caa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d662caa)
  - @atlaskit/util-data-test@9.1.3
  - @atlaskit/icon@11.3.0
  - @atlaskit/tooltip@9.2.1
  - @atlaskit/avatar@10.0.6
  - @atlaskit/docs@3.0.4
  - @atlaskit/util-service-support@2.0.7
  - @atlaskit/lozenge@4.0.1
  - @atlaskit/analytics@3.0.1
- [patch] Updated dependencies [89146bf](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89146bf)
  - @atlaskit/util-data-test@9.1.3

## 11.1.3
- [patch] ED-2551 use default cursor on mention if no onClick is provided [e9cc83c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cc83c)
- [patch] Updated dependencies [e9cc83c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e9cc83c)

## 11.1.2
- [patch] Align font sizes for inline code, mentions and dates [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)
- [none] Updated dependencies [d2ef1af](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d2ef1af)

## 11.1.0
- [minor] If a Mention item is a team then render a TEAM lozenge automatically [d4976d4](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d4976d4)

## 11.0.0
- [major] Bump to React 16.3. [4251858](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4251858)

## 10.0.0
- [major] FS-1697 move elements packages to use util-data-test for test data [deb820a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/deb820a)

## 9.2.3
- [patch] Add "sideEffects: false" to AKM2 packages to allow consumer's to tree-shake [c3b018a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c3b018a)

## 9.2.2
- [patch] Update links in documentation [c4f7497](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c4f7497)

## 9.2.1
- [patch] Fix for styled-components types to support v1.4.x [75a2375](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/75a2375)

## 9.2.0
- [minor] Update styled-components dependency to support versions 1.4.6 - 3 [ceccf30](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ceccf30)

## 9.1.5
- [patch] fix mention and emoji bug related to MutationObserver API [dd0a69c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dd0a69c)

## 9.1.4
- [patch] Disable browser's spell check in mention lozenge [c04bf36](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c04bf36)

## 9.1.3
- [patch] FS-1091 remove direct dependency on url-search-params [e680d67](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e680d67)

## 9.1.2
- [patch] FS-1699 Fix mention sorting [ff33bef](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/ff33bef)

## 9.1.1
- [patch] fixed mention picker style typos [8bb40f0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8bb40f0)

## 9.1.0
- [minor] FS-1633 Change the way we use getUsersInContext [86b615c](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/86b615c)

## 9.0.0
- [patch] Added eslint-disable to example file [49491a9](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/49491a9)
- [major] Migrated mentions to new atlaskit-mk2 [dad3ccc](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dad3ccc)

## 8.5.1 (2018-01-09)
* bug fix; removed chai and sinon from tests (issues closed: fs-1606) ([f3a65cd](https://bitbucket.org/atlassian/atlaskit/commits/f3a65cd))

## 8.5.0 (2018-01-08)
* feature; allow MentionResource to optionally exclude the credentials from the request (issues closed: fs-1602) ([cbf913c](https://bitbucket.org/atlassian/atlaskit/commits/cbf913c))

## 8.4.1 (2017-12-20)
* bug fix; added minimum avatar dependency that has dist/esm folder for mention ([c90fbfa](https://bitbucket.org/atlassian/atlaskit/commits/c90fbfa))

## 8.4.0 (2017-12-19)
* feature; fS-1063 Code review remark ([93ff21e](https://bitbucket.org/atlassian/atlaskit/commits/93ff21e))
* bug fix; make sure root does not change whatever import we use ([085d483](https://bitbucket.org/atlassian/atlaskit/commits/085d483))
* feature; fS-1063 Fix code review remarks ([a247fa6](https://bitbucket.org/atlassian/atlaskit/commits/a247fa6))
* feature; fS-1063 When searching for mentionable users in a public room, I want users current ([b5310c7](https://bitbucket.org/atlassian/atlaskit/commits/b5310c7))

## 8.3.4 (2017-12-19)
* bug fix; bump packages to fixed version of analytics ([615e41c](https://bitbucket.org/atlassian/atlaskit/commits/615e41c))
* bug fix; explicit analytics bump in mentions ([688ed80](https://bitbucket.org/atlassian/atlaskit/commits/688ed80))

## 8.3.3 (2017-12-19)
* bug fix; reduce mention bundle size by referencing avatar directly from dist/esm folder ([2a88ef0](https://bitbucket.org/atlassian/atlaskit/commits/2a88ef0))

## 8.3.2 (2017-12-18)
* bug fix; fS-1587 fix TS errors in mention (issues closed: fs-1587) ([8dd4b86](https://bitbucket.org/atlassian/atlaskit/commits/8dd4b86))

## 8.3.1 (2017-12-15)
* bug fix; analytics now correctly a dep of the mention component ([da6cd5d](https://bitbucket.org/atlassian/atlaskit/commits/da6cd5d))
* bug fix; mention component no longer uses relative imports in one of the stories ([1109ecc](https://bitbucket.org/atlassian/atlaskit/commits/1109ecc))

## 8.3.0 (2017-12-13)
* bug fix; minor code improvements and fixed build error ([56bc6bb](https://bitbucket.org/atlassian/atlaskit/commits/56bc6bb))
* feature; added some mention front-end analytics ([74b7ee6](https://bitbucket.org/atlassian/atlaskit/commits/74b7ee6))

## 8.2.1 (2017-12-08)
* bug fix; update mock data under dist folder ([615dfd3](https://bitbucket.org/atlassian/atlaskit/commits/615dfd3))

## 8.2.0 (2017-11-26)
* feature; add more mock data to support integration tests ([9520323](https://bitbucket.org/atlassian/atlaskit/commits/9520323))

## 8.1.1 (2017-11-20)
* bug fix; presence client now actually requests stateMetadata to get focus mode (issues closed: fs-1487) ([7984774](https://bitbucket.org/atlassian/atlaskit/commits/7984774))

## 8.1.0 (2017-11-19)
* feature; add support for showing focus state on mention picker's avatars (issues closed: fs-1487) ([fe5b287](https://bitbucket.org/atlassian/atlaskit/commits/fe5b287))
* feature; updated icon and tooltip dependencies ([a10f196](https://bitbucket.org/atlassian/atlaskit/commits/a10f196))

## 8.0.1 (2017-10-22)
* bug fix; update styled-components dep and react peerDep ([6a67bf8](https://bitbucket.org/atlassian/atlaskit/commits/6a67bf8))

## 8.0.0 (2017-10-20)
* bug fix; fixed unit test failure. ([7878911](https://bitbucket.org/atlassian/atlaskit/commits/7878911))
* bug fix; added missing _notifyAllResultsListeners ([28cbfb2](https://bitbucket.org/atlassian/atlaskit/commits/28cbfb2))
* feature; expose MentionsResult interface from mention ([a817c63](https://bitbucket.org/atlassian/atlaskit/commits/a817c63))
* bug fix; added missing method _notifyAllResultsListeners to mention mock service and fixed re ([f057300](https://bitbucket.org/atlassian/atlaskit/commits/f057300))
* feature; added a dummy data wit the same last name. ([2ed7d4d](https://bitbucket.org/atlassian/atlaskit/commits/2ed7d4d))
* feature; fS-1372 Show an APP flag for App users like Bot ([0ff41fc](https://bitbucket.org/atlassian/atlaskit/commits/0ff41fc))
* bug fix; Revert code splitting of mentions/task-decisions as it introduces a performance problem (issues closed: fs-1396 / hnw-3183) ([bbecb14](https://bitbucket.org/atlassian/atlaskit/commits/bbecb14))
* bug fix; code splitted avatar in mention and task-decision packages (issues closed: ed-2776) ([19f8276](https://bitbucket.org/atlassian/atlaskit/commits/19f8276))
* bug fix; update background of "no access" mention lozenge to be transparent (issues closed: fs-1160) ([abd124d](https://bitbucket.org/atlassian/atlaskit/commits/abd124d))
* bug fix; update background colour of default mention lozenge (issues closed: fs-1319) ([391d263](https://bitbucket.org/atlassian/atlaskit/commits/391d263))
* bug fix; make mention lozenge 20px high to match rendering line height (issues closed: fs-1160) ([9d02973](https://bitbucket.org/atlassian/atlaskit/commits/9d02973))
* feature; update util-* dependencies ([eba115f](https://bitbucket.org/atlassian/atlaskit/commits/eba115f))
* feature; update mention dependencies: avatar, icon, lozenge, tooltip (issues closed: fs-1309) ([8686314](https://bitbucket.org/atlassian/atlaskit/commits/8686314))
* bug fix; based on PR comment, update the variable name ([4517be5](https://bitbucket.org/atlassian/atlaskit/commits/4517be5))
* bug fix; the name of the variable was not correct - cf AK-1433 (issues closed: ak-1433) ([85fe651](https://bitbucket.org/atlassian/atlaskit/commits/85fe651))
* bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))
* bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))
* bug fix; quick fix to avoid issues accessing support data via npm dependency ([4f9eee7](https://bitbucket.org/atlassian/atlaskit/commits/4f9eee7))
* bug fix; fix unused expression error throwing test ([22b75b2](https://bitbucket.org/atlassian/atlaskit/commits/22b75b2))
* feature; export test/story data for direct import. Not in bundle. (issues closed: fs-1205) ([eaa98fb](https://bitbucket.org/atlassian/atlaskit/commits/eaa98fb))
* bug fix; Merged in fix/FS-1051-copying-renderer-mention (pull request #3532) (issues closed: fs-1051) ([352f8eb](https://bitbucket.org/atlassian/atlaskit/commits/352f8eb))
* bug fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))
* bug fix; no user selection in mention list should result in the top item always being selecte (issues closed: fs-1178) ([07fc665](https://bitbucket.org/atlassian/atlaskit/commits/07fc665))
* feature; fS-1125 Adding test ([af91b18](https://bitbucket.org/atlassian/atlaskit/commits/af91b18))
* feature; fS-1125 Add callback parameter when subscribing to receive all results no just the ([cf7636a](https://bitbucket.org/atlassian/atlaskit/commits/cf7636a))
* bug fix; fS-1121 Don't return special mention when typing letter 'm' ([6c2ddd3](https://bitbucket.org/atlassian/atlaskit/commits/6c2ddd3))
* feature; restyle the Mentions error pop-up with a funkier exclamation sign and better wording (issues closed: fs-1115) ([8820193](https://bitbucket.org/atlassian/atlaskit/commits/8820193))
* bug fix; fS-1090 Fix test ([4262bee](https://bitbucket.org/atlassian/atlaskit/commits/4262bee))
* feature; fS-1090 Expose searchIndex so we can reuse it in test data + fix formatting ([aab39e6](https://bitbucket.org/atlassian/atlaskit/commits/aab39e6))
* breaking; New method isFiltering(query: string) on MentionProvider interface ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
* breaking; fS-1090 Expose isFiltering on MentionProvider interface && add query parameter in t ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
* bug fix; update avatar dependency ([64f6640](https://bitbucket.org/atlassian/atlaskit/commits/64f6640))
* breaking; The onOpen handlers will now be called when searches error. Previously they would only be called ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
* breaking; fix the Promise handling when a search is performed locally and remotely. (issues closed: fa-910) ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
* bug fix; fix for long standing react warning. :yakshave: ([cf88128](https://bitbucket.org/atlassian/atlaskit/commits/cf88128))
* bug fix; uncaught rejected provider promises, ui not updating. (issues closed: ed-1886) ([237cd54](https://bitbucket.org/atlassian/atlaskit/commits/237cd54))
* bug fix; fS-1073 Code review remarks + fix tests ([7611a77](https://bitbucket.org/atlassian/atlaskit/commits/7611a77))
* bug fix; fS-1073 Code review remarks ([003dc28](https://bitbucket.org/atlassian/atlaskit/commits/003dc28))
* bug fix; fS-1073 Reset search index on bootstrap ([5582b3c](https://bitbucket.org/atlassian/atlaskit/commits/5582b3c))
* bug fix; fS-1073 Filter mention locally from previous search results ([0c4788a](https://bitbucket.org/atlassian/atlaskit/commits/0c4788a))
* feature; enable the display of more specific error messages in the MentionList (issues closed: fs-910) ([db5efae](https://bitbucket.org/atlassian/atlaskit/commits/db5efae))
* bug fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))
* bug fix; add AbstractMentionResource export to editor-core (issues closed: fs-1029) ([308ad31](https://bitbucket.org/atlassian/atlaskit/commits/308ad31))
* bug fix; style fix to render tooltip properly in Firefox ([32d223d](https://bitbucket.org/atlassian/atlaskit/commits/32d223d))
* bug fix; render tooltip on same line as Mention component ([4b18886](https://bitbucket.org/atlassian/atlaskit/commits/4b18886))
* bug fix; fixed positioning for tooltip rendered for non-permitted mention ([83851e6](https://bitbucket.org/atlassian/atlaskit/commits/83851e6))
* feature; mentionItem without nickname rendered only using name ([b2fa672](https://bitbucket.org/atlassian/atlaskit/commits/b2fa672))
* bug fix; fS-691 Change whoops style to white and use akicon ([6f023d0](https://bitbucket.org/atlassian/atlaskit/commits/6f023d0))
* feature; fS-1026 When displaying the mention typeahead, I want to see users who don't have a ([a31d317](https://bitbucket.org/atlassian/atlaskit/commits/a31d317))
* bug fix; remove 'graphql' url component from presence's config (issues closed: fs-1030) ([b975e98](https://bitbucket.org/atlassian/atlaskit/commits/b975e98))
* bug fix; restore classname for confluence selenium tests ([e59c2f7](https://bitbucket.org/atlassian/atlaskit/commits/e59c2f7))
* bug fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
* bug fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
* bug fix; fix remaining mention tests ([d34d43b](https://bitbucket.org/atlassian/atlaskit/commits/d34d43b))
* breaking; ED-1701, ED-1702, ED-1704 ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
* breaking; remove polyfills from mention and emoji packages, use styled-components instead of t (issues closed: ed-1701, ed-1702, ed-1704) ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
* bug fix; fixed storybooks and bumped lozenge and avatar dependencies in mentions (issues closed: fs-902) ([71ddb2a](https://bitbucket.org/atlassian/atlaskit/commits/71ddb2a))
* bug fix; update legal copy to be more clear. Not all modules include ADG license. (issues closed: ak-2035) ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))
* bug fix; update legal copy and fix broken links for component README on npm. New contribution and (issues closed: ak-2035) ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))
* feature; add a class to mention node ([5996b7a](https://bitbucket.org/atlassian/atlaskit/commits/5996b7a))
* bug fix; properly handle the case where mention provider is null or undefined ([cf5dc91](https://bitbucket.org/atlassian/atlaskit/commits/cf5dc91))
* feature; displays nickname rather than username in MentionItem if exists for user (issues closed: fs-824) ([d3f4a81](https://bitbucket.org/atlassian/atlaskit/commits/d3f4a81))
* bug fix; updated avatar version from ^1.0.0 to ^2.0.0 in mention (issues closed: fab-2658) ([4ef6a16](https://bitbucket.org/atlassian/atlaskit/commits/4ef6a16))
* bug fix; resourcedMention component doesn't update provider correctly (issues closed: ed-1173) ([fa0c8fc](https://bitbucket.org/atlassian/atlaskit/commits/fa0c8fc))
* bug fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))
* bug fix; upgrade TypeScript to 2.2.1 (issues closed: ed-1104) ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))
* bug fix; merge branch 'master' into ED-738-ak-editor-shared-styles ([b514e44](https://bitbucket.org/atlassian/atlaskit/commits/b514e44))
* breaking;  ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
* breaking; rendering performance optimisations. (issues closed: fs-285) ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
* bug fix; fix some failing unit tests. ([4a4e32c](https://bitbucket.org/atlassian/atlaskit/commits/4a4e32c))
* breaking;  ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
* breaking; fS-214: Allow mentions to work with the session service; both using a header and a (issues closed: fs-214) ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
* feature; adding a resourced mention-component that takes a mentionProvider-promise ([aff9907](https://bitbucket.org/atlassian/atlaskit/commits/aff9907))
* breaking;  ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
* breaking; adding method highlightning mentions ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
* bug fix; merged master into ED-738 ([8afd112](https://bitbucket.org/atlassian/atlaskit/commits/8afd112))
* bug fix; select colour changed from dark to light ([1dc44ec](https://bitbucket.org/atlassian/atlaskit/commits/1dc44ec))
* bug fix; Query should be optional ([4e05ce1](https://bitbucket.org/atlassian/atlaskit/commits/4e05ce1))
* bug fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
* bug fix; Updates package to have correct dev-dependency for util-common-test ([403d232](https://bitbucket.org/atlassian/atlaskit/commits/403d232))
* bug fix; Updates docs  to mention using yarn to install ([5af03bf](https://bitbucket.org/atlassian/atlaskit/commits/5af03bf))
* bug fix; Rearrange tsconfig.json organisation to allow per-package configuration. ([6c6992d](https://bitbucket.org/atlassian/atlaskit/commits/6c6992d))
* bug fix; Updates package to use scoped ak packages ([db5c2f6](https://bitbucket.org/atlassian/atlaskit/commits/db5c2f6))

## 7.6.0 (2017-10-16)
* bug fix; fixed unit test failure. ([7878911](https://bitbucket.org/atlassian/atlaskit/commits/7878911))
* bug fix; added missing _notifyAllResultsListeners ([28cbfb2](https://bitbucket.org/atlassian/atlaskit/commits/28cbfb2))
* feature; expose MentionsResult interface from mention ([a817c63](https://bitbucket.org/atlassian/atlaskit/commits/a817c63))
* bug fix; added missing method _notifyAllResultsListeners to mention mock service and fixed re ([f057300](https://bitbucket.org/atlassian/atlaskit/commits/f057300))
* feature; added a dummy data wit the same last name. ([2ed7d4d](https://bitbucket.org/atlassian/atlaskit/commits/2ed7d4d))

## 7.5.0 (2017-09-26)
* feature; fS-1372 Show an APP flag for App users like Bot ([0ff41fc](https://bitbucket.org/atlassian/atlaskit/commits/0ff41fc))

## 7.4.3 (2017-09-21)
* bug fix; Revert code splitting of mentions/task-decisions as it introduces a performance problem (issues closed: fs-1396 / hnw-3183) ([bbecb14](https://bitbucket.org/atlassian/atlaskit/commits/bbecb14))

## 7.4.2 (2017-09-19)
* bug fix; code splitted avatar in mention and task-decision packages (issues closed: ed-2776) ([19f8276](https://bitbucket.org/atlassian/atlaskit/commits/19f8276))

## 7.4.1 (2017-09-13)
* bug fix; update background of "no access" mention lozenge to be transparent (issues closed: fs-1160) ([abd124d](https://bitbucket.org/atlassian/atlaskit/commits/abd124d))
* bug fix; update background colour of default mention lozenge (issues closed: fs-1319) ([391d263](https://bitbucket.org/atlassian/atlaskit/commits/391d263))
* bug fix; make mention lozenge 20px high to match rendering line height (issues closed: fs-1160) ([9d02973](https://bitbucket.org/atlassian/atlaskit/commits/9d02973))


## 7.4.0 (2017-08-28)
* feature; update util-* dependencies ([eba115f](https://bitbucket.org/atlassian/atlaskit/commits/eba115f))
* feature; update mention dependencies: avatar, icon, lozenge, tooltip (issues closed: fs-1309) ([8686314](https://bitbucket.org/atlassian/atlaskit/commits/8686314))

## 7.3.5 (2017-08-21)
* bug fix; based on PR comment, update the variable name ([4517be5](https://bitbucket.org/atlassian/atlaskit/commits/4517be5))
* bug fix; the name of the variable was not correct - cf AK-1433 (issues closed: ak-1433) ([85fe651](https://bitbucket.org/atlassian/atlaskit/commits/85fe651))

## 7.3.4 (2017-08-14)
* bug fix; publish only javascript files in dist/ ([367736a](https://bitbucket.org/atlassian/atlaskit/commits/367736a))

## 7.3.3 (2017-08-10)
* bug fix; fix .npm-ingore for fabric ts packages. ([f6f2edd](https://bitbucket.org/atlassian/atlaskit/commits/f6f2edd))

## 7.3.2 (2017-08-10)
* bug fix; quick fix to avoid issues accessing support data via npm dependency ([4f9eee7](https://bitbucket.org/atlassian/atlaskit/commits/4f9eee7))

## 7.3.1 (2017-07-27)
* fix; fix unused expression error throwing test ([22b75b2](https://bitbucket.org/atlassian/atlaskit/commits/22b75b2))

## 7.3.0 (2017-07-25)
* feature; export test/story data for direct import. Not in bundle. ([eaa98fb](https://bitbucket.org/atlassian/atlaskit/commits/eaa98fb))

## 7.2.2 (2017-07-25)
* fix; use class transform in loose mode in babel to improve load performance in apps ([fde719a](https://bitbucket.org/atlassian/atlaskit/commits/fde719a))

## 7.2.1 (2017-07-20)
* fix; no user selection in mention list should result in the top item always being selecte ([07fc665](https://bitbucket.org/atlassian/atlaskit/commits/07fc665))

## 7.2.0 (2017-07-07)
* feature; fS-1125 Add callback parameter when subscribing to receive all results no just the ([cf7636a](https://bitbucket.org/atlassian/atlaskit/commits/cf7636a))
* feature; fS-1125 Adding test ([af91b18](https://bitbucket.org/atlassian/atlaskit/commits/af91b18))

## 7.1.1 (2017-07-06)
* fix; fS-1121 Don't return special mention when typing letter 'm' ([6c2ddd3](https://bitbucket.org/atlassian/atlaskit/commits/6c2ddd3))

## 7.1.0 (2017-07-04)
* feature; restyle the Mentions error pop-up with a funkier exclamation sign and better wording ([8820193](https://bitbucket.org/atlassian/atlaskit/commits/8820193))

## 7.0.0 (2017-06-28)
* fix; fS-1090 Fix test ([4262bee](https://bitbucket.org/atlassian/atlaskit/commits/4262bee))
* feature; fS-1090 Expose searchIndex so we can reuse it in test data + fix formatting ([aab39e6](https://bitbucket.org/atlassian/atlaskit/commits/aab39e6))

## 6.0.1 (2017-06-28)
* fix; update avatar dependency ([64f6640](https://bitbucket.org/atlassian/atlaskit/commits/64f6640))
* feature; fS-1090 Expose isFiltering on MentionProvider interface && add query parameter in t ([6881c4b](https://bitbucket.org/atlassian/atlaskit/commits/6881c4b))
* breaking; New method isFiltering(query: string) on MentionProvider interface

## 6.0.0 (2017-06-27)
* fix; fix the Promise handling when a search is performed locally and remotely. ([1380702](https://bitbucket.org/atlassian/atlaskit/commits/1380702))
* breaking; The onOpen handlers will now be called when searches error. Previously they would only be called when there were search results.
* ISSUES CLOSED: FA-910

## 5.3.2 (2017-06-22)
* fix; fix for long standing react warning. :yakshave: ([cf88128](https://bitbucket.org/atlassian/atlaskit/commits/cf88128))
* fix; uncaught rejected provider promises, ui not updating. ([237cd54](https://bitbucket.org/atlassian/atlaskit/commits/237cd54))

## 5.3.0 (2017-06-20)
* fix; fS-1073 Code review remarks ([003dc28](https://bitbucket.org/atlassian/atlaskit/commits/003dc28))
* fix; fS-1073 Code review remarks + fix tests ([7611a77](https://bitbucket.org/atlassian/atlaskit/commits/7611a77))
* fix; fS-1073 Filter mention locally from previous search results ([0c4788a](https://bitbucket.org/atlassian/atlaskit/commits/0c4788a))
* fix; fS-1073 Reset search index on bootstrap ([5582b3c](https://bitbucket.org/atlassian/atlaskit/commits/5582b3c))

## 5.2.0 (2017-06-19)
* feature; enable the display of more specific error messages in the MentionList ([db5efae](https://bitbucket.org/atlassian/atlaskit/commits/db5efae))

## 5.1.2 (2017-06-15)
* fix; fix correct usage of react lifecycle and controlled input component. ([3ccd3ec](https://bitbucket.org/atlassian/atlaskit/commits/3ccd3ec))

## 5.1.1 (2017-06-14)
* fix; add AbstractMentionResource export to editor-core ([308ad31](https://bitbucket.org/atlassian/atlaskit/commits/308ad31))
* fix; fixed positioning for tooltip rendered for non-permitted mention ([83851e6](https://bitbucket.org/atlassian/atlaskit/commits/83851e6))
* fix; render tooltip on same line as Mention component ([4b18886](https://bitbucket.org/atlassian/atlaskit/commits/4b18886))
* fix; style fix to render tooltip properly in Firefox ([32d223d](https://bitbucket.org/atlassian/atlaskit/commits/32d223d))
* feature; mentionItem without nickname rendered only using name ([b2fa672](https://bitbucket.org/atlassian/atlaskit/commits/b2fa672))

## 5.1.0 (2017-06-05)
* fix; fS-691 Change whoops style to white and use akicon ([6f023d0](https://bitbucket.org/atlassian/atlaskit/commits/6f023d0))
* feature; fS-1026 When displaying the mention typeahead, I want to see users who don't have a ([a31d317](https://bitbucket.org/atlassian/atlaskit/commits/a31d317))

## 5.0.1 (2017-06-01)
* fix; remove 'graphql' url component from presence's config ([b975e98](https://bitbucket.org/atlassian/atlaskit/commits/b975e98))

## 5.0.0 (2017-06-01)
* fix; add polyfills for all storybooks, use es6-promise, URLSearchParams, Fetch API and Elemen ([db2f5cf](https://bitbucket.org/atlassian/atlaskit/commits/db2f5cf))
* fix; fix remaining mention tests ([d34d43b](https://bitbucket.org/atlassian/atlaskit/commits/d34d43b))
* fix; move all polyfills into devDeps ([d275563](https://bitbucket.org/atlassian/atlaskit/commits/d275563))
* fix; remove polyfills from mention and emoji packages, use styled-components instead of t ([f47a58e](https://bitbucket.org/atlassian/atlaskit/commits/f47a58e))
* fix; restore classname for confluence selenium tests ([e59c2f7](https://bitbucket.org/atlassian/atlaskit/commits/e59c2f7))
* breaking; ED-1701, ED-1702, ED-1704
* ISSUES CLOSED: ED-1701, ED-1702, ED-1704

## 4.2.3 (2017-05-09)
* fix; fixed storybooks and bumped lozenge and avatar dependencies in mentions ([71ddb2a](https://bitbucket.org/atlassian/atlaskit/commits/71ddb2a))

## 4.2.2 (2017-04-27)
* fix; update legal copy to be more clear. Not all modules include ADG license. ([f3a945e](https://bitbucket.org/atlassian/atlaskit/commits/f3a945e))

## 4.2.1 (2017-04-26)
* fix; update legal copy and fix broken links for component README on npm. New contribution and ([0b3e454](https://bitbucket.org/atlassian/atlaskit/commits/0b3e454))

## 4.2.0 (2017-04-10)
* feature; add a class to mention node ([5996b7a](https://bitbucket.org/atlassian/atlaskit/commits/5996b7a))

## 4.1.1 (2017-04-07)
* fix; properly handle the case where mention provider is null or undefined ([cf5dc91](https://bitbucket.org/atlassian/atlaskit/commits/cf5dc91))

## 4.1.0 (2017-04-04)
* feature; displays nickname rather than username in MentionItem if exists for user ([d3f4a81](https://bitbucket.org/atlassian/atlaskit/commits/d3f4a81))

## 4.0.5 (2017-03-27)
* fix; updated avatar version from ^1.0.0 to ^2.0.0 in mention ([4ef6a16](https://bitbucket.org/atlassian/atlaskit/commits/4ef6a16))

## 4.0.4 (2017-03-23)
* fix; resourcedMention component doesn't update provider correctly ([fa0c8fc](https://bitbucket.org/atlassian/atlaskit/commits/fa0c8fc))

## 4.0.2 (2017-03-21)
* fix; maintainers for all the packages were added ([261d00a](https://bitbucket.org/atlassian/atlaskit/commits/261d00a))

## 4.0.1 (2017-03-17)
* fix; upgrade TypeScript to 2.2.1 ([2aa28fc](https://bitbucket.org/atlassian/atlaskit/commits/2aa28fc))

## 4.0.0 (2017-03-13)
* feature; rendering performance optimisations. ([c99a94e](https://bitbucket.org/atlassian/atlaskit/commits/c99a94e))
* breaking; MentionItem no longer spreads Mention props as component props, moving to a single mention prop instead.
* Mention no longer duplicates time and status. Now only in presence property object.
* Event callbacks have changes, but in general should be code compatible.
* ISSUES CLOSED: FS-285

## 3.0.0 (2017-03-08)
* fix; fix some failing unit tests. ([4a4e32c](https://bitbucket.org/atlassian/atlaskit/commits/4a4e32c))
* feature; fS-214: Allow mentions to work with the session service; both using a header and a ([8e48507](https://bitbucket.org/atlassian/atlaskit/commits/8e48507))
* breaking; A different URL should be provided to the Mentions component
* ISSUES CLOSED: FS-214

## 2.1.0 (2017-03-02)
* feature; adding a resourced mention-component that takes a mentionProvider-promise ([aff9907](https://bitbucket.org/atlassian/atlaskit/commits/aff9907))

## 2.0.0 (2017-03-01)
* feature; adding method highlightning mentions ([08a1291](https://bitbucket.org/atlassian/atlaskit/commits/08a1291))
* breaking; MentionProvider now expects a "shouldHighlightMention"-method

## 1.4.0 (2017-02-23)
* Component for rendering mentions ([7a83043](https://bitbucket.org/atlassian/atlaskit/commits/7a83043))

## 1.3.6 (2017-02-23)
* Fixing internal types in MentionResource to reflect actual types. ([6829ace](https://bitbucket.org/atlassian/atlaskit/commits/6829ace))

## 1.3.5 (2017-02-21)
* Typescript configuration changes to match latest core configuration. ([aa13d3f](https://bitbucket.org/atlassian/atlaskit/commits/aa13d3f))

## 1.3.4 (2017-02-17)
* fix; select colour changed from dark to light ([1dc44ec](https://bitbucket.org/atlassian/atlaskit/commits/1dc44ec))
* undo padding change ([3c1f0c6](https://bitbucket.org/atlassian/atlaskit/commits/3c1f0c6))

## 1.3.2 (2017-02-16)
* fix; Query should be optional ([4e05ce1](https://bitbucket.org/atlassian/atlaskit/commits/4e05ce1))
* fix; refactor stories to use // rather than http:// ([a0826cf](https://bitbucket.org/atlassian/atlaskit/commits/a0826cf))
* Fixing types in mention resource ([60a3538](https://bitbucket.org/atlassian/atlaskit/commits/60a3538))

## 1.3.1 (2017-02-10)
* fix; Updates package to have correct dev-dependency for util-common-test ([403d232](https://bitbucket.org/atlassian/atlaskit/commits/403d232))

## 1.3.0 (2017-02-09)
* Adding method for getting number of mentions and made positioning props optional again ([51d0591](https://bitbucket.org/atlassian/atlaskit/commits/51d0591))
* uncomment tests that turned out not that flakey ([f100134](https://bitbucket.org/atlassian/atlaskit/commits/f100134))

## 1.2.0 (2017-02-07)
* Disable failing test, remove unused file. ([5075309](https://bitbucket.org/atlassian/atlaskit/commits/5075309))

## 1.1.1 (2017-02-07)
* fix; Updates docs  to mention using yarn to install ([5af03bf](https://bitbucket.org/atlassian/atlaskit/commits/5af03bf))
* fix; Rearrange tsconfig.json organisation to allow per-package configuration. ([6c6992d](https://bitbucket.org/atlassian/atlaskit/commits/6c6992d))
* Bump to a real version of lozenge ([b77862d](https://bitbucket.org/atlassian/atlaskit/commits/b77862d))
* Fix dependency on util-shared-styles ([9b4e3c6](https://bitbucket.org/atlassian/atlaskit/commits/9b4e3c6))
* Remove legacy .js file, add MentionItem export. ([5c021e2](https://bitbucket.org/atlassian/atlaskit/commits/5c021e2))

## 1.1.0 (2017-02-06)
* fix; Updates package to use scoped ak packages ([db5c2f6](https://bitbucket.org/atlassian/atlaskit/commits/db5c2f6))
* Export MentionItem for not list/picker use cases. ([7cdd17f](https://bitbucket.org/atlassian/atlaskit/commits/7cdd17f))
* Expose selectIndex and selectId apis on the relevant components. ([25d7ebf](https://bitbucket.org/atlassian/atlaskit/commits/25d7ebf))
* Migrating to typescrypt ([1bff7bc](https://bitbucket.org/atlassian/atlaskit/commits/1bff7bc))

# @atlaskit/analytics-listeners

## 4.0.6
- [patch] [c525423"
d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c525423"
d):

  - Remove unnecessary sufix in import

## 4.0.5
- [patch] Analytics event's 'source' field from GasPayload type is now optional. In most cases, the 'source' field is expected to be set by the integrator through AnalyticsContext. Thus it's recommended that components do not set it to avoid overriding the one provided by the integrating product. Analytics listeners are handling the case where the 'source' field couldn't be found by setting the default value "unknown" before sending the event through the client. [1c0ea95](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1c0ea95)

## 4.0.4
- [patch] FS-3057 pick fields from context [187d175](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/187d175)

## 4.0.3
- [patch] Introduce media analytics listener [e7d7ab1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7d7ab1)

## 4.0.2
- [patch] Update TS to 3.0 [f68d367](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f68d367)

## 4.0.1
- [patch] fixed imports, docs and made GasPayload package attributes optional [6be5eed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/6be5eed)
- [patch] use createAndFire function from analytics-next [095f356](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/095f356)
- [patch] Fixed TS errors and code improvements [b290312](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b290312)
- [patch] enable analytics-next TDs on analytics-listeners and analytics-namespaced-context [e65f377](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e65f377)

## 4.0.0
- [patch] fixed async tests and removed redundant componenthelpers [3599b88](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3599b88)
- [patch] Fixed async test expectations [b8c167d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b8c167d)
- [major] removed promise from FabricAnalyticsListener.client property [90ba6bd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/90ba6bd)

## 3.4.1
- [patch] Fix elements listener listening on wrong channel [2b817e1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2b817e1)

## 3.4.0
- [minor] Support the screen event type for navigation events [20b8844](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20b8844)

- [none] Updated dependencies [20b8844](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/20b8844)
- [patch] Updated dependencies [85ddb9e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/85ddb9e)
  - @atlaskit/analytics-gas-types@3.2.0

## 3.3.1
- [patch] Add next gen analytics to conversation component [dfa100e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfa100e)
- [patch] Updated dependencies [dfa100e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/dfa100e)
  - @atlaskit/analytics-namespaced-context@2.1.1

## 3.3.0
- [minor] Update navigation listener to process operational events [2d53fc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d53fc1)
- [none] Updated dependencies [2d53fc1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/2d53fc1)

## 3.2.0
- [minor] Update navigation listener to process NavigationAnalyticsContext [808b55b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/808b55b)

- [none] Updated dependencies [808b55b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/808b55b)
  - @atlaskit/analytics-namespaced-context@2.1.0
- [patch] Updated dependencies [89225ce](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/89225ce)
  - @atlaskit/analytics-namespaced-context@2.1.0

## 3.1.1
- [patch] Fix es5 exports of some of the newer modules [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
- [none] Updated dependencies [3f0cd7d](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/3f0cd7d)
  - @atlaskit/analytics-namespaced-context@2.0.3
  - @atlaskit/analytics-gas-types@3.1.3

## 3.1.0
- [minor] Add navigation listener that listens to events fired from within the new @atlaskit/navigation-next and @atlaskit/global-navigation packages. [fb67997](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/fb67997)
- [minor] Add excludedChannels prop to exclude listeners on certain channels from being rendered. This is primarily intended to prevent the events fired on the atlaskit channel from being captured so that duplicate events are not sent for atlaskit/core components. [d43b8a2](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/d43b8a2)

## 3.0.3
- [patch] Updated dependencies [acd86a1](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/acd86a1)
  - @atlaskit/button@9.0.4
  - @atlaskit/analytics-namespaced-context@2.0.2
  - @atlaskit/analytics-next@3.0.3
  - @atlaskit/docs@5.0.2
  - @atlaskit/analytics-gas-types@3.1.2

## 3.0.2
- [patch] Updated dependencies [80e90ed](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/80e90ed)
  - @atlaskit/analytics-namespaced-context@2.0.1

## 3.0.1
- [patch] fixes problem caused by source not always being set [00b1a71](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/00b1a71)

## 3.0.0

- [major] Updates to React ^16.4.0 [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
- [major] Updated dependencies [563a7eb](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/563a7eb)
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/analytics-namespaced-context@2.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics-gas-types@3.0.0
- [major] Updated dependencies [7edb866](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/7edb866)
  - @atlaskit/analytics-namespaced-context@2.0.0
  - @atlaskit/analytics-next@3.0.0
  - @atlaskit/button@9.0.0
  - @atlaskit/docs@5.0.0
  - @atlaskit/analytics-gas-types@3.0.0

## 2.1.3
- [patch] Move the tests under src and club the tests under unit, integration and visual regression [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
- [none] Updated dependencies [f1a9069](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/f1a9069)
  - @atlaskit/analytics-namespaced-context@1.0.3
  - @atlaskit/analytics-gas-types@2.1.4

## 2.1.2

- [patch] Add missing dependencies to packages to get the website to build [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)

- [none] Updated dependencies [9c32280](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9c32280)
  - @atlaskit/analytics-namespaced-context@1.0.2
- [none] Updated dependencies [99446e3](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/99446e3)
  - @atlaskit/docs@4.2.2
  - @atlaskit/analytics-namespaced-context@1.0.2
- [none] Updated dependencies [9bac948](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9bac948)
  - @atlaskit/analytics-namespaced-context@1.0.2
  - @atlaskit/docs@4.2.2

## 2.1.1
- [patch] removes requirement of children to be a single React node [53cba6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53cba6b)
- [none] Updated dependencies [53cba6b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/53cba6b)
  - @atlaskit/analytics-next@2.1.9

## 2.1.0
- [patch] merge analytics-next context into GAS payload attributes in FabricElementsListener [5d25e8b](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/5d25e8b)
- [minor] moved Atlaskit tests from src to __tests__ [1f78c33](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1f78c33)

## 2.0.2
- [patch] Clean Changelogs - remove duplicates and empty entries [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)
- [none] Updated dependencies [e7756cd](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/e7756cd)

## 2.0.1
- [none] Updated dependencies [9d20f54](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9d20f54)
  - @atlaskit/docs@4.1.0
  - @atlaskit/analytics-gas-types@2.1.2
  - @atlaskit/analytics-next@2.1.7

## 2.0.0
- [major] client parameter changed to a Promise in the listeners given Confluence gets the AnalyticsWebClient instance asynchronously [628e427](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/628e427)

## 1.2.0
- [patch] Throw error on component construction when client prop is missing rather than silently failing until an event is fired [4bbce97](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/4bbce97)
- [minor] Add some debug/error logging to listener which can be enabled via the logLevel prop [191a1ff](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/191a1ff)

## 1.1.1
- [patch] Updated dependencies [1e80619](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/1e80619)
  - @atlaskit/analytics-next@2.1.4
  - @atlaskit/docs@4.0.0
  - @atlaskit/analytics-gas-types@2.1.1

## 1.1.0
- [minor] Add listener for events fired by core atlaskit components [bcc7d8f](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/bcc7d8f)
- [patch] Updated dependencies [9be1db0](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/9be1db0)
  - @atlaskit/analytics-gas-types@2.1.0

## 1.0.2
- [patch] Moved event tag to FabricElementsListener [639ae5e](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/639ae5e)

## 1.0.1
- [patch] code improvements [44e55aa](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/44e55aa)
- [patch] added analytics-listeners package  [8e71e9a](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/8e71e9a)

# @atlaskit/media-picker

## 0.1.0

- [feat]
    * Added GIPHY file picking support to Media Picker Popup [#514](https://bitbucket.org/atlassian/mediakit-web/pull-requests/514/giphy-in-mediapicker/diff)
      * Added 'SEARCH_GIPHY', 'SEARCH_GIPHY_FULFILLED' and 'SEARCH_GIPHY_FAILED' actions
      * Added `giphyView.tsx` view and associated `giphySidebarItem.tsx`
    * Fixed hover state for sidebar items
      * `cursor: pointer` is only set for inactive sidebar items
      * background hover state is only set for inactive sidebar items
    * Fixed request being sent to `/picker/service/{serviceName}/{accountId}/folder` when there were no connected accounts and/or the service selected was NOT dropbox or google

## 0.0.2

- [patch] Migrate MediaPicker into new repo [494c424](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/494c424)

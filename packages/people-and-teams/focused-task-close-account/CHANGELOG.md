# @atlaskit/focused-task-close-account

## 0.2.0
- [minor] [c8ea304](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/c8ea304):

  - Bug fix - index.ts file moved to src folder. The component couldn’t be imported as the index file was not in the correct directory. Minor changes - ‘Learn more link’ now a part of the FocusedTask props as different links could be sent from unified-profile and id-org manager flow. accessibleSites prop is now an array of string instead of the AccessibleSitesResponse. If accessibleSites data is empty or null, the text displayed will be different. Added deactivateUserHandler prop to DeleteUserOverviewScreen, so that if it's not passed, the warning section is not displayed.

## 0.1.0
- [minor] initial release of the focused task close account component [b0bfb38](https://bitbucket.org/atlassian/atlaskit-mk-2/commits/b0bfb38)

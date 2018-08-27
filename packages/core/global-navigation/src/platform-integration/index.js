// @flow

import notificationConfig from './notification';

export default ({ cloudId, fabricNotificationLogUrl }, openDrawer) => ({
  notification: notificationConfig({ cloudId, fabricNotificationLogUrl }),
});

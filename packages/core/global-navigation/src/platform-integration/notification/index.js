// @flow

export default {
  notification: {
    badge: Badge,
    tooltip: 'notification',
    label: 'notification',
    onNotificationClick: () => console.log('test'),
    notificationDrawerContent: NotificationDrawer,
    onNotificationDrawerOpen: () => console.log('notification drawer opened'),
    onNotificationDrawerClose: () => console.log('notification drawer closed'),
  },
};

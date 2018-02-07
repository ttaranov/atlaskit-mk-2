export interface NotificationCountResponse {
  count: number;
}

export interface NotificationLogProvider {
  countUnseenNotifications(): Promise<NotificationCountResponse>;
}

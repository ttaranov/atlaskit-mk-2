import { UserEvent } from '../outer/analytics/events';
export interface MediaPickerContext {
  trackEvent: (userEvent: UserEvent) => void;
}

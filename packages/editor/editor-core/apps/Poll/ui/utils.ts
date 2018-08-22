import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import { generateUuid } from '@atlaskit/editor-common';

export const getExpiresInLabel = (finishDate: number) => {
  const now = new Date().valueOf();
  if (finishDate <= now) {
    return `finished`;
  }

  const daysLeft = differenceInCalendarDays(finishDate, now);
  if (daysLeft > 1) {
    return `${daysLeft} days left`;
  }
  const hoursLeft = differenceInHours(finishDate, now);
  if (hoursLeft > 1) {
    return `${hoursLeft} hours left`;
  }
  const minutesLeft = differenceInMinutes(finishDate, now);
  if (minutesLeft > 1) {
    return `${minutesLeft} minutes left`;
  }

  // less than a minute
  return `Hurry up! This poll is almost finished!`;
};

// check if the user has already voted
export const isCompleted = ({ votes, userId }) => {
  for (let i = 0, count = votes.length; i < count; i++) {
    if (votes[i].userId === userId) {
      return true;
    }
  }

  return false;
};

export const getUserId = (): string | null => {
  const storageName = 'editor-apps-poll-user-id';
  let userId = localStorage.getItem(storageName);
  if (!userId) {
    userId = generateUuid();
    localStorage.setItem(storageName, userId);
  }

  return userId;
};

import { UserTracker } from '../outer/analytics/tracker';
import { ErrorException } from '../outer/analytics/events';

export const handleError = function(alias: string, description?: string): void {
  const stackTrace = Error().stack || '';
  const descr = description || '';
  const errorMessage = `${alias}: ${descr} \n ${stackTrace}`;
  const tracker = new UserTracker(); // handleError has it's own usertracker

  tracker.track()(new ErrorException(alias, stackTrace, description));
  // tslint:disable-next-line:no-console
  console.error(errorMessage);
};

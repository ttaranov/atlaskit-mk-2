import * as moment from 'moment';

moment.defineLocale('en-ADG', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'just now',
    ss: '%d seconds ago',
    m: 'a minute ago',
    mm: '%d minutes ago',
    h: 'an hour ago',
    hh: '%d hours ago',
    d: 'yesterday',
    dd: '%d days ago',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years',
  },
});

/**
 * ADG3 relative time implementation, English only
 * @link https://hello.atlassian.net/wiki/spaces/ADG/pages/195123084/Date+formats+product+1.0+spec
 */
export function relativeTime(time: moment.Moment | string | Date) {
  const momentTime = moment(time).clone();
  momentTime.locale('en-ADG');

  if (momentTime.isBefore(moment().subtract(7, 'days'))) {
    return momentTime.format('DD MMM YYYY LT');
  }

  return momentTime.fromNow(true);
}

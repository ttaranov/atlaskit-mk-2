// @flow

/*
cleanProps removes props added by the withAnalytics HOC from an object
*/

// flowlint-next-line unclear-type:off
function cleanProps(props: Object) {
  /* eslint-disable no-unused-vars */
  const {
    analyticsId,
    analyticsData,
    delegateAnalyticsEvent,
    fireAnalyticsEvent,
    firePrivateAnalyticsEvent,
    getParentAnalyticsData,
    ...cleanedProps
  } = props;
  /* eslint-enable no-unused-vars */
  return cleanedProps;
}

export default cleanProps;

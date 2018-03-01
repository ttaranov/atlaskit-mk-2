class Button extends Component {}
export default withAnalyticsContext({
  component: 'button',
  package: name,
  version: version
})(withAnalyticsEvents({
  onClick: createAnalyticsEvent => {
    const consumerEvent = createAnalyticsEvent({
      action: 'click',
    });
    consumerEvent.clone().fire('atlaskit');

    return consumerEvent;
  }
})(Button));


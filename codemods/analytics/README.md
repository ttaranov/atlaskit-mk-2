# Analytics codemod

This codemod adds analytics to a package and/or component.

How it works:

1. Adds the component and its callbacks to the 'Instrumented Components' list markdown file (packages/elements/analytics-next/docs/20-our-component.js)
1.5. Add analytics-next to package.json dependencies
2. Adds analytics-next and package.json imports to the default export of the file specified to codemod
3. Wraps the default export of the file specified to codemod with two HOCs
  a) WithAnalyticsEvents:
    * The first argument to this will be a map of prop callbacks to functions that create an analytics event (Prop callbacks could be codemod args?)
  b) withAnalyticsContext:
    * The first argument to this will be 3 fields (component, package, version)
4. Update the types of the prop callbacks to include `analyticsEvent: UIAnalyticsEvent`, importing the file where necessary and avoiding this if the type isn't
   a flow arrow function type
5. Add tests to the test file specified
  a) Adds relevant imports
  b) Adds a test for each prop callback that the last argument is an analytics event
```
    it('should pass analytics event as last argument to onClick handler', () => {
  const spy = jest.fn();
  const wrapper = mount(<Button onClick={spy}>button</Button>);
  wrapper.find('button').simulate('click');

  const analyticsEvent = spy.mock.calls[0][1];
  expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
  expect(analyticsEvent.payload).toEqual(
    expect.objectContaining({
      action: 'click',
    }),
  );
});
```
  c) Add a test for each prop callback that an atlaskit analytics event was fired
  ```
    it('should fire an atlaskit analytics event on click', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <Button />
      </AnalyticsListener>,
    );

    wrapper.find(Button).simulate('click');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'click' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'button',
        package: name,
        version,
      },
    ]);
  });
  ```
  d) Add test that analytics context prop provides context:
  ```
    it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<Button />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'button',
      package: name,
      version,
    });
  });
  ```
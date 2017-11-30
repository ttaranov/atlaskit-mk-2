// @flow
import React from 'react';
import Badge from '../src';
import { SpotlightManager } from '../src';

export default function Example() {
  return (
    <LayerManager>
      <SpotlightManager component={Wrapper}>
        <p>Basic Usage</p>
        <SpotlightManager component={Wrapper}>
          <SpotlightBasic />
        </SpotlightManager>

        <p>Dialog Placement</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightPlacement />
          </SpotlightManager>
        </LayerManager>

        <p>Dialog Width</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightWidth />
          </SpotlightManager>
        </LayerManager>

        <p>Target Radius</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightRadius />
          </SpotlightManager>
        </LayerManager>

        <p>Target Background</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightReplacement />
          </SpotlightManager>
        </LayerManager>

        <p>Target Replacement</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightBackground />
          </SpotlightManager>
        </LayerManager>

        <p>Auto Scroll</p>
        <LayerManager>
          <SpotlightManager component={Wrapper}>
            <SpotlightScroll />
          </SpotlightManager>
        </LayerManager>

        <p>Layout Props</p>

        <SpotlightLayout />
      </SpotlightManager>
    </LayerManager>
  );
}

storiesOf('Spotlight', module)
  .addDecorator(story => (
    <LayerManager>
      <SpotlightManager component={Wrapper}>{story()}</SpotlightManager>
    </LayerManager>
  ))
  .add('Basic Usage', () => <SpotlightBasic />)
  .add('Dialog Placement', () => <SpotlightPlacement />)
  .add('Dialog Width', () => <SpotlightWidth />)
  .add('Target Radius', () => <SpotlightRadius />)
  .add('Target Background', () => <SpotlightBackground />)
  .add('Target Replacement', () => <SpotlightReplacement />)
  .add('Auto Scroll', () => <SpotlightScroll />)
  .add('Layout Props', () => <SpotlightLayout />);

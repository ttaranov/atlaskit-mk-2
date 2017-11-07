// @flow
/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorB200, akColorN300, akColorN700, akColorB400 } from '@atlaskit/util-shared-styles';
import styled from 'styled-components';
import * as logos from '../../src';

const Centered = styled.div`
  display: flex;
  > * margin: 8px 0;
`;

const sizePresets = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

const sizeRange = (Logo, colorPresetProps, size) => (
  <Centered>
    <Logo
      size={size}
      {...colorPresetProps}
    />
  </Centered>
);

const colorPresets = [
  {
    textColor: akColorN700,
    iconColor: akColorB200,
    iconGradientStart: akColorB400,
    iconGradientStop: akColorB200,
  },
  {
    textColor: 'currentColor',
    iconColor: 'currentColor',
    iconGradientStart: 'rgba(0, 0, 0, 0.4)',
    iconGradientStop: 'currentColor',
  },
  {
    textColor: akColorB400,
    iconColor: akColorB200,
    iconGradientStart: akColorB400,
    iconGradientStop: akColorB200,
  },
  {
    textColor: 'orange',
    iconColor: 'royalblue',
  },
  {
    textColor: 'rgb(60, 160, 180)',
    iconColor: 'rgb(100, 190, 60)',
    iconGradientStart: 'rgb(50, 100, 50)',
    iconGradientStop: 'rgb(100, 190, 60)',
  },
];

export default class InteractiveLogo extends Component {
  state = {
    colorIndex: 0,
    sizeIndex: 1,
  }

  toggleColor = () => {
    this.setState({ colorIndex: (this.state.colorIndex + 1) % colorPresets.length });
  }

  toggleSize = () => {
    this.setState({ sizeIndex: (this.state.sizeIndex + 1) % sizePresets.length });
  }

  render() {
    const colorPreset = colorPresets[this.state.colorIndex];
    const sizePreset = sizePresets[this.state.sizeIndex];

    return (
      <div style={{ color: akColorN300 }}>
        <ButtonGroup>
          <Button onClick={this.toggleSize}>Change size</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button onClick={this.toggleColor}>Change colour</Button>
        </ButtonGroup>
        {sizeRange(logos.AtlassianLogo, colorPreset, sizePreset)}
        {sizeRange(logos.BitbucketLogo, colorPreset, sizePreset)}
        {sizeRange(logos.ConfluenceLogo, colorPreset, sizePreset)}
        {sizeRange(logos.HipchatLogo, colorPreset, sizePreset)}
        {sizeRange(logos.JiraLogo, colorPreset, sizePreset)}
        {sizeRange(logos.JiraCoreLogo, colorPreset, sizePreset)}
        {sizeRange(logos.JiraServiceDeskLogo, colorPreset, sizePreset)}
        {sizeRange(logos.JiraSoftwareLogo, colorPreset, sizePreset)}
        {sizeRange(logos.StatuspageLogo, colorPreset, sizePreset)}
        {sizeRange(logos.StrideLogo, colorPreset, sizePreset)}
      </div>
    );
  }
}

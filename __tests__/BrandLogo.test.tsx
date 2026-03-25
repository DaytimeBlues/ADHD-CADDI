import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BrandLogo } from '../src/components/BrandLogo';

describe('BrandLogo', () => {
  it('renders the Google brand mark accessibly', () => {
    render(
      <BrandLogo name="google" size={20} accessibilityLabel="Google logo" />,
    );

    expect(screen.getByLabelText('Google logo')).toBeTruthy();
  });

  it('renders the Todoist brand mark accessibly', () => {
    render(
      <BrandLogo name="todoist" size={20} accessibilityLabel="Todoist logo" />,
    );

    expect(screen.getByLabelText('Todoist logo')).toBeTruthy();
  });
});

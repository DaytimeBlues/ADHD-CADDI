import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GlowCard } from '../src/ui/cosmic/GlowCard';

describe('GlowCard', () => {
  it('does not expose button semantics when no onPress handler is provided', () => {
    render(
      <GlowCard>
        <Text>Card content</Text>
      </GlowCard>,
    );

    expect(screen.getByText('Card content')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});

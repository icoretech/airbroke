// __tests__/pages/home.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import HomePage from '../../app/page';

describe('Home', () => {
  test('renders a heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /Hello, welcome to Airbroke/i,
    });

    expect(heading).toBeDefined();
  });
});

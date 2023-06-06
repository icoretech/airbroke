import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page';

describe('Home', () => {
  it('renders a heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /welcome to Airbroke!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

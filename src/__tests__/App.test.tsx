import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import App from '../App';

test('loads and displays greeting', async () => {

    render(<App />);



    expect(screen.getByText('Plan de prevention')).toBeInTheDocument();

});

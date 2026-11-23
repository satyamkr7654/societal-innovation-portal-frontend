import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, test, vi } from 'vitest';
import Footer from '../components/layout/Footer';
import EvidenceCard from '../components/problems/EvidenceCard';
import Button from '../components/ui/Button';
import PhotoUpload from '../components/ui/PhotoUpload';

test('a button with an address is a link, with no button inside', () => {
  render(
    <MemoryRouter>
      <Button to="/login">Sign In</Button>
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Sign In' }).getAttribute('href')).toBe(
    '/login'
  );
  expect(screen.queryByRole('button')).toBeNull();
});

test('the photo opens in a dialog that Esc closes', async () => {
  const user = userEvent.setup();
  render(<EvidenceCard problem={{ id: 'X', description: 'd', photoUrl: '/p.jpg' }} />);
  await user.click(screen.getByRole('button', { name: /View Full Image/ }));
  const dialog = screen.getByRole('dialog', { name: 'Photo of the problem' });
  // jsdom has no Esc handling; browsers send "cancel"
  dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
  await vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('the photo picker can be reached and used by keyboard', async () => {
  const user = userEvent.setup();
  const { container } = render(<PhotoUpload onFileChange={() => {}} />);
  const open = vi.spyOn(container.querySelector('input'), 'click');
  screen.getByRole('button', { name: 'Browse files' }).focus();
  await user.keyboard('{Enter}');
  expect(open).toHaveBeenCalledTimes(1);
});

test('the footer says this is not a government website', () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  expect(screen.getByText(/Not an official government website/)).toBeTruthy();
});

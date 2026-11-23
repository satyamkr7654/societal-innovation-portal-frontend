import { describe, expect, it } from 'vitest';
import * as auth from './authService';

const newCitizen = {
  name: 'Asha Devi',
  email: 'Badminton@Gmail.com',
  password: 'Secret123',
  role: 'citizen',
  phone: '9876543210',
};

describe('login', () => {
  it('rejects a wrong password and creates no session', async () => {
    const attempt = auth.login({ email: 'citizen.ramesh@gmail.com', password: 'nope' });
    await expect(attempt).rejects.toThrow('Incorrect email or password');
    expect(await auth.restoreSession()).toBeNull();
  });

  it('gives the same message for an unknown email', async () => {
    const attempt = auth.login({ email: 'nobody@x.com', password: 'Password123' });
    await expect(attempt).rejects.toThrow('Incorrect email or password');
  });

  it('restores the session and clears it on logout', async () => {
    const { email } = auth.DEMO_ACCOUNTS[0];
    await auth.login({ email, password: auth.DEMO_PASSWORD });
    expect((await auth.restoreSession()).role).toBe('citizen');
    await auth.logout();
    expect(await auth.restoreSession()).toBeNull();
  });
});

describe('register', () => {
  it('keeps the chosen role whatever the email says', async () => {
    await auth.register(newCitizen);
    const user = await auth.login({
      email: 'badminton@gmail.com',
      password: 'Secret123',
    });
    expect(user.role).toBe('citizen');
  });

  it('never stores the plain password or returns its hash', async () => {
    const user = await auth.register(newCitizen);
    expect(JSON.stringify({ ...localStorage })).not.toContain('Secret123');
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('refuses a duplicate email in any casing', async () => {
    await auth.register(newCitizen);
    await expect(
      auth.register({ ...newCitizen, email: 'BADMINTON@gmail.com' })
    ).rejects.toThrow('already exists');
  });

  it('refuses to create admins', async () => {
    await expect(auth.register({ ...newCitizen, role: 'admin' })).rejects.toThrow(
      'cannot be self-registered'
    );
  });
});

describe('session', () => {
  it('ignores a role written into the session', async () => {
    const user = await auth.register(newCitizen);
    await auth.login({ email: newCitizen.email, password: newCitizen.password });
    localStorage.setItem(
      'sih26043_session',
      JSON.stringify({ userId: user.id, role: 'admin' })
    );
    expect((await auth.restoreSession()).role).toBe('citizen');
  });

  it.each(['not json', 'null', '{"userId":"missing"}'])('survives %s', async (value) => {
    localStorage.setItem('sih26043_session', value);
    expect(await auth.restoreSession()).toBeNull();
  });
});

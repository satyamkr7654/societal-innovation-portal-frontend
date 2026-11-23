import { readJson, writeJson, removeKey } from './storage';

/**
 * Demo account store, kept in this browser only.
 * It makes the demo behave consistently but is NOT a security boundary: anyone can edit
 * localStorage. Phase 4 replaces this file with server-side authentication.
 */
const ACCOUNTS_KEY = 'sih26043_accounts';
const SESSION_KEY = 'sih26043_session';

export const DEMO_PASSWORD = 'Password123';

export const DEMO_ACCOUNTS = [
  {
    id: 'usr_cit_01',
    name: 'Ramesh Kumar',
    email: 'citizen.ramesh@gmail.com',
    phone: '9835123450',
    role: 'citizen',
    organizationName: null,
    label: 'Citizen',
  },
  {
    id: 'usr_adm_01',
    name: 'Admin Officer',
    email: 'admin.dept@jharkhand.gov.in',
    role: 'admin',
    organizationName: 'Govt. Higher Education Dept',
    label: 'Govt Admin',
  },
  {
    id: 'usr_uni_01',
    name: 'Faculty Lead',
    email: 'faculty@bitmesra.ac.in',
    role: 'university',
    organizationName: 'BIT Mesra R&D Cell',
    label: 'University',
  },
  {
    id: 'usr_ind_01',
    name: 'CSR Manager',
    email: 'csr@tatasteel.com',
    role: 'industry',
    organizationName: 'Tata Steel Foundation',
    label: 'Industry CSR',
  },
];

// Government admins cannot self-register
const REGISTERABLE_ROLES = ['citizen', 'university', 'industry'];

const normalizeEmail = (email) => email.trim().toLowerCase();

const isAccount = (a) =>
  Boolean(a) &&
  ['id', 'name', 'email', 'role', 'salt', 'passwordHash'].every(
    (field) => typeof a[field] === 'string'
  ) &&
  REGISTERABLE_ROLES.includes(a.role);

const readAccounts = () => readJson(ACCOUNTS_KEY, Array.isArray, []).filter(isAccount);

const toHex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Please open the portal on localhost or over HTTPS.');
  }
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: 200000 },
    key,
    256
  );
  return toHex(new Uint8Array(bits));
}

/** Only these fields ever reach the UI. */
const toPublicUser = ({ id, name, email, phone, role, organizationName }) => ({
  id,
  name,
  email,
  phone: phone || null,
  role,
  organizationName: organizationName || null,
});

export async function registerAccount({
  name,
  email,
  password,
  role,
  phone,
  organizationName,
}) {
  if (!REGISTERABLE_ROLES.includes(role)) {
    throw new Error('This role cannot be self-registered.');
  }
  const normalized = normalizeEmail(email);
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const passwordHash = await hashPassword(password, salt);

  // Read after the async hash so a concurrent registration is not overwritten
  const accounts = readAccounts();
  if ([...DEMO_ACCOUNTS, ...accounts].some((a) => a.email === normalized)) {
    throw new Error('An account with this email already exists.');
  }

  const account = {
    id: `usr_${toHex(crypto.getRandomValues(new Uint8Array(8)))}`,
    name: name.trim(),
    email: normalized,
    phone: phone || null,
    role,
    organizationName: organizationName?.trim() || null,
    salt,
    passwordHash,
  };
  writeJson(ACCOUNTS_KEY, [...accounts, account]);
  return toPublicUser(account);
}

export async function signIn({ email, password }) {
  const normalized = normalizeEmail(email);
  const demo = DEMO_ACCOUNTS.find((a) => a.email === normalized);
  const account = demo || readAccounts().find((a) => a.email === normalized);

  let passwordMatches = false;
  if (demo) {
    passwordMatches = password === DEMO_PASSWORD;
  } else if (account) {
    passwordMatches =
      (await hashPassword(password, account.salt)) === account.passwordHash;
  }

  // Same message either way, so it does not reveal which emails are registered
  if (!passwordMatches) throw new Error('Incorrect email or password.');

  writeJson(SESSION_KEY, { userId: account.id });
  return toPublicUser(account);
}

/** The role always comes from the account record, never from the session. */
export function getSessionUser() {
  const session = readJson(SESSION_KEY, (v) => typeof v?.userId === 'string', null);
  if (!session) return null;
  const account = [...DEMO_ACCOUNTS, ...readAccounts()].find(
    (a) => a.id === session.userId
  );
  return account ? toPublicUser(account) : null;
}

export function signOut() {
  removeKey(SESSION_KEY);
}

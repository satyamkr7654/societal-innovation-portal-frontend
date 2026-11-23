import { describe, expect, it } from 'vitest';
import { getRegisterSchema, loginSchema } from './authSchemas';
import { submitProblemSchema } from './problemSchemas';

const problem = {
  title: 'Broken water pipe near school',
  description: 'Water has been leaking here for many days.',
  category: 'Water',
  district: 'Dhanbad',
  address: 'Near Bank More',
  location: { lat: 23.79, lng: 86.43 },
};
const failingFields = (schema, data) => {
  const result = schema.safeParse(data);
  return result.success ? [] : result.error.issues.map((issue) => issue.path[0]);
};

describe('submitProblemSchema', () => {
  it('accepts a valid report and trims text', () => {
    const result = submitProblemSchema.parse({
      ...problem,
      title: '  Broken water pipe  ',
    });
    expect(result.title).toBe('Broken water pipe');
  });

  it.each([
    ['title', ' '.repeat(20)],
    ['description', ' '.repeat(40)],
    ['address', '        '],
    ['category', 'Unknown'],
    ['district', 'Mumbai'],
    ['location', null],
    ['location', { lat: 28.6, lng: 77.2 }], // Delhi
    ['location', { lat: 24.16, lng: 83.8 }], // Garhwa, far from Dhanbad
  ])('rejects %s = %j', (field, value) => {
    expect(failingFields(submitProblemSchema, { ...problem, [field]: value })).toEqual([
      field,
    ]);
  });
});

describe('auth schemas', () => {
  const account = {
    name: 'Asha Devi',
    email: 'asha@example.com',
    password: 'Secret123',
    confirmPassword: 'Secret123',
    phone: '9876543210',
  };

  it('accepts a valid citizen', () => {
    expect(failingFields(getRegisterSchema('citizen'), account)).toEqual([]);
  });

  it.each([
    ['phone', '12345'],
    ['password', 'short1'],
    ['confirmPassword', 'Different1'],
    ['email', 'bad'],
  ])('rejects %s = %s', (field, value) => {
    const fields = failingFields(getRegisterSchema('citizen'), {
      ...account,
      [field]: value,
    });
    expect(fields).toContain(field);
  });

  it('requires the organisation name per role', () => {
    expect(failingFields(getRegisterSchema('university'), account)).toContain(
      'institutionName'
    );
    expect(failingFields(getRegisterSchema('industry'), account)).toContain(
      'companyName'
    );
  });

  it('requires a password to sign in', () => {
    expect(failingFields(loginSchema, { email: 'a@b.com', password: '' })).toEqual([
      'password',
    ]);
  });
});

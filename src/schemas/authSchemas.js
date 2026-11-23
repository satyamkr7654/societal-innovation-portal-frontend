import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const getRegisterSchema = (role) => {
  const baseSchema = {
    name: z.string().trim().min(2, 'Full name must be at least 2 characters'),
    email: z.string().trim().email('Please provide a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/\d/, 'Password must contain at least one number (0-9)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  };

  if (role === 'citizen') {
    baseSchema.phone = z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a valid 10-digit Indian phone number (starting with 6-9)'
      );
  } else if (role === 'university') {
    baseSchema.institutionName = z
      .string()
      .trim()
      .min(3, 'Institution name must be at least 3 characters (e.g. BIT Mesra)');
  } else if (role === 'industry') {
    baseSchema.companyName = z
      .string()
      .trim()
      .min(
        2,
        'Company/Organization name must be at least 2 characters (e.g. Tata Steel CSR)'
      );
  }

  return z.object(baseSchema).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
};
